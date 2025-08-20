import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';

const AdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Mock data
        setPackages([
            { id: 1, name: 'Gói Cơ Bản', price: 299000, duration: '1 tháng', status: 'active', sales: 45, description: '1 bó hoa/tuần' },
            { id: 2, name: 'Gói Premium', price: 599000, duration: '3 tháng', status: 'active', sales: 23, description: '2 bó hoa/tuần' },
            { id: 3, name: 'Gói VIP', price: 999000, duration: '6 tháng', status: 'inactive', sales: 12, description: '3 bó hoa/tuần' },
            { id: 4, name: 'Gói Siêu VIP', price: 1499000, duration: '12 tháng', status: 'active', sales: 8, description: '4 bó hoa/tuần' }
        ]);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa gói này?')) {
            setPackages(prev => prev.filter(pkg => pkg.id !== id));
            console.log(`Deleting package with id: ${id}`);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setPackages(prev => prev.map(pkg =>
            pkg.id === id ? { ...pkg, status: newStatus } : pkg
        ));
        console.log(`Package ${id} status changed to: ${newStatus}`);
    };

    return (
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý gói đăng ký</h1>
                    <p className="text-gray-600">Thêm, sửa, xóa và quản lý các gói dịch vụ</p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm gói dịch vụ..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                                />
                            </div>
                            <button className="btn-secondary">
                                <Filter size={16} className="mr-2" />
                                Lọc
                            </button>
                        </div>
                        <button className="btn-primary">
                            <Plus size={16} className="mr-2" />
                            Thêm gói mới
                        </button>
                    </div>
                </div>

                {/* Packages Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên gói
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời hạn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đã bán
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{pkg.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{pkg.price.toLocaleString()}đ</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{pkg.duration}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={pkg.status}
                                                onChange={(e) => handleStatusChange(pkg.id, e.target.value)}
                                                className={`text-sm border-gray-300 rounded-md px-2 py-1 ${pkg.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                                    }`}
                                            >
                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Tạm dừng</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{pkg.sales}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pkg.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
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
                        <div className="text-sm font-medium text-gray-500">Tổng số gói</div>
                        <div className="text-2xl font-bold text-gray-900">{packages.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Đang hoạt động</div>
                        <div className="text-2xl font-bold text-green-600">
                            {packages.filter(pkg => pkg.status === 'active').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tạm dừng</div>
                        <div className="text-2xl font-bold text-red-600">
                            {packages.filter(pkg => pkg.status === 'inactive').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {packages.reduce((sum, pkg) => sum + (pkg.price * pkg.sales), 0).toLocaleString()}đ
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPackages;
