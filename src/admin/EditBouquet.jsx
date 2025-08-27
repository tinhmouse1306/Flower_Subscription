import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { adminAPI, subscriptionAPI } from '../utils/api';
import { uploadImage } from '../utils/imageUpload';
import Swal from 'sweetalert2';

const EditBouquet = () => {
    const { id } = useParams();
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
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchBouquet();
        fetchFlowers();
    }, [id]);

    const fetchBouquet = async () => {
        try {
            setInitialLoading(true);
            const response = await adminAPI.getBouquetDetail(id);
            const bouquet = response.data;

            setFormData({
                name: bouquet.name || '',
                description: bouquet.description || '',
                imageUrl: bouquet.imageUrl || '',
                flowers: bouquet.bouquetFlowers?.map(bf => ({
                    flowerId: bf.flower?.id,
                    quantity: bf.quantity
                })) || []
            });
        } catch (error) {
            console.error('Error fetching bouquet:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải thông tin bouquet',
            });
        } finally {
            setInitialLoading(false);
        }
    };

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
            await adminAPI.updateBouquet(id, formData);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật bouquet thành công!',
            });
            navigate(`/admin/bouquets/${id}`);
        } catch (error) {
            console.error('Error updating bouquet:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể cập nhật bouquet: ' + (error.response?.data?.message || error.message),
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(`/admin/bouquets/${id}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Bouquet</h1>
                            <p className="text-gray-600">Cập nhật thông tin bouquet</p>
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
                                    {/* Current Image */}
                                    {formData.imageUrl && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ảnh hiện tại
                                            </label>
                                            <img
                                                src={formData.imageUrl}
                                                alt="Current"
                                                className="w-full h-48 object-cover rounded-lg"
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
                                                {uploading ? 'Đang upload...' : 'Upload ảnh mới'}
                                            </button>
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
                                    <button
                                        type="button"
                                        onClick={addFlower}
                                        className="btn-primary flex items-center space-x-2"
                                    >
                                        <Plus size={16} />
                                        <span>Thêm hoa</span>
                                    </button>
                                </div>

                                {formData.flowers.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        Chưa có hoa nào được chọn
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {formData.flowers.map((flower, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <select
                                                        value={flower.flowerId}
                                                        onChange={(e) => updateFlower(index, 'flowerId', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                    >
                                                        <option value="">Chọn loại hoa</option>
                                                        {flowers.map(f => (
                                                            <option key={f.id} value={f.id}>
                                                                {f.type} - {f.color} (Còn: {f.stockQuantity})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-24">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={flower.quantity}
                                                        onChange={(e) => updateFlower(index, 'quantity', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                        placeholder="SL"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFlower(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/bouquets/${id}`)}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật Bouquet'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditBouquet;
