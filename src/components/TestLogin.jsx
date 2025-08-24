import { useState } from 'react';
import { setAuthData } from '../utils/auth';
import Swal from 'sweetalert2';

const TestLogin = () => {
    const [isLoading, setIsLoading] = useState(false);

    const testMockLogin = async (role = 'user') => {
        try {
            setIsLoading(true);

            let mockData;
            if (role === 'admin') {
                mockData = {
                    email: 'admin@flowersub.com',
                    name: 'Admin User',
                    role: 'admin',
                    authenticated: true
                };
            } else if (role === 'staff') {
                mockData = {
                    email: 'staff@flowersub.com',
                    name: 'Staff User',
                    role: 'staff',
                    authenticated: true
                };
            } else {
                mockData = {
                    email: 'user@test.com',
                    name: 'Test User',
                    role: 'user',
                    authenticated: true
                };
            }

            console.log('Testing mock login with:', mockData);

            // Set auth data
            setAuthData('mock-token-' + Date.now(), mockData);

            await Swal.fire({
                icon: 'success',
                title: 'Mock Login thành công!',
                text: `Đăng nhập với role: ${role}`,
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

            // Redirect based on role
            if (role === 'admin') {
                window.location.href = '/admin';
            } else if (role === 'staff') {
                window.location.href = '/staff';
            } else {
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Mock login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi Mock Login',
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

    return (
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">🔧 Test Login (Debug):</h3>
            <div className="space-y-3">
                <button
                    onClick={() => testMockLogin('user')}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? 'Đang xử lý...' : 'Test Login User'}
                </button>
                <button
                    onClick={() => testMockLogin('staff')}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {isLoading ? 'Đang xử lý...' : 'Test Login Staff'}
                </button>
                <button
                    onClick={() => testMockLogin('admin')}
                    disabled={isLoading}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
                >
                    {isLoading ? 'Đang xử lý...' : 'Test Login Admin'}
                </button>
            </div>
            <p className="text-sm text-yellow-700 mt-3">
                Sử dụng để test authentication flow và debug
            </p>
        </div>
    );
};

export default TestLogin;
