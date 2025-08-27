import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { authAPI } from '../utils/api';
import { setAuthData, isAuthenticated, getToken } from '../utils/auth';

import { auth, googleProvider, testFirebaseAuth } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import Swal from 'sweetalert2';


const LoginPage = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);



    // Function để decode JWT token
    const decodeToken = (token) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT token format');
            }

            // Decode payload
            const payload = parts[1];
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));

            // Decode header
            const header = parts[0];
            const paddedHeader = header + '='.repeat((4 - header.length % 4) % 4);
            const decodedHeader = atob(paddedHeader.replace(/-/g, '+').replace(/_/g, '/'));

            return {
                header: JSON.parse(decodedHeader),
                payload: JSON.parse(decodedPayload),
                signature: parts[2]
            };
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('vi-VN');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authAPI.login({
                userName: formData.userName,
                password: formData.password
            });

            const data = response.data;

            // Debug: Log API response để xem có fullName không
            console.log('📡 API Response:', data);
            console.log('📡 Result data:', data.result);
            console.log('📡 Result keys:', Object.keys(data.result || {}));
            console.log('📡 Full data structure:', JSON.stringify(data, null, 2));

            if (data.code === 1010 && data.result.authenticated) {
                // Decode token để lấy thông tin role
                const decodedToken = decodeToken(data.result.token);

                // Debug: Log toàn bộ payload để xem có fullName không
                if (decodedToken) {
                    console.log('🔓 Token Payload:', decodedToken.payload);
                    console.log('🔓 Available fields:', Object.keys(decodedToken.payload));
                    console.log('🔓 Token fullName:', decodedToken.payload.fullName);
                    console.log('🔓 Token name:', decodedToken.payload.name);
                    console.log('🔓 Token email:', decodedToken.payload.email);
                }

                // Show success notification with SweetAlert2
                await Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    text: 'Chào mừng bạn trở lại!',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });

                // Save auth data with role information
                const userData = {
                    userName: formData.userName,
                    authenticated: true,
                    role: decodedToken.payload.scope,
                    userId: decodedToken.payload.sub,
                    // Thử lấy fullName từ nhiều nguồn khác nhau
                    fullName: data.result.fullName ||
                        data.result.email ||
                        decodedToken.payload.fullName ||
                        decodedToken.payload.name ||
                        decodedToken.payload.email ||
                        formData.userName,
                    email: data.result.email ||
                        decodedToken.payload.email,
                    issuedAt: decodedToken.payload.iat,
                    expiresAt: decodedToken.payload.exp
                };

                setAuthData(data.result.token, userData);

                // Debug: Log userData để xem fullName
                console.log('👤 UserData saved:', userData);
                console.log('👤 FullName extracted:', userData.fullName);
                console.log('👤 Email extracted:', userData.email);

                // Redirect to appropriate dashboard based on role
                setTimeout(() => {
                    const role = decodedToken.payload.scope;

                    if (role === 'ADMIN' || role === 'admin') {
                        window.location.href = '/admin';
                    } else if (role === 'STAFF' || role === 'staff') {
                        window.location.href = '/staff';
                    } else {
                        window.location.href = '/'; // User thường
                    }
                }, 1000);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: data.message || 'Thông tin đăng nhập không chính xác',
                    confirmButtonText: 'Thử lại',
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
            }
        } catch (error) {
            let errorMessage = 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';

            if (error.response) {
                const serverError = error.response.data;

                if (serverError.code === 1007) {
                    errorMessage = 'Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại username và password.';
                } else {
                    errorMessage = serverError.message || `Server error: ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
            } else {
                errorMessage = error.message || 'Lỗi không xác định';
            }

            Swal.fire({
                icon: 'error',
                title: 'Lỗi đăng nhập',
                text: errorMessage,
                confirmButtonText: 'Thử lại',
                background: '#f8fafc',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-lg shadow-xl',
                    title: 'text-xl font-bold text-gray-900',
                    content: 'text-gray-600'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);

            console.log('🔍 Starting Google login with popup...');
            console.log('🔍 Current domain:', window.location.hostname);
            console.log('🔍 Current URL:', window.location.href);

            // Test Firebase Auth first
            await testFirebaseAuth();

            console.log('🔍 Auth object:', auth);
            console.log('🔍 Provider object:', googleProvider);

            // Use Firebase Auth from unified config
            const provider = googleProvider;

            if (!provider) {
                throw new Error('Firebase Auth not available');
            }

            // Configure Google provider
            provider.addScope('email');
            provider.addScope('profile');

            console.log('🔍 About to call signInWithPopup...');
            console.log('🔍 Auth object before call:', auth);
            console.log('🔍 Provider object before call:', provider);

            // Popup-based Google Sign-In
            const result = await signInWithPopup(auth, provider);
            console.log('🔍 Popup result:', result);
            console.log('🔍 User from popup:', result.user);

            if (result.user) {
                console.log('🔍 Google login successful:', result.user);

                const idToken = await result.user.getIdToken();
                console.log('🔍 Got ID token:', idToken);

                console.log('🔍 Calling BE API with token...');
                console.log('🔍 Token being sent:', idToken.substring(0, 50) + '...');
                const response = await authAPI.googleLogin({ idToken });
                console.log('🔍 BE API response:', response);
                console.log('🔍 Response status:', response.status);
                console.log('🔍 Response headers:', response.headers);
                const data = response.data;
                console.log('🔍 BE API data:', data);
                console.log('🔍 Data code:', data.code);
                console.log('🔍 Data message:', data.message);

                if (data.code === 1010) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập Google thành công!',
                        text: `Chào mừng ${data.result.name}!`,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        background: '#f8fafc',
                        color: '#1f2937',
                        customClass: {
                            popup: 'rounded-lg shadow-xl',
                            title: 'text-xl font-bold text-gray-900',
                            content: 'text-gray-600'
                        }
                    });

                    setAuthData(data.result.token, {
                        email: data.result.email,
                        name: data.result.name,
                        uid: data.result.uid,
                        authenticated: true
                    });

                    window.location.href = '/';
                } else {
                    throw new Error(data.message || 'Server authentication failed');
                }
            }

        } catch (error) {
            console.error('🔍 Google popup error:', error);
            console.error('🔍 Error response:', error.response);
            console.error('🔍 Error status:', error.response?.status);
            console.error('🔍 Error data:', error.response?.data);

            if (error.code === 'auth/popup-closed-by-user') {
                console.log('🔍 User closed popup');
                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Lỗi đăng nhập Google',
                text: error.message || 'Không thể đăng nhập với Google. Vui lòng thử lại.',
                confirmButtonText: 'Thử lại',
                background: '#f8fafc',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-lg shadow-xl',
                    title: 'text-xl font-bold text-gray-900',
                    content: 'text-gray-600'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">🌸</span>
                        </div>
                        <span className="ml-3 text-2xl font-bold text-gray-900">FlowerSub</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Đăng nhập</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    required
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Nhập mật khẩu của bạn"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>

                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Hoặc</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {isLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default LoginPage;
