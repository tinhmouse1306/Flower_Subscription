import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Mail,
    Phone,
    Calendar,
    MapPin,
    User
} from 'lucide-react';

const AdminCustomers = () => {
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
                lastOrder: '2024-01-20'
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
                lastOrder: '2024-01-18'
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
                lastOrder: '2024-01-12'
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
                lastOrder: '2024-01-20'
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
                lastOrder: '2024-01-22'
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
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
                    <p className="text-gray-600">Xem thông tin và quản lý tất cả khách hàng trong hệ thống</p>
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

                {/* Customers Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Liên hệ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tham gia
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng chi tiêu
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
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                    <div className="text-sm text-gray-500">ID: #{customer.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.email}</div>
                                            <div className="text-sm text-gray-500">{customer.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.joinDate}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{customer.totalOrders}</div>
                                            <div className="text-sm text-gray-500">Lần cuối: {customer.lastOrder}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {customer.totalSpent.toLocaleString()}đ
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={customer.status}
                                                onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                                                className={`text-sm border-gray-300 rounded-md px-2 py-1 ${customer.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                                    }`}
                                            >
                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Không hoạt động</option>
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
                                                <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50">
                                                    <Mail size={16} />
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
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <div className="text-sm font-medium text-gray-500">Tổng đơn hàng</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {customers.reduce((sum, customer) => sum + customer.totalOrders, 0)}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}đ
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCustomers;
