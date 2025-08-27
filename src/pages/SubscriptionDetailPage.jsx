import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Package,
    Calendar,
    MapPin,
    Clock,
    CreditCard,
    Gift,
    User,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { subscriptionAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import Swal from 'sweetalert2';

const SubscriptionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kiểm tra đăng nhập
    useEffect(() => {
        if (!isAuthenticated()) {
            Swal.fire({
                title: 'Cần đăng nhập!',
                text: 'Vui lòng đăng nhập để xem chi tiết gói đăng ký!',
                icon: 'info',
                confirmButtonText: 'Đăng nhập ngay',
                confirmButtonColor: '#8B5CF6'
            }).then(() => {
                navigate('/login');
            });
            return;
        }
    }, [navigate]);

    // Fetch subscription detail
    useEffect(() => {
        const fetchSubscriptionDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await subscriptionAPI.getSubscriptionDetail(id);
                console.log('🔍 Subscription detail response:', response.data);
                setSubscription(response.data);

            } catch (error) {
                console.error('❌ Error fetching subscription detail:', error);
                setError('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSubscriptionDetail();
        }
    }, [id]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'ACTIVE':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'SUCCESS':
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'CANCELLED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'Chưa kích hoạt';
            case 'ACTIVE':
                return 'Đã kích hoạt';
            case 'SUCCESS':
                return 'Đã giao hàng';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'SUCCESS':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return price.toLocaleString('vi-VN') + 'đ';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin chi tiết...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/my-subscriptions')}
                        className="btn-primary"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy gói đăng ký</h3>
                    <p className="text-gray-600 mb-4">Gói đăng ký này không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate('/my-subscriptions')}
                        className="btn-primary"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/my-subscriptions')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại danh sách gói đăng ký
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Chi tiết gói đăng ký #{subscription.id}
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Trạng thái gói đăng ký
                                </h2>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                                    {getStatusIcon(subscription.status)}
                                    <span className="ml-2">{getStatusText(subscription.status)}</span>
                                </span>
                            </div>

                            {/* Status Description */}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                {subscription.status === 'AVAILABLE' && (
                                    <p className="text-gray-700">
                                        Gói đăng ký của bạn đã được tạo thành công và đang chờ kích hoạt.
                                        Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận và kích hoạt gói.
                                    </p>
                                )}
                                {subscription.status === 'ACTIVE' && (
                                    <p className="text-gray-700">
                                        Gói đăng ký đã được kích hoạt và đang hoạt động.
                                        Hoa sẽ được giao theo lịch trình đã đăng ký.
                                    </p>
                                )}
                                {subscription.status === 'SUCCESS' && (
                                    <p className="text-gray-700">
                                        Gói đăng ký đã hoàn thành và hoa đã được giao thành công.
                                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                                    </p>
                                )}
                                {subscription.status === 'CANCELLED' && (
                                    <p className="text-gray-700">
                                        Gói đăng ký đã bị hủy. Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Package Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-primary-600" />
                                Thông tin gói
                            </h2>
                            {subscription.subscriptionPackage && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Tên gói</label>
                                        <p className="text-lg font-semibold text-gray-900">{subscription.subscriptionPackage.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Mã gói</label>
                                        <p className="text-lg font-semibold text-gray-900">#{subscription.subscriptionPackage.packageId}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Mô tả</label>
                                        <p className="text-gray-900">{subscription.subscriptionPackage.description}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Giá</label>
                                        <p className="text-lg font-semibold text-primary-600">{formatPrice(subscription.price)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Thời hạn</label>
                                        <p className="text-gray-900">{subscription.subscriptionPackage.durationMonths} tháng</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Số lần giao/tháng</label>
                                        <p className="text-gray-900">{subscription.subscriptionPackage.deliveriesPerMonth} lần</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bouquet Information */}
                        {subscription.bouquet && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Gift className="w-5 h-5 mr-2 text-primary-600" />
                                    Thông tin bó hoa
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Tên bó hoa</label>
                                        <p className="text-lg font-semibold text-gray-900">{subscription.bouquet.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Mô tả</label>
                                        <p className="text-gray-900">{subscription.bouquet.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delivery Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                                Thông tin giao hàng
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Ngày giao hàng</label>
                                    <p className="text-gray-900">{formatDate(subscription.deliveryDate)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Phương thức thanh toán</label>
                                    <p className="text-gray-900">{subscription.paymentMethod}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Ngày tạo</label>
                                    <p className="text-gray-900">{formatDate(subscription.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                                    <p className="text-gray-900">{formatDate(subscription.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mã đăng ký:</span>
                                    <span className="font-semibold">#{subscription.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                        {getStatusText(subscription.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá gói:</span>
                                    <span className="font-semibold text-primary-600">{formatPrice(subscription.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày tạo:</span>
                                    <span className="font-semibold">{formatDate(subscription.createdAt)}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <button
                                    onClick={() => navigate('/my-subscriptions')}
                                    className="w-full btn-secondary"
                                >
                                    Quay lại danh sách
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetailPage;
