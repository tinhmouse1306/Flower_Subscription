import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI, subscriptionAPI } from '../utils/api';
import Swal from 'sweetalert2';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Flower,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const AdminFlowers = () => {
    const [flowers, setFlowers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    useEffect(() => {
        fetchFlowers();
    }, []);

    const fetchFlowers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('=== FETCHING FLOWERS ===');
            const response = await subscriptionAPI.getFlowers();
            console.log('Flowers API response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            if (response.data && Array.isArray(response.data)) {
                console.log('Setting flowers:', response.data);
                // Transform data to ensure all required fields exist
                const transformedFlowers = response.data.map(flower => ({
                    id: flower.id || flower.flowerId || 0,
                    name: flower.name || flower.type || 'Chưa có tên',
                    description: flower.description || 'Chưa có mô tả',
                    stock: flower.stock || flower.stockQuantity || 0,
                    category: flower.category || flower.color || 'Chưa phân loại',
                    image: flower.image || flower.imageUrl || ''
                }));
                console.log('Transformed flowers:', transformedFlowers);
                setFlowers(transformedFlowers);
            } else {
                console.log('No flowers found, setting empty array');
                setFlowers([]);
            }
        } catch (error) {
            console.error('Error fetching flowers:', error);
            console.error('Error details:', error.response?.data);
            setError('Không thể tải danh sách loại hoa');
            setFlowers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có, xóa nó!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                console.log('Deleting flower with ID:', id);

                const response = await adminAPI.deleteFlower(id);

                console.log('Delete flower response:', response);

                if (response.status === 200 || response.status === 204 ||
                    (response.data && (response.data.code === 1010 || response.data.code === 200))) {
                    setFlowers(prev => prev.filter(flower => flower.id !== id));

                    await Swal.fire({
                        icon: 'success',
                        title: 'Đã xóa!',
                        text: 'Loại hoa đã được xóa thành công.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else {
                    throw new Error('Failed to delete flower');
                }
            } catch (error) {
                console.error('Error deleting flower:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi xóa loại hoa',
                    confirmButtonText: 'Thử lại'
                });
            }
        }
    };



    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFlowers = flowers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(flowers.length / itemsPerPage);

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
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
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
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý loại hoa</h1>
                    <p className="text-gray-600">Thêm, sửa, xóa và quản lý các loại hoa trong hệ thống</p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm loại hoa..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                                />
                            </div>
                            <button className="btn-secondary">
                                <Filter size={16} className="mr-2" />
                                Lọc
                            </button>
                        </div>
                        <Link to="/admin/flowers/add" className="btn-primary">
                            <Plus size={16} className="mr-2" />
                            Thêm hoa mới
                        </Link>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách loại hoa...</p>
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

                {/* Flowers Grid */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentFlowers.map((flower) => (
                            <div key={flower.id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="relative">
                                    <img
                                        src={flower.image || 'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh'}
                                        alt={flower.name || 'Hoa'}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh';
                                        }}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                                            Có sẵn
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{flower.name || 'Chưa có tên'}</h3>
                                        <div className="flex space-x-1">
                                            <Link
                                                to={`/admin/flowers/view/${flower.id}`}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                to={`/admin/flowers/edit/${flower.id}`}
                                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(flower.id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{flower.category || 'Chưa phân loại'}</p>
                                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{flower.description || 'Chưa có mô tả'}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Còn: {flower.stock || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng số loại hoa</div>
                        <div className="text-2xl font-bold text-gray-900">{flowers.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Có sẵn</div>
                        <div className="text-2xl font-bold text-green-600">
                            {flowers.length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tạm hết</div>
                        <div className="text-2xl font-bold text-red-600">
                            0
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng tồn kho</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {flowers.reduce((sum, flower) => sum + (flower.stock || 0), 0)}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {!isLoading && !error && totalPages > 1 && (
                    <div className="bg-white rounded-lg shadow p-4 mt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, flowers.length)} trong tổng số {flowers.length} loại hoa
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
            </div>
        </AdminLayout>
    );
};

export default AdminFlowers;
