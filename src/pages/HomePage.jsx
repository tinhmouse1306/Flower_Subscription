import Hero from '../components/Hero';
import PackageCard from '../components/PackageCard';
import TestimonialCard from '../components/TestimonialCard';
import { flowerPackages, testimonials } from '../data/mockData';
import { ArrowRight, Star, Users, Truck, Clock } from 'lucide-react';

const HomePage = () => {
    const handlePackageSelect = (packageData) => {
        console.log('Selected package:', packageData);
        // TODO: Navigate to package details or checkout
    };

    return (
        <div>
            {/* Hero Section */}
            <Hero />

            {/* Packages Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Chọn gói hoa phù hợp với bạn
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chúng tôi cung cấp các gói hoa đa dạng với giá cả phù hợp cho sinh viên.
                            Tất cả đều bao gồm giao hàng miễn phí và hoa tươi mỗi tuần.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {flowerPackages.map((packageData) => (
                            <PackageCard
                                key={packageData.id}
                                package={packageData}
                                onSelect={handlePackageSelect}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="btn-secondary text-lg px-8 py-4 flex items-center mx-auto">
                            Xem tất cả gói hoa
                            <ArrowRight size={20} className="ml-2" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Tại sao chọn FlowerSub?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho sinh viên với
                            dịch vụ chất lượng cao và giá cả hợp lý.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Truck size={32} className="text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Giao hàng miễn phí
                            </h3>
                            <p className="text-gray-600">
                                Giao hàng tận nơi miễn phí cho tất cả các gói.
                                Đảm bảo hoa tươi và đúng hẹn.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock size={32} className="text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Linh hoạt thời gian
                            </h3>
                            <p className="text-gray-600">
                                Chọn số lần giao hàng trong tuần theo nhu cầu.
                                Có thể hủy hoặc thay đổi bất cứ lúc nào.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={32} className="text-pink-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Dành cho sinh viên
                            </h3>
                            <p className="text-gray-600">
                                Giá cả được thiết kế đặc biệt cho sinh viên.
                                Chất lượng cao với chi phí thấp.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Khách hàng nói gì về chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hơn 500+ sinh viên đã tin tưởng và sử dụng dịch vụ của chúng tôi.
                            Đây là những gì họ nói về FlowerSub.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <div className="inline-flex items-center px-6 py-3 bg-primary-50 text-primary-700 rounded-full">
                            <Star size={20} className="mr-2 fill-current" />
                            <span className="font-medium">Đánh giá trung bình: 4.9/5 từ 500+ khách hàng</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Sẵn sàng bắt đầu hành trình với hoa tươi?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho sinh viên mới.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-lg transition-colors duration-200 text-lg">
                            Đăng ký ngay
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-4 px-8 rounded-lg transition-colors duration-200 text-lg">
                            Liên hệ tư vấn
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
