import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import { ArrowLeft, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';

const AddPackage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        flowersPerWeek: '',
        status: 'active'
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
            console.log('Creating new package with data:', formData);

            const packageData = {
                name: formData.name,
                description: formData.description,
                price: parseInt(formData.price),
                duration: parseInt(formData.duration),
                flowersPerWeek: parseInt(formData.flowersPerWeek),
                status: formData.status
            };

            const response = await adminAPI.createPackage(packageData);
            console.log('Create package response:', response);

            if (response.data && response.data.code === 1010) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Gói dịch vụ đã được tạo thành công',
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/admin/packages');
            } else {
                throw new Error(response.data?.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error creating package:', error);

            let errorMessage = 'Có lỗi xảy ra khi tạo gói dịch vụ';
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate('/admin/packages')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Quay lại
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm gói dịch vụ mới</h1>
                    <p className="text-gray-600">Tạo gói dịch vụ mới cho hệ thống FlowerSub</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Package Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên gói dịch vụ *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Ví dụ: Gói Cơ Bản"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá (VNĐ) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="299000"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                    Thời hạn (tháng) *
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    required
                                    min="1"
                                    max="12"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="1"
                                />
                            </div>

                            {/* Flowers per week */}
                            <div>
                                <label htmlFor="flowersPerWeek" className="block text-sm font-medium text-gray-700 mb-2">
                                    Số bó hoa/tuần *
                                </label>
                                <input
                                    type="number"
                                    id="flowersPerWeek"
                                    name="flowersPerWeek"
                                    required
                                    min="1"
                                    max="7"
                                    value={formData.flowersPerWeek}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="1"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Tạm dừng</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả chi tiết
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="Mô tả chi tiết về gói dịch vụ..."
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/packages')}
                                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                <X size={16} className="mr-2 inline" />
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang tạo...
                                    </div>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2 inline" />
                                        Tạo gói dịch vụ
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

export default AddPackage;
