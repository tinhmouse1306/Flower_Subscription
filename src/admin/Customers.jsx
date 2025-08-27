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
    User,
    RefreshCw
} from 'lucide-react';
import { userAPI } from '../utils/api';
import Swal from 'sweetalert2';
import UpdateUserModal from './UpdateUserModal';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getUsers();
            console.log('🔍 Users response:', response.data);

            // Handle different response structures
            const usersData = response.data.result || response.data || [];
            setCustomers(usersData);
        } catch (error) {
            console.error('Error fetching customers:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải danh sách khách hàng',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (userId, userName) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa user "${userName}"?`,
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#dc2626',
        });

        if (result.isConfirmed) {
            try {
                await userAPI.deleteUser(userId);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã xóa user thành công',
                });
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể xóa user',
                });
            }
        }
    };

    const handleUpdateUser = (userId) => {
        setSelectedUserId(userId);
        setUpdateModalOpen(true);
    };

    const handleUpdateSuccess = () => {
        fetchCustomers();
    };

    const handleViewUser = async (userId) => {
        try {
            const response = await userAPI.getUser(userId);
            const user = response.data.result;

            Swal.fire({
                title: 'Thông tin User',
                html: `
                    <div class="text-left">
                        <p><strong>ID:</strong> ${user.userId}</p>
                        <p><strong>Tên:</strong> ${user.fullName || 'N/A'}</p>
                        <p><strong>Username:</strong> ${user.userName || 'N/A'}</p>
                        <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
                        <p><strong>Vai trò:</strong> ${user.roles?.[0]?.userType || 'USER'}</p>
                        <p><strong>Trạng thái:</strong> ${user.status ? 'Hoạt động' : 'Không hoạt động'}</p>
                    </div>
                `,
                icon: 'info',
                confirmButtonText: 'Đóng'
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải thông tin user',
            });
        }
    };

    const filteredCustomers = customers.filter(customer => {
        // Filter out admin accounts
        const userRole = customer.roles?.[0]?.userType || 'USER';
        if (userRole === 'ADMIN') return false;

        // Filter by search term
        const matchesSearch = customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.userName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách khách hàng...</p>
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                                />
                            </div>
                            <button
                                onClick={fetchCustomers}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <RefreshCw size={16} />
                                <span>Làm mới</span>
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
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => {
                                        // Get role from customer.roles array
                                        const userRole = customer.roles?.[0]?.userType || 'USER';

                                        return (
                                            <tr key={customer.userId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                                <User className="h-6 w-6 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {customer.fullName || customer.userName || 'Không có tên'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {customer.email || customer.userName || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-xs px-2 py-1 rounded ${userRole === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                        }`}>
                                                        {userRole === 'STAFF' ? 'Staff' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewUser(customer.userId)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateUser(customer.userId)}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                            title="Cập nhật"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(customer.userId, customer.fullName || customer.userName)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            title="Xóa"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng khách hàng</div>
                        <div className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Staff</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {filteredCustomers.filter(customer => customer.roles?.[0]?.userType === 'STAFF').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">User</div>
                        <div className="text-2xl font-bold text-green-600">
                            {filteredCustomers.filter(customer => customer.roles?.[0]?.userType === 'USER').length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Update User Modal */}
            <UpdateUserModal
                isOpen={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                userId={selectedUserId}
                onSuccess={handleUpdateSuccess}
            />
        </AdminLayout>
    );
};

export default AdminCustomers;
