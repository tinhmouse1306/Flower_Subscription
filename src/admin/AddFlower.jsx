import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { adminAPI } from '../utils/api';
import Swal from 'sweetalert2';

const AddFlower = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        stock: 0,
        image: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate form data
            if (!formData.name.trim()) {
                throw new Error('Tên loại hoa không được để trống');
            }

            if (!formData.description.trim()) {
                throw new Error('Mô tả không được để trống');
            }

            // Prepare data for API
            const flowerData = {
                type: formData.name,
                color: formData.category,
                description: formData.description,
                imageUrl: formData.image,
                stockQuantity: parseInt(formData.stock)
            };

            console.log('Submitting flower data:', flowerData);

            // Call API to create flower
            await adminAPI.createFlower(flowerData);

            await Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Loại hoa đã được thêm thành công.',
                showConfirmButton: false,
                timer: 2000
            });

            navigate('/admin/flowers');
        } catch (error) {
            console.error('Error adding flower:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error.message || 'Có lỗi xảy ra khi thêm loại hoa',
                confirmButtonText: 'Thử lại'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
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
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Thêm loại hoa mới</h1>
                    <p className="text-gray-600">Nhập thông tin loại hoa mới vào hệ thống</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên loại hoa *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Nhập tên loại hoa"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Danh mục
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        <option value="Hoa hồng">Hoa hồng</option>
                                        <option value="Hoa cúc">Hoa cúc</option>
                                        <option value="Hoa lan">Hoa lan</option>
                                        <option value="Hoa tulip">Hoa tulip</option>
                                        <option value="Hoa hướng dương">Hoa hướng dương</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Nhập mô tả chi tiết về loại hoa"
                                required
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số lượng tồn kho
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="0"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL hình ảnh
                            </label>
                            <div className="flex">
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                                >
                                    <Upload size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        {formData.image && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xem trước hình ảnh
                                </label>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-48 h-32 object-cover rounded-lg border"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/192x128?text=Không+có+hình+ảnh';
                                    }}
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/flowers')}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Lưu
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddFlower;
