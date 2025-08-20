import { useState, useEffect } from 'react';
import StaffLayout from './StaffLayout';
import {
    Search,
    Filter,
    Eye,
    Phone,
    MapPin,
    Calendar,
    Clock
} from 'lucide-react';

const StaffOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Mock data
        setOrders([
            {
                id: 1,
                customer: 'Nguyễn Văn A',
                package: 'Gói Cơ Bản',
                amount: 299000,
                status: 'pending',
                date: '2024-01-15',
                phone: '0123456789',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                deliveryDate: '2024-01-16',
                notes: 'Giao vào buổi sáng'
            },
            {
                id: 2,
                customer: 'Trần Thị B',
                package: 'Gói Premium',
                amount: 599000,
                status: 'shipping',
                date: '2024-01-14',
                phone: '0987654321',
                address: '456 Đường DEF, Quận 3, TP.HCM',
                deliveryDate: '2024-01-15',
                notes: ''
            },
            {
                id: 3,
                customer: 'Lê Văn C',
                package: 'Gói VIP',
                amount: 999000,
                status: 'delivered',
                date: '2024-01-13',
                phone: '0555666777',
                address: '789 Đường GHI, Quận 5, TP.HCM',
                deliveryDate: '2024-01-14',
                notes: ''
            }
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
        <StaffLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                    <p className="text-gray-600">Cập nhật trạng thái và theo dõi đơn hàng</p>
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

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        Đơn hàng #{order.id}
                                    </h4>
                                    <p className="text-sm text-gray-600">{order.date}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Khách hàng</p>
                                    <p className="text-sm text-gray-900">{order.customer}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                                    <p className="text-sm text-gray-900">{order.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Gói dịch vụ</p>
                                    <p className="text-sm text-gray-900">{order.package}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Số tiền</p>
                                    <p className="text-sm text-gray-900">{order.amount.toLocaleString()}đ</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</p>
                                <p className="text-sm text-gray-900">{order.address}</p>
                            </div>

                            {order.notes && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú</p>
                                    <p className="text-sm text-gray-900">{order.notes}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            Ngày giao: {order.deliveryDate}
                                        </span>
                                    </div>
                                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                                        <Phone size={16} />
                                        <span className="text-sm">Gọi</span>
                                    </button>
                                </div>
                                <div className="flex space-x-2">
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
                                    <button className="btn-primary text-sm px-4 py-2">
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <div className="text-sm font-medium text-gray-500">Đang giao</div>
                        <div className="text-2xl font-bold text-orange-600">
                            {orders.filter(order => order.status === 'shipping').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Đã giao</div>
                        <div className="text-2xl font-bold text-green-600">
                            {orders.filter(order => order.status === 'delivered').length}
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default StaffOrders;
