import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, Clock, MapPin, CreditCard, Gift, Loader2, AlertCircle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { userAPI, subscriptionAPI } from '../utils/api';
import { isAuthenticated, getUserId } from '../utils/auth';
import Swal from 'sweetalert2';

const MySubscriptionsPage = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kiểm tra đăng nhập
    useEffect(() => {
        if (!isAuthenticated()) {
            Swal.fire({
                title: 'Cần đăng nhập!',
                text: 'Vui lòng đăng nhập để xem gói đăng ký!',
                icon: 'info',
                confirmButtonText: 'Đăng nhập ngay',
                confirmButtonColor: '#8B5CF6',
                showCancelButton: true,
                cancelButtonText: 'Hủy',
                cancelButtonColor: '#6B7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                } else {
                    navigate('/');
                }
            });
            return;
        }
    }, [navigate]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const userId = getUserId();
                if (!userId) {
                    throw new Error('Không thể lấy thông tin user');
                }

                // Fetch dashboard data
                try {
                    const dashboardRes = await userAPI.getDashboard(userId);
                    setDashboardData(dashboardRes.data.result);
                } catch (dashboardError) {
                    console.warn('Không thể tải dashboard data:', dashboardError);
                    setDashboardData(null);
                }

                // Fetch all subscriptions và filter theo userId
                try {
                    const subscriptionsRes = await subscriptionAPI.getAllSubscriptions();
                    console.log('All subscriptions:', subscriptionsRes.data);

                    // Filter subscriptions theo user hiện tại
                    const userSubscriptions = subscriptionsRes.data.filter(sub => {
                        console.log('Checking subscription:', sub);
                        console.log('Subscription user:', sub.user);
                        console.log('Current userId:', userId);
                        console.log('Subscription userId:', sub.user?.userId);

                        return sub.user && sub.user.userId === parseInt(userId);
                    });

                    console.log('Filtered user subscriptions:', userSubscriptions);
                    setSubscriptions(userSubscriptions);
                } catch (subscriptionError) {
                    console.error('Error fetching subscriptions:', subscriptionError);
                    setError('Không thể tải danh sách gói đăng ký. Vui lòng thử lại sau.');
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Không thể tải thông tin. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <ClockIcon className="w-5 h-5 text-yellow-500" />;
            case 'ACTIVE':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'CANCELLED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'COMPLETED':
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'ACTIVE':
                return 'Đang hoạt động';
            case 'CANCELLED':
                return 'Đã hủy';
            case 'COMPLETED':
                return 'Hoàn thành';
            default:
                return 'Không xác định';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin gói đăng ký...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Gói đăng ký của tôi
                    </h1>
                    <p className="text-xl text-gray-600">
                        Quản lý và theo dõi các gói hoa đã đăng ký
                    </p>
                </div>

                {/* Dashboard Summary */}
                {dashboardData && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Package className="w-6 h-6 text-primary-600 mr-3" />
                            Tổng quan gói đăng ký
                        </h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary-600 mb-2">
                                    {subscriptions.length}
                                </div>
                                <div className="text-gray-600">Tổng số gói</div>
                            </div>
                            {dashboardData.subscriptionPackage && (
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900 mb-2">
                                        {dashboardData.subscriptionPackage}
                                    </div>
                                    <div className="text-gray-600">Gói hiện tại</div>
                                </div>
                            )}
                            {dashboardData.deliveryDate && (
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900 mb-2">
                                        {formatDate(dashboardData.deliveryDate)}
                                    </div>
                                    <div className="text-gray-600">Ngày giao tiếp theo</div>
                                </div>
                            )}
                            {dashboardData.status && (
                                <div className="text-center">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dashboardData.status)}`}>
                                        {getStatusIcon(dashboardData.status)}
                                        <span className="ml-2">{getStatusText(dashboardData.status)}</span>
                                    </div>
                                    <div className="text-gray-600 mt-2">Trạng thái</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Subscriptions List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Calendar className="w-6 h-6 text-primary-600 mr-3" />
                            Danh sách gói đăng ký ({subscriptions.length})
                        </h2>
                    </div>

                    {subscriptions.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {subscriptions.map((subscription) => (
                                <div key={subscription.id} className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        {/* Left side - Subscription details */}
                                        <div className="flex-1">
                                            <div className="flex items-start space-x-4">
                                                {/* Package/Bouquet Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                </div>

                                                {/* Subscription Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Gói #{subscription.id}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                                            {getStatusIcon(subscription.status)}
                                                            <span className="ml-1">{getStatusText(subscription.status)}</span>
                                                        </span>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                                                        {/* Package Info */}
                                                        {subscription.package && (
                                                            <div className="flex items-center">
                                                                <Package className="w-4 h-4 mr-2 text-gray-400" />
                                                                <span>{subscription.package.name}</span>
                                                            </div>
                                                        )}

                                                        {/* Bouquet Info */}
                                                        {subscription.bouquet && (
                                                            <div className="flex items-center">
                                                                <Gift className="w-4 h-4 mr-2 text-gray-400" />
                                                                <span>{subscription.bouquet.name}</span>
                                                            </div>
                                                        )}

                                                        {/* Delivery Date */}
                                                        <div className="flex items-center">
                                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span>Giao: {formatDate(subscription.deliveryDate)}</span>
                                                        </div>

                                                        {/* Payment Method */}
                                                        <div className="flex items-center">
                                                            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span>Thanh toán: {subscription.paymentMethod}</span>
                                                        </div>

                                                        {/* Created Date */}
                                                        <div className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span>Tạo: {formatDate(subscription.createdAt)}</span>
                                                        </div>

                                                        {/* Price */}
                                                        {subscription.package && (
                                                            <div className="flex items-center">
                                                                <span className="font-semibold text-primary-600">
                                                                    {subscription.package.price?.toLocaleString('vi-VN')}đ
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Actions */}
                                        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                                            <button
                                                onClick={() => navigate(`/subscription-detail/${subscription.id}`)}
                                                className="btn-secondary text-sm px-4 py-2"
                                            >
                                                Xem chi tiết
                                            </button>
                                            {subscription.status === 'PENDING' && (
                                                <button
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: 'Xác nhận hủy gói?',
                                                            text: 'Bạn có chắc chắn muốn hủy gói đăng ký này?',
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Hủy gói',
                                                            cancelButtonText: 'Không',
                                                            confirmButtonColor: '#EF4444',
                                                            cancelButtonColor: '#6B7280'
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                // TODO: Implement cancel subscription
                                                                Swal.fire('Thành công!', 'Đã hủy gói đăng ký.', 'success');
                                                            }
                                                        });
                                                    }}
                                                    className="btn-danger text-sm px-4 py-2"
                                                >
                                                    Hủy gói
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Chưa có gói đăng ký nào
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn chưa đăng ký gói hoa nào. Hãy khám phá các gói hoa của chúng tôi!
                            </p>
                            <button
                                onClick={() => navigate('/packages')}
                                className="btn-primary"
                            >
                                Xem các gói hoa
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Calendar className="w-6 h-6 text-primary-600 mr-3" />
                        Quản lý gói đăng ký
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Đăng ký gói mới */}
                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg border border-primary-200">
                            <div className="text-center">
                                <Package className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Đăng ký gói mới
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Khám phá và đăng ký các gói hoa mới
                                </p>
                                <button
                                    onClick={() => navigate('/packages')}
                                    className="btn-primary w-full"
                                >
                                    Xem các gói hoa
                                </button>
                            </div>
                        </div>

                        {/* Theo dõi giao hàng */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Theo dõi giao hàng
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Kiểm tra lịch giao hàng và trạng thái
                                </p>
                                <button
                                    onClick={() => navigate('/subscription')}
                                    className="btn-secondary w-full"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>

                        {/* Liên hệ hỗ trợ */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                            <div className="text-center">
                                <CreditCard className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Hỗ trợ khách hàng
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Liên hệ để được hỗ trợ và tư vấn
                                </p>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="btn-secondary w-full"
                                >
                                    Liên hệ ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySubscriptionsPage;
