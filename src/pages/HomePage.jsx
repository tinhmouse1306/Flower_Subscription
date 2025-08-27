import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import PackageCard from '../components/PackageCard';
import TestimonialCard from '../components/TestimonialCard';
import { testimonials } from '../data/mockData';
import { subscriptionAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import { ArrowRight, Star, Users, Truck, Clock, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const HomePage = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch packages from API
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await subscriptionAPI.getPackages();

                if (response.data && response.data.result) {
                    // Lấy 3 packages đầu tiên
                    setPackages(response.data.result.slice(0, 3));
                } else {
                    setPackages((response.data || []).slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
                setError('Không thể tải danh sách gói. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handlePackageSelect = (packageData) => {
        // Kiểm tra xem user đã đăng nhập chưa
        if (!isAuthenticated()) {
            // Hiển thị thông báo đẹp và chuyển hướng đến trang login
            Swal.fire({
                title: 'Cần đăng nhập!',
                text: 'Vui lòng đăng nhập để chọn gói hoa!',
                icon: 'info',
                confirmButtonText: 'Đăng nhập ngay',
                confirmButtonColor: '#8B5CF6',
                showCancelButton: true,
                cancelButtonText: 'Hủy',
                cancelButtonColor: '#6B7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        const id = packageData.packageId || packageData.id;
        navigate(`/subscription?packageId=${id}`);
    };

    const handleViewAllPackages = () => {
        navigate('/packages');
    };

    const handleChooseFlowers = () => {
        // Kiểm tra xem user đã đăng nhập chưa
        if (!isAuthenticated()) {
            // Hiển thị thông báo đẹp và chuyển hướng đến trang login
            Swal.fire({
                title: 'Cần đăng nhập!',
                text: 'Vui lòng đăng nhập để chọn hoa theo sở thích!',
                icon: 'info',
                confirmButtonText: 'Đăng nhập ngay',
                confirmButtonColor: '#8B5CF6',
                showCancelButton: true,
                cancelButtonText: 'Hủy',
                cancelButtonColor: '#6B7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        navigate('/flower-selection');
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
                            Chúng tôi cung cấp các gói hoa đa dạng với giá cả phù hợp.
                            Tất cả đều bao gồm giao hàng miễn phí và hoa tươi mỗi tuần.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <Loader2 className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Đang tải danh sách gói...
                            </h3>
                            <p className="text-gray-600">
                                Vui lòng chờ trong giây lát.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-400 mb-4">
                                <Star size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Không thể tải gói hoa
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : packages.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {packages.map((packageData) => (
                                <PackageCard
                                    key={packageData.packageId || packageData.id || Math.random()}
                                    package={packageData}
                                    onSelect={handlePackageSelect}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Star size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Chưa có gói hoa nào
                            </h3>
                            <p className="text-gray-600">
                                Hiện tại chưa có gói hoa nào được tạo.
                            </p>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleViewAllPackages}
                                className="btn-secondary text-lg px-8 py-4 flex items-center"
                            >
                                Xem tất cả gói hoa
                                <ArrowRight size={20} className="ml-2" />
                            </button>
                        </div>
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
                            Chúng tôi cam kết mang đến trải nghiệm tốt nhất với
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
                                Chất lượng cao
                            </h3>
                            <p className="text-gray-600">
                                Hoa tươi được chọn lọc kỹ lưỡng.
                                Đảm bảo chất lượng tốt nhất cho khách hàng.
                            </p>
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
                        Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
                        >
                            Đăng ký ngay
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
