import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    Calendar,
    Download,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';

const AdminReports = () => {
    const [reports, setReports] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    useEffect(() => {
        // Mock data
        setReports({
            revenue: {
                current: 15250000,
                previous: 12800000,
                change: 19.1,
                trend: 'up'
            },
            orders: {
                current: 156,
                previous: 142,
                change: 9.9,
                trend: 'up'
            },
            customers: {
                current: 89,
                previous: 76,
                change: 17.1,
                trend: 'up'
            },
            packages: {
                current: 8,
                previous: 8,
                change: 0,
                trend: 'stable'
            },
            topPackages: [
                { name: 'Gói Premium', sales: 45, revenue: 26955000 },
                { name: 'Gói Cơ Bản', sales: 38, revenue: 11362000 },
                { name: 'Gói VIP', sales: 23, revenue: 22977000 },
                { name: 'Gói Siêu VIP', sales: 12, revenue: 17988000 }
            ],
            monthlyRevenue: [
                { month: 'T1', revenue: 12000000 },
                { month: 'T2', revenue: 13500000 },
                { month: 'T3', revenue: 14200000 },
                { month: 'T4', revenue: 12800000 },
                { month: 'T5', revenue: 15250000 },
                { month: 'T6', revenue: 0 }
            ],
            orderStatus: [
                { status: 'Đã giao', count: 89, percentage: 57 },
                { status: 'Đang giao', count: 23, percentage: 15 },
                { status: 'Đang xử lý', count: 18, percentage: 12 },
                { status: 'Chờ xác nhận', count: 26, percentage: 16 }
            ]
        });
    }, []);

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-green-500" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-red-500" />;
            default:
                return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
                            <p className="text-gray-600">Tổng quan về hiệu suất kinh doanh</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                                <option value="quarter">Quý này</option>
                                <option value="year">Năm nay</option>
                            </select>
                            <button className="btn-secondary">
                                <Download size={16} className="mr-2" />
                                Xuất báo cáo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {reports.revenue?.current?.toLocaleString()}đ
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {getTrendIcon(reports.revenue?.trend)}
                            <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.revenue?.trend)}`}>
                                {reports.revenue?.change}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">so với tháng trước</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                                <p className="text-2xl font-bold text-gray-900">{reports.orders?.current}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <ShoppingCart className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {getTrendIcon(reports.orders?.trend)}
                            <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.orders?.trend)}`}>
                                {reports.orders?.change}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">so với tháng trước</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Khách hàng mới</p>
                                <p className="text-2xl font-bold text-gray-900">{reports.customers?.current}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {getTrendIcon(reports.customers?.trend)}
                            <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.customers?.trend)}`}>
                                {reports.customers?.change}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">so với tháng trước</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Gói đang hoạt động</p>
                                <p className="text-2xl font-bold text-gray-900">{reports.packages?.current}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Package className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {getTrendIcon(reports.packages?.trend)}
                            <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.packages?.trend)}`}>
                                {reports.packages?.change}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">so với tháng trước</span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
                            <BarChart3 className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            {reports.monthlyRevenue?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{item.month}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item.revenue / 16000000) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.revenue.toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Status Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
                            <PieChart className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            {reports.orderStatus?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' :
                                            index === 1 ? 'bg-blue-500' :
                                                index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}></div>
                                        <span className="text-sm text-gray-600">{item.status}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                        <span className="text-sm text-gray-500">({item.percentage}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Packages */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Gói dịch vụ bán chạy nhất</h3>
                        <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gói dịch vụ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng bán
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doanh thu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tỷ lệ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.topPackages?.map((pkg, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{pkg.sales}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {pkg.revenue.toLocaleString()}đ
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${(pkg.sales / 118) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {((pkg.sales / 118) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
