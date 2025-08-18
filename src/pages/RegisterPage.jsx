import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, GraduationCap, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        studentId: '',
        university: '',
        major: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

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
            alert('Mật khẩu xác nhận không khớp!');
            setIsLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            console.log('Registration attempt:', formData);
            alert('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
            setIsLoading(false);
        }, 1000);
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                alert('Vui lòng điền đầy đủ thông tin cá nhân!');
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const universities = [
        'Đại học Kinh tế TP.HCM',
        'Đại học Bách Khoa TP.HCM',
        'Đại học Sư phạm TP.HCM',
        'Đại học Khoa học Tự nhiên TP.HCM',
        'Đại học Công nghệ Thông tin TP.HCM',
        'Đại học Ngoại thương TP.HCM',
        'Đại học Luật TP.HCM',
        'Đại học Y Dược TP.HCM',
        'Khác'
    ];

    const majors = [
        'Công nghệ thông tin',
        'Kinh tế',
        'Tài chính - Ngân hàng',
        'Marketing',
        'Quản trị kinh doanh',
        'Luật',
        'Y khoa',
        'Dược',
        'Sư phạm',
        'Khác'
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
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

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'}`}>
                                {currentStep > 1 ? <CheckCircle size={16} /> : '1'}
                            </div>
                            <span className="ml-2 text-sm font-medium">Thông tin cá nhân</span>
                        </div>
                        <div className={`w-8 h-1 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'}`}>
                                {currentStep > 2 ? <CheckCircle size={16} /> : '2'}
                            </div>
                            <span className="ml-2 text-sm font-medium">Xác minh sinh viên</span>
                        </div>
                        <div className={`w-8 h-1 ${currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'}`}>
                                3
                            </div>
                            <span className="ml-2 text-sm font-medium">Hoàn tất</span>
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên đệm *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Nhập họ và tên đệm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên *
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Nhập tên"
                                        />
                                    </div>
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
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ giao hàng
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="address"
                                            name="address"
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Nhập địa chỉ giao hàng"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn-primary px-8 py-3"
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Student Verification */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Xác minh sinh viên</h3>

                                <div className="flex items-center mb-6">
                                    <input
                                        type="checkbox"
                                        id="isStudent"
                                        checked={isStudent}
                                        onChange={(e) => setIsStudent(e.target.checked)}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isStudent" className="ml-2 text-lg font-medium text-gray-900">
                                        Tôi là sinh viên
                                    </label>
                                </div>

                                {isStudent && (
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                                                Mã số sinh viên *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    id="studentId"
                                                    name="studentId"
                                                    type="text"
                                                    required={isStudent}
                                                    value={formData.studentId}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="Nhập mã số sinh viên"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                                                Trường đại học *
                                            </label>
                                            <select
                                                id="university"
                                                name="university"
                                                required={isStudent}
                                                value={formData.university}
                                                onChange={handleInputChange}
                                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="">Chọn trường đại học</option>
                                                {universities.map((uni) => (
                                                    <option key={uni} value={uni}>{uni}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngành học
                                            </label>
                                            <select
                                                id="major"
                                                name="major"
                                                value={formData.major}
                                                onChange={handleInputChange}
                                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="">Chọn ngành học</option>
                                                {majors.map((major) => (
                                                    <option key={major} value={major}>{major}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="btn-secondary px-8 py-3"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn-primary px-8 py-3"
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Password & Terms */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Tạo mật khẩu</h3>

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

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="btn-secondary px-8 py-3"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !agreeToTerms}
                                        className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Đang đăng ký...
                                            </div>
                                        ) : (
                                            'Hoàn tất đăng ký'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
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

                {/* Student Benefits */}
                {isStudent && (
                    <div className="mt-8 bg-primary-50 rounded-lg p-6">
                        <div className="flex items-center mb-3">
                            <GraduationCap className="w-5 h-5 text-primary-600 mr-2" />
                            <h3 className="text-lg font-semibold text-primary-900">
                                Ưu đãi đặc biệt cho sinh viên
                            </h3>
                        </div>
                        <ul className="text-sm text-primary-700 space-y-1">
                            <li>• Giảm giá 15% cho tất cả gói hoa</li>
                            <li>• Giao hàng miễn phí</li>
                            <li>• Ưu đãi đặc biệt cho gói dài hạn</li>
                            <li>• Hỗ trợ 24/7</li>
                            <li>• Chương trình khuyến mãi riêng</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
