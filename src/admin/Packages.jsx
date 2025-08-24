import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI, subscriptionAPI } from '../utils/api';
import Swal from 'sweetalert2';
import { getToken } from '../utils/auth';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const AdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

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
        // Hiển thị confirm dialog với SweetAlert2
        const result = await Swal.fire({
            title: 'Bạn muốn xóa gói này?',
            text: "Gói này sẽ mất đi sau khi xóa",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                console.log('Deleting package with ID:', id);

                // Gọi API DELETE
                const response = await adminAPI.deletePackage(id);
                console.log('Delete package response:', response);
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);

                // Kiểm tra response thành công
                if (response.status === 200 || response.status === 204 ||
                    (response.data && (response.data.code === 1010 || response.data.code === 200))) {

                    // Xóa khỏi state frontend
                    setPackages(prev => prev.filter(pkg => pkg.id !== id));

                    await Swal.fire({
                        icon: 'success',
                        title: 'Đã xóa!',
                        text: 'Gói dịch vụ đã được xóa thành công.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else {
                    throw new Error(response.data?.message || 'Có lỗi xảy ra khi xóa');
                }
            } catch (error) {
                console.error('Error deleting package:', error);
                console.error('Error response:', error.response);
                console.error('Error status:', error.response?.status);
                console.error('Error data:', error.response?.data);

                let errorMessage = 'Có lỗi xảy ra khi xóa gói dịch vụ';
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: errorMessage,
                    confirmButtonText: 'Thử lại'
                });
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

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPackages = packages.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(packages.length / itemsPerPage);

    // Chuyển trang
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Tạo mảng số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Hiển thị tất cả trang nếu tổng số trang <= 5
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Hiển thị 5 trang với logic thông minh
            if (currentPage <= 3) {
                // Trang đầu: hiển thị 1, 2, 3, 4, 5
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                // Trang cuối: hiển thị totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Trang giữa: hiển thị currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
            }
        }

        return pageNumbers;
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

                {/* Pagination */}
                {!isLoading && !error && totalPages > 1 && (
                    <div className="bg-white rounded-lg shadow p-4 mt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, packages.length)} trong tổng số {packages.length} gói dịch vụ
                            </div>
                            <div className="flex items-center space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => goToPage(pageNumber)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === pageNumber
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                {/* Next Button */}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={16} />
                                </button>
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
                                            Giá
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thời hạn
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
                                    {currentPackages.map((pkg) => (
                                        <tr key={pkg.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{pkg.price.toLocaleString()}đ</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{pkg.duration}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{pkg.deliveriesPerMonth}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/admin/packages/view/${pkg.id}`}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        to={`/admin/packages/edit/${pkg.id}`}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(pkg.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        title="Xóa"
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
