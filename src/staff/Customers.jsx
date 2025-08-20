import { useState, useEffect } from 'react';
import StaffLayout from './StaffLayout';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Mail,
    Phone,
    Calendar,
    MapPin,
    User,
    MessageCircle
} from 'lucide-react';

const StaffCustomers = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        // Mock data
        setCustomers([
            {
                id: 1,
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@email.com',
                phone: '0123456789',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                joinDate: '2024-01-15',
                totalOrders: 5,
                totalSpent: 2500000,
                status: 'active',
                lastOrder: '2024-01-20',
                subscriptionType: 'Premium',
                deliveryPreferences: 'Buổi sáng (9:00-11:00)',
                notes: 'Khách hàng VIP, thích hoa hồng đỏ'
            },
            {
                id: 2,
                name: 'Trần Thị B',
                email: 'tranthib@email.com',
                phone: '0987654321',
                address: '456 Đường DEF, Quận 3, TP.HCM',
                joinDate: '2024-01-10',
                totalOrders: 3,
                totalSpent: 1800000,
                status: 'active',
                lastOrder: '2024-01-18',
                subscriptionType: 'Cơ Bản',
                deliveryPreferences: 'Buổi chiều (14:00-16:00)',
                notes: 'Khách hàng mới, cần tư vấn thêm'
            },
            {
                id: 3,
                name: 'Lê Văn C',
                email: 'levanc@email.com',
                phone: '0555666777',
                address: '789 Đường GHI, Quận 5, TP.HCM',
                joinDate: '2024-01-05',
                totalOrders: 8,
                totalSpent: 4500000,
                status: 'inactive',
                lastOrder: '2024-01-12',
                subscriptionType: 'VIP',
                deliveryPreferences: 'Buổi tối (18:00-20:00)',
                notes: 'Khách hàng cũ, tạm ngưng dịch vụ'
            },
            {
                id: 4,
                name: 'Phạm Thị D',
                email: 'phamthid@email.com',
                phone: '0333444555',
                address: '321 Đường JKL, Quận 7, TP.HCM',
                joinDate: '2024-01-20',
                totalOrders: 1,
                totalSpent: 299000,
                status: 'active',
                lastOrder: '2024-01-20',
                subscriptionType: 'Siêu VIP',
                deliveryPreferences: 'Buổi sáng (8:00-10:00)',
                notes: 'Khách hàng cao cấp, yêu cầu đặc biệt'
            },
            {
                id: 5,
                name: 'Hoàng Văn E',
                email: 'hoangvane@email.com',
                phone: '0222333444',
                address: '654 Đường MNO, Quận 10, TP.HCM',
                joinDate: '2024-01-08',
                totalOrders: 12,
                totalSpent: 6800000,
                status: 'active',
                lastOrder: '2024-01-22',
                subscriptionType: 'Premium',
                deliveryPreferences: 'Buổi chiều (15:00-17:00)',
                notes: 'Khách hàng trung thành, thường xuyên đặt hàng'
            }
        ]);
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setCustomers(prev => prev.map(customer =>
            customer.id === id ? { ...customer, status: newStatus } : customer
        ));
        console.log(`Customer ${id} status changed to: ${newStatus}`);
    };

    return (
        <StaffLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
                    <p className="text-gray-600">Xem thông tin và hỗ trợ khách hàng</p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm khách hàng..."
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

                {/* Customers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {customers.map((customer) => (
                        <div key={customer.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                                        <p className="text-sm text-gray-500">ID: #{customer.id}</p>
                                    </div>
                                </div>
                                <select
                                    value={customer.status}
                                    onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                                    className={`text-sm border-gray-300 rounded-md px-2 py-1 ${customer.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <div className="flex items-center mt-1">
                                            <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-900">{customer.email}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                                        <div className="flex items-center mt-1">
                                            <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-900">{customer.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                                    <div className="flex items-start mt-1">
                                        <MapPin className="h-3 w-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-900">{customer.address}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Ngày tham gia</p>
                                        <div className="flex items-center mt-1">
                                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-900">{customer.joinDate}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Gói dịch vụ</p>
                                        <span className="text-sm font-medium text-blue-600">{customer.subscriptionType}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                                        <span className="text-lg font-bold text-gray-900">{customer.totalOrders}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Tổng chi tiêu</p>
                                        <span className="text-lg font-bold text-green-600">{customer.totalSpent.toLocaleString()}đ</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Thời gian giao hàng ưa thích</p>
                                    <span className="text-sm text-gray-900">{customer.deliveryPreferences}</span>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                                    <span className="text-sm text-gray-600">{customer.notes}</span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <div className="text-xs text-gray-500">
                                        Đơn hàng cuối: {customer.lastOrder}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                            <Eye size={16} />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                                            <Edit size={16} />
                                        </button>
                                        <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50">
                                            <MessageCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng khách hàng</div>
                        <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Khách hàng hoạt động</div>
                        <div className="text-2xl font-bold text-green-600">
                            {customers.filter(customer => customer.status === 'active').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Khách VIP</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {customers.filter(customer => customer.subscriptionType === 'VIP' || customer.subscriptionType === 'Siêu VIP').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}đ
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default StaffCustomers;
