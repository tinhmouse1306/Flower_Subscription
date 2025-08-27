import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Plus, Edit, Trash2, Eye, Search, Filter, RefreshCw } from 'lucide-react';
import { adminAPI } from '../utils/api';
import Swal from 'sweetalert2';
import CloudinaryImage from '../components/CloudinaryImage';

const Bouquets = () => {
    const [bouquets, setBouquets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchBouquets();
    }, []);

    const fetchBouquets = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getBouquets();
            setBouquets(response.data);
        } catch (error) {
            console.error('Error fetching bouquets:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải danh sách bouquet',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa bouquet "${name}"?`,
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
                fetchBouquets();
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

    const filteredBouquets = bouquets.filter(bouquet => {
        const matchesSearch = bouquet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bouquet.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách bouquet...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Bouquet</h1>
                        <p className="text-gray-600">Quản lý các bó hoa trong hệ thống</p>
                    </div>
                    <Link
                        to="/admin/bouquets/add"
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Thêm Bouquet</span>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bouquet..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchBouquets}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                            >
                                <RefreshCw size={16} />
                                <span>Làm mới</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bouquets List */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ảnh
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên Bouquet
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số loại hoa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBouquets.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm ? 'Không tìm thấy bouquet nào' : 'Chưa có bouquet nào'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBouquets.map((bouquet) => (
                                        <tr key={bouquet.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    <CloudinaryImage
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                        src={bouquet.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlZ2h0PSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzY2NzM4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                                                        alt={bouquet.name}
                                                        size="thumbnail"
                                                        width={64}
                                                        height={64}
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlZ2h0PSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzY2NzM4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {bouquet.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {bouquet.description || 'Không có mô tả'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {bouquet.bouquetFlowers?.length || 0} loại
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/admin/bouquets/${bouquet.id}`}
                                                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                                                    >
                                                        <Eye size={16} />
                                                        <span>Xem</span>
                                                    </Link>
                                                    <Link
                                                        to={`/admin/bouquets/${bouquet.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                                    >
                                                        <Edit size={16} />
                                                        <span>Sửa</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(bouquet.id, bouquet.name)}
                                                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span>Xóa</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <span className="text-primary-600 font-bold">🌸</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Tổng số Bouquet</p>
                                <p className="text-2xl font-semibold text-gray-900">{bouquets.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Bouquets;
