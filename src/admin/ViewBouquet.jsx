import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ArrowLeft, Edit, Trash2, Flower } from 'lucide-react';
import { adminAPI } from '../utils/api';
import Swal from 'sweetalert2';

const ViewBouquet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bouquet, setBouquet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBouquet();
    }, [id]);

    const fetchBouquet = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getBouquetDetail(id);
            setBouquet(response.data);
        } catch (error) {
            console.error('Error fetching bouquet:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải thông tin bouquet',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa bouquet "${bouquet.name}"?`,
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#dc2626',
        });

        if (result.isConfirmed) {
            try {
                await adminAPI.deleteBouquet(id);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã xóa bouquet thành công',
                });
                navigate('/admin/bouquets');
            } catch (error) {
                console.error('Error deleting bouquet:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể xóa bouquet',
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!bouquet) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy bouquet</h2>
                    <p className="text-gray-600 mt-2">Bouquet này có thể đã bị xóa hoặc không tồn tại.</p>
                    <button
                        onClick={() => navigate('/admin/bouquets')}
                        className="mt-4 btn-primary"
                    >
                        Quay lại danh sách
                    </button>
                </div>
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
                            onClick={() => navigate('/admin/bouquets')}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{bouquet.name}</h1>
                            <p className="text-gray-600">Chi tiết bouquet</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigate(`/admin/bouquets/${id}/edit`)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Edit size={16} />
                            <span>Sửa</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn-danger flex items-center space-x-2"
                        >
                            <Trash2 size={16} />
                            <span>Xóa</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image and Basic Info */}
                    <div className="space-y-6">
                        {/* Image */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ảnh Bouquet</h2>
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={bouquet.imageUrl || '/placeholder-image.jpg'}
                                    alt={bouquet.name}
                                    className="w-full h-64 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Tên Bouquet</label>
                                    <p className="text-lg font-semibold text-gray-900">{bouquet.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Mô tả</label>
                                    <p className="text-gray-900">
                                        {bouquet.description || 'Không có mô tả'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">ID</label>
                                    <p className="text-gray-900">#{bouquet.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Flowers List */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Danh sách hoa</h2>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Flower size={16} />
                                    <span>{bouquet.bouquetFlowers?.length || 0} loại hoa</span>
                                </div>
                            </div>

                            {!bouquet.bouquetFlowers || bouquet.bouquetFlowers.length === 0 ? (
                                <div className="text-center py-8">
                                    <Flower size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">Chưa có hoa nào trong bouquet này</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bouquet.bouquetFlowers.map((bouquetFlower, index) => (
                                        <div key={bouquetFlower.id || index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <img
                                                    src={bouquetFlower.flower?.imageUrl || '/placeholder-image.jpg'}
                                                    alt={bouquetFlower.flower?.type}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">
                                                    {bouquetFlower.flower?.type}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Màu: {bouquetFlower.flower?.color || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {bouquetFlower.quantity}
                                                </div>
                                                <div className="text-sm text-gray-500">bông</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Statistics */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {bouquet.bouquetFlowers?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-500">Loại hoa</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {bouquet.bouquetFlowers?.reduce((total, bf) => total + bf.quantity, 0) || 0}
                                    </div>
                                    <div className="text-sm text-gray-500">Tổng số bông</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewBouquet;
