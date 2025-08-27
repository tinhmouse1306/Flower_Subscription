import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload.jsx';

const ImageUploadDemo = () => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    const handleImageUploaded = (imageUrl) => {
        setUploadedImageUrl(imageUrl);
        console.log('Image uploaded successfully:', imageUrl);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Demo Upload ảnh lên Firebase Storage</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Component */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Upload ảnh</h2>
                        <ImageUpload
                            onImageUploaded={handleImageUploaded}
                            folder="demo"
                        />
                    </div>

                    {/* Result Display */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Kết quả</h2>
                        <div className="bg-white p-4 rounded-lg border">
                            {uploadedImageUrl ? (
                                <div>
                                    <h3 className="font-medium mb-2">Ảnh đã upload:</h3>
                                    <img
                                        src={uploadedImageUrl}
                                        alt="Uploaded"
                                        className="w-full h-64 object-cover rounded-lg mb-4"
                                    />
                                    <div className="bg-gray-100 p-3 rounded">
                                        <p className="text-sm text-gray-600 mb-2">URL ảnh:</p>
                                        <p className="text-xs break-all">{uploadedImageUrl}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">Chưa có ảnh nào được upload</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Chọn file ảnh từ máy tính</li>
                        <li>Xem preview ảnh</li>
                        <li>Nhấn "Upload ảnh" để upload lên Firebase Storage</li>
                        <li>URL ảnh sẽ được trả về và hiển thị bên phải</li>
                        <li>Copy URL này để gửi cho BE khi tạo/cập nhật sản phẩm</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadDemo;
