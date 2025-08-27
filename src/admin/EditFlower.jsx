import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { uploadImage } from '../utils/imageUpload';
import Swal from 'sweetalert2';
import CloudinaryImage from '../components/CloudinaryImage';

const EditFlower = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [flower, setFlower] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '',
        stock: 0,
        image: ''
    });

    useEffect(() => {
        fetchFlowerDetail();
    }, [id]);

    const fetchFlowerDetail = async () => {
        try {
            console.log('Fetching flower detail for editing, ID:', id);

            const response = await adminAPI.getFlowerDetail(id);
            console.log('API Response:', response);

            if (response.data) {
                const flowerData = response.data;
                const transformedFlower = {
                    id: flowerData.id || flowerData.flowerId,
                    name: flowerData.name || flowerData.type || 'Chưa có tên',
                    description: flowerData.description || 'Chưa có mô tả',
                    stock: flowerData.stock || flowerData.stockQuantity || 0,
                    color: flowerData.color || flowerData.category || '',
                    image: flowerData.image || flowerData.imageUrl || ''
                };

                setFlower(transformedFlower);
                setFormData({
                    name: transformedFlower.name,
                    description: transformedFlower.description,
                    color: transformedFlower.color,
                    stock: transformedFlower.stock,
                    image: transformedFlower.image
                });
            }
        } catch (error) {
            console.error('Error fetching flower:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Không thể tải thông tin loại hoa',
                confirmButtonText: 'Quay lại'
            }).then(() => {
                navigate('/admin/flowers');
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadImage = async () => {
        if (!selectedFile) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Vui lòng chọn một file ảnh',
            });
            return;
        }

        setUploading(true);
        try {
            const imageUrl = await uploadImage(selectedFile, 'flowers');
            setFormData(prev => ({
                ...prev,
                image: imageUrl
            }));

            // Clear file input and preview
            setSelectedFile(null);
            setPreviewUrl(null);

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Upload ảnh thành công!',
            });
        } catch (error) {
            console.error('Upload failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Upload ảnh thất bại: ' + error.message,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Validate form data
            if (!formData.name.trim()) {
                throw new Error('Tên loại hoa không được để trống');
            }

            if (!formData.description.trim()) {
                throw new Error('Mô tả không được để trống');
            }

            // Prepare data for API
            const updateData = {
                type: formData.name,
                color: formData.color,
                description: formData.description,
                imageUrl: formData.image,
                stockQuantity: parseInt(formData.stock)
            };

            console.log('Updating flower data:', updateData);

            // Call API to update flower
            await adminAPI.updateFlower(id, updateData);

            await Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Loại hoa đã được cập nhật thành công.',
                showConfirmButton: false,
                timer: 2000
            });

            navigate('/admin/flowers');
        } catch (error) {
            console.error('Error updating flower:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error.message || 'Có lỗi xảy ra khi cập nhật loại hoa',
                confirmButtonText: 'Thử lại'
            });
        } finally {
            setIsSaving(false);
        }
    };

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
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy loại hoa</h2>
                        <p className="text-gray-500 mb-4">Loại hoa bạn đang tìm kiếm không tồn tại</p>
                        <button
                            onClick={() => navigate('/admin/flowers')}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

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
                    <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa loại hoa</h1>
                    <p className="text-gray-600">Cập nhật thông tin loại hoa: {flower.name}</p>
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
                                        Màu hoa
                                    </label>
                                    <select
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">Chọn màu</option>
                                        <option value="RED">Đỏ</option>
                                        <option value="PINK">Hồng</option>
                                        <option value="YELLOW">Vàng</option>
                                        <option value="WHITE">Trắng</option>
                                        <option value="PURPLE">Tím</option>
                                        <option value="ORANGE">Cam</option>
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

                        {/* Image Upload */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ảnh loại hoa</h2>

                            <div className="space-y-4">
                                {/* Current Image */}
                                {formData.image && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ảnh hiện tại
                                        </label>
                                        <CloudinaryImage
                                            src={formData.image}
                                            alt="Current"
                                            className="w-full h-48 object-cover rounded-lg"
                                            size="medium"
                                            width={400}
                                            height={192}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thay đổi ảnh
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                {previewUrl && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Xem trước ảnh mới
                                        </label>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleUploadImage}
                                            disabled={uploading}
                                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center"
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Đang upload...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} className="mr-2" />
                                                    Upload ảnh mới
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

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
                                disabled={isSaving}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Lưu thay đổi
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

export default EditFlower;
