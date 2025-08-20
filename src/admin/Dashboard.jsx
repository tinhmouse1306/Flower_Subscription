import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        // Mock data
        setStats([
            { title: 'Tổng doanh thu', value: '15,250,000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
            { title: 'Đơn hàng mới', value: '24', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
            { title: 'Khách hàng', value: '156', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
            { title: 'Gói đang hoạt động', value: '8', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' }
        ]);

        setRecentOrders([
            { id: 1, customer: 'Nguyễn Văn A', package: 'Gói Cơ Bản', amount: 299000, status: 'pending', date: '2024-01-15' },
            { id: 2, customer: 'Trần Thị B', package: 'Gói Premium', amount: 599000, status: 'confirmed', date: '2024-01-14' },
            { id: 3, customer: 'Lê Văn C', package: 'Gói VIP', amount: 999000, status: 'delivered', date: '2024-01-13' },
            { id: 4, customer: 'Phạm Thị D', package: 'Gói Cơ Bản', amount: 299000, status: 'processing', date: '2024-01-12' },
            { id: 5, customer: 'Hoàng Văn E', package: 'Gói Premium', amount: 599000, status: 'shipping', date: '2024-01-11' }
        ]);
    }, []);

    return (
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
                    <p className="text-gray-600">Chào mừng bạn trở lại! Đây là tổng quan về hệ thống FlowerSub</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                {/* Charts and Recent Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Doanh thu tháng</h3>
                            <button className="text-sm text-red-600 hover:text-red-700">Xem chi tiết</button>
                        </div>
                        <div className="h-64 bg-gray-50 rounded border flex items-center justify-center">
                            <div className="text-center">
                                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Biểu đồ doanh thu</p>
                                <p className="text-sm text-gray-400 mt-2">Dữ liệu sẽ được hiển thị ở đây</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
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
                                        <span className={`text-xs px-2 py-1 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                    order.status === 'shipping' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status === 'delivered' ? 'Đã giao' :
                                                order.status === 'confirmed' ? 'Đã xác nhận' :
                                                    order.status === 'processing' ? 'Đang xử lý' :
                                                        order.status === 'shipping' ? 'Đang giao' :
                                                            'Chờ xác nhận'}
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
