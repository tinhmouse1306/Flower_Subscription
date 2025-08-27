import React, { useState } from 'react';
import { uploadImage } from '../utils/imageUpload.js';

const ImageUpload = ({ onImageUploaded, folder = 'images' }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

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

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Vui lòng chọn một file ảnh');
            return;
        }

        setUploading(true);
        try {
            const imageUrl = await uploadImage(selectedFile, folder);
            console.log('Uploaded image URL:', imageUrl);

            // Call callback function with the uploaded image URL
            if (onImageUploaded) {
                onImageUploaded(imageUrl);
            }

            // Reset form
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

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Upload ảnh</h3>

            <div className="mb-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {previewUrl && (
                <div className="mb-4">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {uploading ? 'Đang upload...' : 'Upload ảnh'}
            </button>
        </div>
    );
};

export default ImageUpload;
