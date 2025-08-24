import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI, subscriptionAPI } from '../utils/api';
import { ArrowLeft, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';

const EditPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        durationMonths: '',
        deliveriesPerMonth: ''
    });

    useEffect(() => {
        fetchPackageDetail();
    }, [id]);

    const fetchPackageDetail = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching package detail for editing, ID:', id);
            const response = await subscriptionAPI.getPackageDetail(id);
            console.log('Package detail for edit response:', response);

            if (response.data) {
                const packageData = response.data;
                console.log('Package data received:', packageData);
                setFormData({
                    name: packageData.name || '',
                    description: packageData.description || '',
                    price: packageData.price || '',
                    durationMonths: packageData.durationMonths || '',
                    deliveriesPerMonth: packageData.deliveriesPerMonth || ''
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không tìm thấy thông tin gói dịch vụ',
                    confirmButtonText: 'Quay lại'
                }).then(() => {
                    navigate('/admin/packages');
                });
            }
        } catch (error) {
            console.error('Error fetching package detail:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Không thể tải thông tin gói dịch vụ',
                confirmButtonText: 'Quay lại'
            }).then(() => {
                navigate('/admin/packages');
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validation cho số
        if (name === 'durationMonths') {
            const numValue = parseInt(value);
            if (numValue < 1 || numValue > 12) {
                return; // Không cho phép nhập ngoài khoảng 1-12
            }
        }

        if (name === 'deliveriesPerMonth') {
            const numValue = parseInt(value);
            if (numValue < 1 || numValue > 31) {
                return; // Không cho phép nhập ngoài khoảng 1-31
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            console.log('Updating package with data:', formData);

            const packageData = {
                name: formData.name,
                description: formData.description,
                price: parseInt(formData.price),
                durationMonths: parseInt(formData.durationMonths),
                deliveriesPerMonth: parseInt(formData.deliveriesPerMonth)
            };

            const response = await adminAPI.updatePackage(id, packageData);
            console.log('Update package response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            // Kiểm tra nhiều trường hợp thành công
            if (response.status === 200 || response.status === 201 ||
                (response.data && (response.data.code === 1010 || response.data.code === 200)) ||
                (response.data && response.data.id) || // Nếu có ID trả về = thành công
                (response.data && response.data.name)) { // Nếu có name trả về = thành công
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Gói dịch vụ đã được cập nhật thành công',
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/admin/packages');
            } else {
                throw new Error(response.data?.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error updating package:', error);

            let errorMessage = 'Có lỗi xảy ra khi cập nhật gói dịch vụ';
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
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa gói dịch vụ</h1>
                    <p className="text-gray-600">Cập nhật thông tin gói dịch vụ #{id}</p>
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
                                    placeholder="150000"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700 mb-2">
                                    Thời hạn (tháng) *
                                </label>
                                <input
                                    type="number"
                                    id="durationMonths"
                                    name="durationMonths"
                                    required
                                    min="1"
                                    max="12"
                                    value={formData.durationMonths}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="1"
                                />
                            </div>

                            {/* Deliveries per month */}
                            <div>
                                <label htmlFor="deliveriesPerMonth" className="block text-sm font-medium text-gray-700 mb-2">
                                    Số lần giao hàng/tháng *
                                </label>
                                <input
                                    type="number"
                                    id="deliveriesPerMonth"
                                    name="deliveriesPerMonth"
                                    required
                                    min="1"
                                    max="30"
                                    value={formData.deliveriesPerMonth}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="4"
                                />
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
                                disabled={isSaving}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang cập nhật...
                                    </div>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2 inline" />
                                        Cập nhật gói dịch vụ
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

export default EditPackage;
