import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { subscriptionAPI } from '../utils/api';
import { ArrowLeft, Edit, Package, Calendar, DollarSign, Truck } from 'lucide-react';

const ViewDetailPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPackageDetail();
    }, [id]);

    const fetchPackageDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Fetching package detail for ID:', id);
            const response = await subscriptionAPI.getPackageDetail(id);
            console.log('Package detail response:', response);

            if (response.data) {
                setPackageData(response.data);
            } else {
                setError('Không tìm thấy thông tin gói dịch vụ');
            }
        } catch (error) {
            console.error('Error fetching package detail:', error);
            setError('Không thể tải thông tin chi tiết gói dịch vụ');
        } finally {
            setIsLoading(false);
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

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/admin/packages')}
                            className="btn-primary"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!packageData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-gray-500 text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy</h2>
                        <p className="text-gray-600 mb-4">Gói dịch vụ không tồn tại</p>
                        <button
                            onClick={() => navigate('/admin/packages')}
                            className="btn-primary"
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
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/admin/packages')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate(`/admin/packages/edit/${id}`)}
                            className="btn-primary"
                        >
                            <Edit size={16} className="mr-2" />
                            Chỉnh sửa
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết gói dịch vụ</h1>
                    <p className="text-gray-600">Thông tin chi tiết về gói dịch vụ</p>
                </div>

                {/* Package Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Package size={20} className="mr-2 text-red-600" />
                                Thông tin cơ bản
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Tên gói dịch vụ</label>
                                    <p className="text-lg font-semibold text-gray-900">{packageData.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Mô tả</label>
                                    <p className="text-gray-900">{packageData.description}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">ID gói</label>
                                    <p className="text-gray-900">#{packageData.packageId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Duration */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <DollarSign size={20} className="mr-2 text-green-600" />
                                Thông tin giá và thời hạn
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Giá</label>
                                    <p className="text-2xl font-bold text-green-600">
                                        {packageData.price?.toLocaleString()}đ
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Thời hạn</label>
                                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Calendar size={16} className="mr-2" />
                                        {packageData.durationMonths} tháng
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Số lần giao hàng/tháng</label>
                                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Truck size={16} className="mr-2" />
                                        {packageData.deliveriesPerMonth} lần
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-gray-500">Tổng số lần giao</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {packageData.durationMonths * packageData.deliveriesPerMonth}
                                </div>
                                <div className="text-xs text-gray-500">trong {packageData.durationMonths} tháng</div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-gray-500">Giá mỗi lần giao</div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {Math.round(packageData.price / (packageData.durationMonths * packageData.deliveriesPerMonth)).toLocaleString()}đ
                                </div>
                                <div className="text-xs text-gray-500">trung bình</div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-gray-500">Tần suất giao</div>
                                <div className="text-2xl font-bold text-orange-600">
                                    {Math.round(30 / packageData.deliveriesPerMonth)} ngày
                                </div>
                                <div className="text-xs text-gray-500">mỗi lần giao</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewDetailPackage;
