import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Clock, Shield } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            <Star size={16} className="mr-2" />
                            Dịch vụ đăng ký hoa hàng đầu cho sinh viên
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Hoa tươi mỗi tuần
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                                {" "}cho cuộc sống tươi đẹp
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Đăng ký gói hoa theo tuần với giá cả phù hợp cho sinh viên.
                            Hoa tươi, giao hàng đúng hẹn, và dịch vụ chất lượng cao.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/packages" className="btn-primary text-lg px-8 py-4 flex items-center justify-center group">
                                Khám phá gói hoa
                                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 font-medium py-4 px-8 rounded-lg transition-colors duration-200 text-lg">
                                Xem demo
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto lg:mx-0">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <Truck size={24} className="text-primary-600" />
                                </div>
                                <p className="text-sm text-gray-600">Giao hàng miễn phí</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <Clock size={24} className="text-secondary-600" />
                                </div>
                                <p className="text-sm text-gray-600">Đúng hẹn</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <Shield size={24} className="text-pink-600" />
                                </div>
                                <p className="text-sm text-gray-600">Chất lượng đảm bảo</p>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative">
                        <div className="relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=500&fit=crop"
                                alt="Beautiful flowers"
                                className="rounded-2xl shadow-2xl w-full"
                            />
                        </div>

                        {/* Floating Stats */}
                        <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary-600">500+</div>
                                <div className="text-sm text-gray-600">Sinh viên hài lòng</div>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-secondary-600">4.9</div>
                                <div className="text-sm text-gray-600">⭐ Đánh giá</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
