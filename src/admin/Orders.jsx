import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Search,
    Filter,
    Eye,
    Edit
} from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Mock data
        setOrders([
            { id: 1, customer: 'Nguyễn Văn A', package: 'Gói Cơ Bản', amount: 299000, status: 'pending', date: '2024-01-15', phone: '0123456789' },
            { id: 2, customer: 'Trần Thị B', package: 'Gói Premium', amount: 599000, status: 'confirmed', date: '2024-01-14', phone: '0987654321' },
            { id: 3, customer: 'Lê Văn C', package: 'Gói VIP', amount: 999000, status: 'delivered', date: '2024-01-13', phone: '0555666777' },
            { id: 4, customer: 'Phạm Thị D', package: 'Gói Cơ Bản', amount: 299000, status: 'processing', date: '2024-01-12', phone: '0333444555' },
            { id: 5, customer: 'Hoàng Văn E', package: 'Gói Premium', amount: 599000, status: 'shipping', date: '2024-01-11', phone: '0222333444' }
        ]);
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        ));
        console.log(`Order ${id} status changed to: ${newStatus}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            case 'shipping': return 'bg-orange-100 text-orange-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'processing': return 'Đang xử lý';
            case 'shipping': return 'Đang giao';
            case 'delivered': return 'Đã giao';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                    <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng trong hệ thống</p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm đơn hàng..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                                />
                            </div>
                            <button className="btn-secondary">
                                <Filter size={16} className="mr-2" />
                                Lọc
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã đơn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gói
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                            <div className="text-sm text-gray-500">{order.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{order.package}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.amount.toLocaleString()}đ</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{order.date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="text-sm border-gray-300 rounded-md"
                                            >
                                                <option value="pending">Chờ xác nhận</option>
                                                <option value="confirmed">Đã xác nhận</option>
                                                <option value="processing">Đang xử lý</option>
                                                <option value="shipping">Đang giao</option>
                                                <option value="delivered">Đã giao</option>
                                                <option value="cancelled">Đã hủy</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng đơn hàng</div>
                        <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Chờ xác nhận</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {orders.filter(order => order.status === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Đang xử lý</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {orders.filter(order => order.status === 'processing' || order.status === 'shipping').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Đã giao</div>
                        <div className="text-2xl font-bold text-green-600">
                            {orders.filter(order => order.status === 'delivered').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}đ
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
