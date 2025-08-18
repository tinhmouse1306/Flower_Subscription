import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Reset password for:', email);
            setIsSubmitted(true);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">🌸</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">FlowerSub</span>
                    </Link>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Quên mật khẩu?
                    </h2>
                    <p className="text-gray-600">
                        Nhập email của bạn để nhận link đặt lại mật khẩu
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {!isSubmitted ? (
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Nhập email của bạn"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Đang gửi...
                                    </div>
                                ) : (
                                    'Gửi link đặt lại mật khẩu'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Email đã được gửi!
                                </h3>
                                <p className="text-gray-600">
                                    Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>.
                                    Vui lòng kiểm tra hộp thư và spam folder.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setEmail('');
                                    }}
                                    className="w-full btn-secondary py-3"
                                >
                                    Gửi lại email
                                </button>
                                <Link
                                    to="/login"
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Back to Login */}
                    {!isSubmitted && (
                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="flex items-center justify-center text-primary-600 hover:text-primary-500 font-medium"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        Cần hỗ trợ?
                    </h3>
                    <p className="text-sm text-blue-700 mb-3">
                        Nếu bạn gặp vấn đề khi đặt lại mật khẩu, hãy liên hệ với chúng tôi:
                    </p>
                    <div className="text-sm text-blue-700 space-y-1">
                        <p>📧 Email: support@flowersub.com</p>
                        <p>📞 Hotline: 1900-1234</p>
                        <p>💬 Chat: Hỗ trợ 24/7</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
