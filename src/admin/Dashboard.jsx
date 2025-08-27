import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    BarChart3,
    Flower,
    Gift
} from 'lucide-react';
import { userAPI, subscriptionAPI, adminAPI } from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel with timeout
            const timeout = 10000; // 10 seconds
            const [usersRes, subscriptionsRes, packagesRes, flowersRes, bouquetsRes] = await Promise.all([
                userAPI.getUsers(),
                subscriptionAPI.getAllSubscriptions(),
                subscriptionAPI.getPackages(),
                subscriptionAPI.getFlowers(), // Use flowers endpoint with auth
                adminAPI.getBouquets()
            ].map(promise =>
                Promise.race([
                    promise,
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Request timeout')), timeout)
                    )
                ])
            ));

            // Debug logs
            console.log('🔍 Users response:', usersRes.data);
            console.log('🔍 Subscriptions response:', subscriptionsRes.data);
            console.log('🔍 Packages response:', packagesRes.data);
            console.log('🔍 Flowers response:', flowersRes.data);
            console.log('🔍 Bouquets response:', bouquetsRes.data);

            // Calculate stats
            const totalUsers = usersRes.data.result?.length || usersRes.data?.length || 0;
            const totalSubscriptions = subscriptionsRes.data?.length || 0;
            const totalPackages = packagesRes.data?.length || 0;
            const totalFlowers = flowersRes.data?.length || 0;
            const totalBouquets = bouquetsRes.data?.length || 0;

            // Calculate total revenue from ACTIVE and SUCCESS subscriptions
            const totalRevenue = subscriptionsRes.data?.reduce((sum, sub) => {
                if (sub.status === 'ACTIVE' || sub.status === 'COMPLETED') {
                    return sum + (sub.price || 0);
                }
                return sum;
            }, 0) || 0;

            setStats([
                {
                    title: 'Tổng doanh thu',
                    value: totalRevenue.toLocaleString('vi-VN'),
                    icon: DollarSign,
                    color: 'text-green-600',
                    bg: 'bg-green-100'
                },
                {
                    title: 'Tổng đăng ký',
                    value: totalSubscriptions.toString(),
                    icon: ShoppingCart,
                    color: 'text-blue-600',
                    bg: 'bg-blue-100'
                },
                {
                    title: 'Khách hàng',
                    value: totalUsers.toString(),
                    icon: Users,
                    color: 'text-purple-600',
                    bg: 'bg-purple-100'
                },
                {
                    title: 'Gói dịch vụ',
                    value: totalPackages.toString(),
                    icon: Package,
                    color: 'text-orange-600',
                    bg: 'bg-orange-100'
                },
                {
                    title: 'Loại hoa',
                    value: totalFlowers.toString(),
                    icon: Flower,
                    color: 'text-pink-600',
                    bg: 'bg-pink-100'
                },
                {
                    title: 'Bó hoa',
                    value: totalBouquets.toString(),
                    icon: Gift,
                    color: 'text-red-600',
                    bg: 'bg-red-100'
                }
            ]);

            // Set recent orders from subscriptions
            const recentSubscriptions = subscriptionsRes.data?.slice(0, 5).map(sub => ({
                id: sub.id,
                customer: sub.user?.fullName || sub.user?.userName || 'Khách hàng',
                package: sub.subscriptionPackage?.name || 'Gói dịch vụ',
                amount: sub.price || 0,
                status: sub.status?.toLowerCase() || 'pending',
                date: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('vi-VN') : 'N/A'
            })) || [];

            setRecentOrders(recentSubscriptions);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-400 mb-4">
                            <BarChart3 size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                fetchDashboardData();
                            }}
                            className="btn-primary"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
                    <p className="text-gray-600">Chào mừng bạn trở lại! Đây là tổng quan về hệ thống FlowerSub</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Data */}
                <div className="grid grid-cols-1 gap-6">

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Đăng ký gần đây</h3>
                            <button className="text-sm text-red-600 hover:text-red-700">Xem tất cả</button>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">{order.customer}</p>
                                        <p className="text-sm text-gray-500">{order.package}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{order.amount.toLocaleString()}đ</p>
                                        <span className={`text-xs px-2 py-1 rounded ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'available' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status === 'completed' ? 'Đã hoàn thành' :
                                                order.status === 'active' ? 'Đã kích hoạt' :
                                                    order.status === 'available' ? 'Chưa kích hoạt' :
                                                        'Không xác định'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Package className="h-8 w-8 text-red-600 mr-3" />
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Quản lý gói</p>
                                <p className="text-sm text-gray-500">Thêm, sửa, xóa gói dịch vụ</p>
                            </div>
                        </button>
                        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Xem đơn hàng</p>
                                <p className="text-sm text-gray-500">Quản lý tất cả đơn hàng</p>
                            </div>
                        </button>
                        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Báo cáo</p>
                                <p className="text-sm text-gray-500">Xem báo cáo chi tiết</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
