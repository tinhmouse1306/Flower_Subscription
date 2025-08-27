import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { subscriptionAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import { Filter, Search, Star, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';


const PackagesPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDelivery, setSelectedDelivery] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'basic', name: 'Cơ bản' },
        { id: 'premium', name: 'Premium' },
        { id: 'budget', name: 'Tiết kiệm' }
    ];

    // Fetch packages from API
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching packages from API...');
                const response = await subscriptionAPI.getPackages();
                console.log('API Response:', response);
                console.log('Packages data:', response.data);

                if (response.data && response.data.result) {
                    setPackages(response.data.result);
                } else {
                    setPackages(response.data || []);
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
                setError('Không thể tải danh sách gói. Vui lòng đăng nhập trước.');
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const filteredPackages = packages.filter(packageData => {
        const matchesCategory = selectedCategory === 'all' || packageData.category === selectedCategory;
        const matchesSearch = packageData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            packageData.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Gói hoa của chúng tôi
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chọn gói hoa phù hợp với nhu cầu và ngân sách của bạn.
                            Tất cả gói đều bao gồm giao hàng miễn phí và hoa tươi mỗi tuần.
                        </p>

                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm gói hoa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center space-x-4">
                            <Filter size={20} className="text-gray-500" />
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                            <Search size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Cần đăng nhập
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {error}
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                ) : filteredPackages.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPackages.map((packageData) => (
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
                            <Search size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Không tìm thấy gói hoa
                        </h3>
                        <p className="text-gray-600">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
                        </p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default PackagesPage;
