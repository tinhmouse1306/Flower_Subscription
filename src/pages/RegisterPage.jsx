import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { authAPI } from '../utils/api';
import Swal from 'sweetalert2';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Mật khẩu xác nhận không khớp!',
                confirmButtonColor: '#EF4444'
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await authAPI.register({
                userName: formData.userName,
                password: formData.password,
                email: formData.fullName,        // Swap: gửi fullName vào email field
                fullName: formData.email,        // Swap: gửi email vào fullName field
                status: true
            });

            const data = response.data;

            if (data.code === 1010) {
                // Success
                console.log('Registration successful:', data.result);

                console.log('Registration result:', data.result);

                // Show success popup
                await Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                    text: 'Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập để tiếp tục.',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });

                // Redirect to login after 1 second
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng ký thất bại',
                    text: data.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.',
                    confirmButtonColor: '#EF4444'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
            Swal.fire({
                icon: 'error',
                title: 'Lỗi đăng ký',
                text: errorMessage,
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">🌸</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">FlowerSub</span>
                    </Link>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Đăng ký tài khoản
                    </h2>
                    <p className="text-gray-600">
                        Tạo tài khoản để bắt đầu hành trình với hoa tươi
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h3>

                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    required
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Họ và tên *
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Nhập họ và tên đầy đủ"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
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
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                        </div>



                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu *
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
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Tạo mật khẩu (tối thiểu 8 ký tự)"
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="agree-terms"
                                name="agree-terms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                            />
                            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                                Tôi đồng ý với{' '}
                                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                                    Điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                                    Chính sách bảo mật
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !agreeToTerms}
                            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang đăng ký...
                                </div>
                            ) : (
                                'Đăng ký tài khoản'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Đã có tài khoản?{' '}
                            <Link
                                to="/login"
                                className="text-primary-600 hover:text-primary-500 font-medium"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
