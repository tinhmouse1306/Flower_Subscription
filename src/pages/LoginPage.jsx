import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { authAPI } from '../utils/api';
import { setAuthData } from '../utils/auth';
import { adminAccounts, staffAccounts, userAccounts } from '../data/mockData';
import Swal from 'sweetalert2';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
            // Check mock accounts first
            const allAccounts = [...adminAccounts, ...staffAccounts, ...userAccounts];
            const mockAccount = allAccounts.find(
                account => account.email === formData.email && account.password === formData.password
            );

            if (mockAccount) {
                // Mock successful login
                console.log('Mock login successful:', mockAccount);

                // Show success notification with SweetAlert2
                await Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    text: `Chào mừng ${mockAccount.name}!`,
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

                setAuthData('mock-token-' + mockAccount.id, {
                    email: mockAccount.email,
                    name: mockAccount.name,
                    role: mockAccount.role,
                    authenticated: true
                });

                // Redirect based on role
                if (mockAccount.role === 'admin') {
                    window.location.href = '/admin';
                } else if (mockAccount.role === 'staff') {
                    window.location.href = '/staff';
                } else {
                    window.location.href = '/';
                }
                return;
            }

            // If not found in mock data, try real API
            const response = await authAPI.login({
                userName: formData.email,
                password: formData.password
            });

            const data = response.data;
            if (data.code === 1010 && data.result.authenticated) {
                console.log('Login successful:', data.result);

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

                setAuthData(data.result.token, {
                    email: formData.email,
                    authenticated: true
                });
                window.location.href = '/';
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
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';
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
            if (typeof window !== 'undefined' && window.firebase) {
                const auth = window.firebase.auth();
                const provider = new window.firebase.auth.GoogleAuthProvider();
                const result = await auth.signInWithPopup(provider);
                const idToken = await result.user.getIdToken();
                const response = await authAPI.googleLogin(idToken);
                const data = response.data;
                if (data.code === 1010) {
                    console.log('Google login successful:', data.result);

                    // Show success notification with SweetAlert2
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Đăng nhập Google thất bại',
                        text: data.message,
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
            } else {
                console.log('Firebase not available, using mock login');
                const response = await authAPI.googleLogin("mock-google-id-token-for-demo");
                const data = response.data;
                if (data.code === 1010) {

                    // Show success notification with SweetAlert2
                    await Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập Google thành công!',
                        text: 'Chế độ demo - Chào mừng bạn!',
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Đăng nhập Google thất bại',
                        text: data.message,
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
            }
        } catch (error) {
            console.error('Google login error:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập Google. Vui lòng thử lại.';
            Swal.fire({
                icon: 'error',
                title: 'Lỗi đăng nhập Google',
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Nhập email của bạn"
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
                                Đăng nhập với Google
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

                {/* Test Accounts Info */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Tài khoản test:</h3>
                    <div className="space-y-3 text-sm">
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium text-blue-900">Admin:</p>
                            <p className="text-gray-700">Email: admin@flowersub.com | Password: admin123</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium text-blue-900">Staff:</p>
                            <p className="text-gray-700">Email: staff@flowersub.com | Password: staff123</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium text-blue-900">User:</p>
                            <p className="text-gray-700">Email: user@test.com | Password: user123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
