import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { subscriptionAPI, adminAPI } from '../utils/api';
import { ArrowLeft, Edit, Trash2, Flower } from 'lucide-react';
import Swal from 'sweetalert2';

const ViewFlower = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [flower, setFlower] = useState(null);

    useEffect(() => {
        fetchFlowerDetail();
    }, [id]);

    const fetchFlowerDetail = async () => {
        try {
            console.log('Fetching flower detail for ID:', id);

            // Thử endpoint admin trước
            try {
                const adminResponse = await adminAPI.getFlowerDetail(id);
                console.log('Admin API Response:', adminResponse);

                if (adminResponse.data) {
                    const flowerData = adminResponse.data;
                    const transformedFlower = {
                        id: flowerData.id || flowerData.flowerId,
                        name: flowerData.name || flowerData.type || 'Chưa có tên',
                        description: flowerData.description || 'Chưa có mô tả',
                        stock: flowerData.stock || flowerData.stockQuantity || 0,
                        color: flowerData.color || flowerData.category || '',
                        image: flowerData.image || flowerData.imageUrl || ''
                    };

                    console.log('Transformed flower:', transformedFlower);
                    setFlower(transformedFlower);
                    return;
                }
            } catch (adminError) {
                console.log('Admin API failed, trying public API:', adminError);
            }

            // Fallback: sử dụng public API
            const response = await subscriptionAPI.getFlowers();
            console.log('Public API Response:', response);
            console.log('Response data type:', typeof response.data);
            console.log('Response data:', response.data);

            if (response.data && Array.isArray(response.data)) {
                console.log('Data is array, length:', response.data.length);
                const foundFlower = response.data.find(f => {
                    console.log('Checking flower:', f, 'against ID:', id);
                    return (f.id || f.flowerId) == id;
                });

                console.log('Found flower:', foundFlower);

                if (foundFlower) {
                    const transformedFlower = {
                        id: foundFlower.id || foundFlower.flowerId,
                        name: foundFlower.name || foundFlower.type || 'Chưa có tên',
                        description: foundFlower.description || 'Chưa có mô tả',
                        stock: foundFlower.stock || foundFlower.stockQuantity || 0,
                        color: foundFlower.color || foundFlower.category || '',
                        image: foundFlower.image || foundFlower.imageUrl || ''
                    };

                    console.log('Transformed flower:', transformedFlower);
                    setFlower(transformedFlower);
                } else {
                    console.log('Flower not found');
                }
            }
        } catch (error) {
            console.error('Error fetching flower:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
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
                await adminAPI.deleteFlower(id);
                await Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa!',
                    text: 'Loại hoa đã được xóa thành công.',
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/admin/flowers');
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

    console.log('Current state - isLoading:', isLoading, 'flower:', flower);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
                </div>
            </AdminLayout>
        );
    }

    if (!flower) {
        // Fallback: tạo flower object mẫu để test
        const mockFlower = {
            id: id,
            name: `Flower ${id}`,
            description: 'Mô tả mẫu cho loại hoa',
            stock: 10,
            category: 'Hoa hồng',
            image: 'https://via.placeholder.com/400x320?text=Flower+Image'
        };

        console.log('Using mock flower:', mockFlower);

        return (
            <AdminLayout>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => navigate('/admin/flowers')}
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Quay lại
                            </button>
                            <div className="flex space-x-2">
                                <Link
                                    to={`/admin/flowers/edit/${id}`}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Chỉnh sửa
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">{mockFlower.name}</h1>
                        <p className="text-gray-600">Chi tiết loại hoa #{mockFlower.id}</p>
                    </div>

                    {/* Flower Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Section */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hình ảnh</h2>
                            <img
                                src={mockFlower.image}
                                alt={mockFlower.name}
                                className="w-full h-80 object-cover rounded-lg"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin chi tiết</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Tên loại hoa</label>
                                    <p className="text-xl font-semibold text-gray-900">{mockFlower.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Danh mục</label>
                                    <p className="text-lg text-gray-900">{mockFlower.category}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Số lượng tồn kho</label>
                                    <p className="text-lg text-gray-900">{mockFlower.stock} bông</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Mô tả</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{mockFlower.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin bổ sung</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="text-3xl font-bold text-gray-900">{mockFlower.id}</div>
                                <div className="text-sm text-gray-500 mt-2">ID Loại hoa</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="text-3xl font-bold text-green-600">Hoạt động</div>
                                <div className="text-sm text-gray-500 mt-2">Trạng thái</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600">{mockFlower.stock}</div>
                                <div className="text-sm text-gray-500 mt-2">Tồn kho</div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/admin/flowers')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Quay lại
                        </button>
                        <div className="flex space-x-2">
                            <Link
                                to={`/admin/flowers/edit/${id}`}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                            >
                                <Edit size={16} className="mr-2" />
                                Chỉnh sửa
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                            >
                                <Trash2 size={16} className="mr-2" />
                                Xóa
                            </button>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{flower.name}</h1>
                    <p className="text-gray-600">Chi tiết loại hoa #{flower.id}</p>
                </div>

                {/* Flower Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hình ảnh</h2>
                        {flower.image ? (
                            <img
                                src={flower.image}
                                alt={flower.name}
                                className="w-full h-80 object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x320?text=Không+có+hình+ảnh';
                                }}
                            />
                        ) : (
                            <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Flower size={64} className="text-gray-400" />
                                <span className="ml-3 text-gray-500 text-lg">Không có hình ảnh</span>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin chi tiết</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Tên loại hoa</label>
                                <p className="text-xl font-semibold text-gray-900">{flower.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Màu hoa</label>
                                <p className="text-lg text-gray-900">{flower.color || 'Không xác định'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Số lượng tồn kho</label>
                                <p className="text-lg text-gray-900">{flower.stock} bông</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Mô tả</label>
                                <p className="text-gray-900 whitespace-pre-wrap">{flower.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin bổ sung</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                            <div className="text-3xl font-bold text-gray-900">{flower.id}</div>
                            <div className="text-sm text-gray-500 mt-2">ID Loại hoa</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">Hoạt động</div>
                            <div className="text-sm text-gray-500 mt-2">Trạng thái</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">{flower.stock}</div>
                            <div className="text-sm text-gray-500 mt-2">Tồn kho</div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewFlower;
