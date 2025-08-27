import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Plus, X, Upload, Check } from 'lucide-react';
import { adminAPI, subscriptionAPI } from '../utils/api';
import { uploadImage } from '../utils/imageUpload';
import Swal from 'sweetalert2';
import CloudinaryImage from '../components/CloudinaryImage';

const AddBouquet = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        flowers: []
    });
    const [flowers, setFlowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchFlowers();
    }, []);

    const fetchFlowers = async () => {
        try {
            // BE chỉ có GET public ở /api/flowers
            const response = await subscriptionAPI.getFlowers();
            setFlowers(response.data);
        } catch (error) {
            console.error('Error fetching flowers:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải danh sách hoa',
            });
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
            const imageUrl = await uploadImage(selectedFile, 'bouquets');
            setFormData(prev => ({
                ...prev,
                imageUrl: imageUrl
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

    const addFlower = () => {
        setFormData(prev => ({
            ...prev,
            flowers: [...prev.flowers, { flowerId: '', quantity: 1 }]
        }));
    };

    const removeFlower = (index) => {
        setFormData(prev => ({
            ...prev,
            flowers: prev.flowers.filter((_, i) => i !== index)
        }));
    };

    const updateFlower = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            flowers: prev.flowers.map((flower, i) =>
                i === index ? { ...flower, [field]: value } : flower
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.imageUrl) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Vui lòng upload ảnh trước khi tạo bouquet',
            });
            return;
        }

        if (formData.flowers.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Vui lòng thêm ít nhất một loại hoa',
            });
            return;
        }

        setLoading(true);
        try {
            await adminAPI.createBouquet(formData);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Tạo bouquet thành công!',
            });
            navigate('/admin/bouquets');
        } catch (error) {
            console.error('Error creating bouquet:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tạo bouquet: ' + (error.response?.data?.message || error.message),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/admin/bouquets')}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Thêm Bouquet mới</h1>
                            <p className="text-gray-600">Tạo một bó hoa mới cho hệ thống</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên Bouquet *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Nhập tên bouquet"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mô tả
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Mô tả về bouquet"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ảnh Bouquet</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn ảnh *
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
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleUploadImage}
                                                disabled={uploading}
                                                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                                            >
                                                {uploading ? 'Đang upload...' : 'Upload ảnh'}
                                            </button>
                                        </div>
                                    )}

                                    {formData.imageUrl && (
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <p className="text-green-700 text-sm">✓ Ảnh đã được upload</p>
                                            <img
                                                src={formData.imageUrl}
                                                alt="Uploaded"
                                                className="w-20 h-20 object-cover rounded mt-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Flowers Selection */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Chọn hoa</h2>
                                    <span className="text-sm text-gray-500">
                                        Đã chọn: {formData.flowers.length} loại
                                    </span>
                                </div>

                                {/* Flower Selection Grid */}
                                <div className="mb-6">
                                    <h3 className="text-md font-medium text-gray-700 mb-3">Danh sách hoa có sẵn:</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                        {flowers.map((flower) => {
                                            // Use the correct field name for flower ID
                                            const flowerId = flower.id || flower.flowerId;
                                            const isSelected = formData.flowers.some(f => f.flowerId === flowerId);
                                            const selectedFlower = formData.flowers.find(f => f.flowerId === flowerId);

                                            return (
                                                <div
                                                    key={flowerId}
                                                    className={`relative border rounded-lg p-3 cursor-pointer transition-all ${isSelected
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            // Remove flower
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                flowers: prev.flowers.filter(f => f.flowerId !== flowerId)
                                                            }));
                                                        } else {
                                                            // Add flower
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                flowers: [...prev.flowers, { flowerId: flowerId, quantity: 1 }]
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    {/* Selection indicator */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                                            <Check size={14} className="text-white" />
                                                        </div>
                                                    )}

                                                    {/* Flower image */}
                                                    <div className="w-full h-24 mb-3">
                                                        <CloudinaryImage
                                                            src={flower.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NzM4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                                                            alt={flower.type}
                                                            className="w-full h-full object-cover rounded-lg"
                                                            size="small"
                                                            width={200}
                                                            height={96}
                                                        />
                                                    </div>

                                                    {/* Flower info */}
                                                    <div className="text-center">
                                                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                                                            {flower.type}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            {flower.color} • Còn: {flower.stockQuantity}
                                                        </p>

                                                        {/* Quantity input (only show if selected) */}
                                                        {isSelected && (
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <label className="text-xs text-gray-600">SL:</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max={flower.stockQuantity}
                                                                    value={selectedFlower?.quantity || 1}
                                                                    onChange={(e) => {
                                                                        const quantity = parseInt(e.target.value) || 1;
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            flowers: prev.flowers.map(f =>
                                                                                f.flowerId === flowerId
                                                                                    ? { ...f, quantity }
                                                                                    : f
                                                                            )
                                                                        }));
                                                                    }}
                                                                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Selected Flowers Summary */}
                                {formData.flowers.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-md font-medium text-gray-700 mb-3">Hoa đã chọn:</h3>
                                        <div className="space-y-2">
                                            {formData.flowers.map((selectedFlower, index) => {
                                                const flower = flowers.find(f => f.id === selectedFlower.flowerId);
                                                if (!flower) return null;

                                                return (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <CloudinaryImage
                                                                src={flower.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlZ2h0PSI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjNjY3Mzg3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}
                                                                alt={flower.type}
                                                                className="w-10 h-10 object-cover rounded"
                                                                size="thumbnail"
                                                                width={40}
                                                                height={40}
                                                            />
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900">
                                                                    {flower.type} - {flower.color}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Số lượng: {selectedFlower.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    flowers: prev.flowers.filter((_, i) => i !== index)
                                                                }));
                                                            }}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/bouquets')}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.imageUrl}
                            className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo Bouquet'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddBouquet;
