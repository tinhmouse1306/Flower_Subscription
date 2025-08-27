import React, { useState } from 'react';
import { uploadImage } from '../utils/imageUpload.js';

const FlowerFormWithImage = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        type: '',
        color: '',
        description: '',
        stockQuantity: 0,
        imageUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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
            alert('Vui lòng chọn một file ảnh');
            return;
        }

        setUploading(true);
        try {
            const imageUrl = await uploadImage(selectedFile, 'flowers');
            setFormData(prev => ({
                ...prev,
                imageUrl: imageUrl
            }));

            // Clear file input and preview
            setSelectedFile(null);
            setPreviewUrl(null);

            alert('Upload ảnh thành công!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload ảnh thất bại: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.imageUrl) {
            alert('Vui lòng upload ảnh trước khi tạo flower');
            return;
        }

        setSubmitting(true);
        try {
            if (onSubmit) {
                await onSubmit(formData);
            }

            // Reset form
            setFormData({
                type: '',
                color: '',
                description: '',
                stockQuantity: 0,
                imageUrl: ''
            });
            setSelectedFile(null);
            setPreviewUrl(null);

            alert('Tạo flower thành công!');
        } catch (error) {
            console.error('Submit failed:', error);
            alert('Tạo flower thất bại: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Tạo Flower mới</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh flower *
                    </label>

                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />

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

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại hoa *
                        </label>
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Màu sắc
                        </label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng tồn kho *
                    </label>
                    <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || !formData.imageUrl}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Đang tạo...' : 'Tạo Flower'}
                </button>
            </form>
        </div>
    );
};

export default FlowerFormWithImage;
