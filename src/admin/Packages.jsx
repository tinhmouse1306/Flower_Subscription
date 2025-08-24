import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI, subscriptionAPI } from '../utils/api';
import { getToken } from '../utils/auth';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    RefreshCw
} from 'lucide-react';

const AdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('=== FETCHING PACKAGES ===');
            console.log('Current token:', getToken());
            console.log('Calling subscriptionAPI.getPackages()...');

            const response = await subscriptionAPI.getPackages();
            console.log('Packages API response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            console.log('Response data.result:', response.data?.result);

            if (response.data && Array.isArray(response.data)) {
                console.log('Setting packages:', response.data);
                // Transform API data to match our expected format
                const transformedPackages = response.data.map(pkg => ({
                    id: pkg.packageId,
                    name: pkg.name,
                    description: pkg.description,
                    price: pkg.price,
                    duration: `${pkg.durationMonths} tháng`,
                    status: 'active', // Default status since API doesn't provide it
                    sales: 0, // Default sales since API doesn't provide it
                    deliveriesPerMonth: pkg.deliveriesPerMonth
                }));
                setPackages(transformedPackages);
            } else {
                console.log('No packages found, setting empty array');
                setPackages([]);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            console.error('Error details:', error.response?.data);
            setError('Không thể tải danh sách gói dịch vụ');
            setPackages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa gói này?')) {
            try {
                // Tạm thời chỉ xóa ở frontend vì có thể API delete chưa có
                setPackages(prev => prev.filter(pkg => pkg.id !== id));
                console.log(`Package ${id} deleted from frontend`);
                alert('Tính năng xóa sẽ được cập nhật sau');
            } catch (error) {
                console.error('Error deleting package:', error);
                alert('Có lỗi xảy ra khi xóa gói dịch vụ');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            // Tạm thời chỉ update ở frontend vì có thể API update chưa có
            setPackages(prev => prev.map(pkg =>
                pkg.id === id ? { ...pkg, status: newStatus } : pkg
            ));
            console.log(`Package ${id} status changed to: ${newStatus} (frontend only)`);
            alert('Tính năng cập nhật trạng thái sẽ được cập nhật sau');
        } catch (error) {
            console.error('Error updating package status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái gói dịch vụ');
        }
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
                        <Link to="/admin/packages/add" className="btn-primary">
                            <Plus size={16} className="mr-2" />
                            Thêm gói mới
                        </Link>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách gói dịch vụ...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Packages Table */}
                {!isLoading && !error && (
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
                                            Giao hàng/tháng
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
                                                <div className="text-sm text-gray-900">{pkg.deliveriesPerMonth}</div>
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
                )}

                {/* Summary Stats */}
                {!isLoading && !error && (
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
                            <div className="text-sm font-medium text-gray-500">Tổng giao hàng/tháng</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {packages.reduce((sum, pkg) => sum + pkg.deliveriesPerMonth, 0)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPackages;
