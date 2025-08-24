import { useState } from 'react';
import { setAuthData } from '../utils/auth';
import Swal from 'sweetalert2';

const DirectLogin = () => {
    const [isLoading, setIsLoading] = useState(false);

    const directLogin = async () => {
        try {
            setIsLoading(true);

            console.log('Direct login: Setting auth data...');

            const mockData = {
                email: 'test@example.com',
                name: 'Test User',
                role: 'user',
                authenticated: true
            };

            const token = 'direct-token-' + Date.now();

            console.log('Direct login: Token:', token);
            console.log('Direct login: UserData:', mockData);

            // Set auth data
            setAuthData(token, mockData);

            console.log('Direct login: Auth data set, checking localStorage...');
            console.log('localStorage token:', localStorage.getItem('token'));
            console.log('localStorage user:', localStorage.getItem('user'));

            await Swal.fire({
                icon: 'success',
                title: 'Direct Login thành công!',
                text: 'Token đã được lưu vào localStorage',
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

            // Redirect to home
            window.location.href = '/';

        } catch (error) {
            console.error('Direct login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi Direct Login',
                text: error.message || 'Có lỗi xảy ra',
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

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        console.log('=== Auth Check ===');
        console.log('Token:', token);
        console.log('User:', user);
        console.log('Token exists:', !!token);
        console.log('User exists:', !!user);
        console.log('==================');

        Swal.fire({
            icon: 'info',
            title: 'Auth Status',
            html: `
                <div class="text-left">
                    <p><strong>Token:</strong> ${token ? 'Exists' : 'Missing'}</p>
                    <p><strong>User:</strong> ${user ? 'Exists' : 'Missing'}</p>
                    <p><strong>Token Value:</strong> ${token || 'None'}</p>
                </div>
            `,
            confirmButtonText: 'OK',
            background: '#f8fafc',
            color: '#1f2937',
            customClass: {
                popup: 'rounded-lg shadow-xl',
                title: 'text-xl font-bold text-gray-900',
                content: 'text-gray-600'
            }
        });
    };

    const clearAuth = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Auth data cleared');

        Swal.fire({
            icon: 'success',
            title: 'Đã xóa auth data',
            text: 'localStorage đã được clear',
            showConfirmButton: false,
            timer: 1500,
            background: '#f8fafc',
            color: '#1f2937',
            customClass: {
                popup: 'rounded-lg shadow-xl',
                title: 'text-xl font-bold text-gray-900',
                content: 'text-gray-600'
            }
        });
    };

    return (
        <div className="mt-8 bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">🚨 Direct Login Test:</h3>
            <div className="space-y-3">
                <button
                    onClick={directLogin}
                    disabled={isLoading}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
                >
                    {isLoading ? 'Đang xử lý...' : 'Direct Login (Bypass Google)'}
                </button>
                <button
                    onClick={checkAuth}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Check Auth Status
                </button>
                <button
                    onClick={clearAuth}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                    Clear Auth Data
                </button>
            </div>
            <p className="text-sm text-red-700 mt-3">
                Test trực tiếp localStorage và authentication flow
            </p>
        </div>
    );
};

export default DirectLogin;
