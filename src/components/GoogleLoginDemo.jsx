import { useState } from 'react';
import { authAPI } from '../utils/api';
import { setAuthData } from '../utils/auth';
import Swal from 'sweetalert2';

const GoogleLoginDemo = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleMockGoogleLogin = async () => {
        try {
            setIsLoading(true);

            // Simulate Google login with mock data
            const mockGoogleData = {
                idToken: "mock-google-id-token-for-demo",
                user: {
                    email: "demo@google.com",
                    name: "Demo User",
                    uid: "mock-uid-123"
                }
            };

            console.log('Attempting mock Google login...');

            const response = await authAPI.googleLogin({ idToken: mockGoogleData.idToken });
            const data = response.data;

            if (data.code === 1010) {
                console.log('Mock Google login successful:', data.result);

                await Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập Google Demo thành công!',
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
                    title: 'Đăng nhập Demo thất bại',
                    text: data.message || 'Có lỗi xảy ra',
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
            console.error('Mock Google login error:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập Demo. Vui lòng thử lại.';
            Swal.fire({
                icon: 'error',
                title: 'Lỗi đăng nhập Demo',
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Demo Google Login</h3>
            <p className="text-sm text-yellow-800 mb-3">
                Test Google login với mock data (không cần Firebase thật)
            </p>
            <button
                onClick={handleMockGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-yellow-300 rounded-lg shadow-sm bg-yellow-100 text-sm font-medium text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                        Đang test...
                    </div>
                ) : (
                    <>
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Test Google Login (Demo)
                    </>
                )}
            </button>
        </div>
    );
};

export default GoogleLoginDemo;
