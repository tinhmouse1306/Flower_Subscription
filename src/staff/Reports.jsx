import { useState, useEffect } from 'react';
import StaffLayout from './StaffLayout';
import {
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Truck,
    Users,
    Package,
    Calendar,
    Download,
    BarChart3,
    PieChart,
    Activity,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const StaffReports = () => {
    const [reports, setReports] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    useEffect(() => {
        // Mock data
        setReports({
            deliveries: {
                total: 45,
                pending: 12,
                inProgress: 8,
                completed: 20,
                cancelled: 5,
                change: 15.2,
                trend: 'up'
            },
            orders: {
                total: 67,
                processed: 45,
                pending: 22,
                change: 8.5,
                trend: 'up'
            },
            customers: {
                active: 89,
                new: 12,
                total: 156,
                change: 12.3,
                trend: 'up'
            },
            performance: {
                avgDeliveryTime: '2.5 giờ',
                satisfactionRate: '4.8/5',
                onTimeDelivery: '95%',
                change: 2.1,
                trend: 'up'
            },
            dailyDeliveries: [
                { day: 'T2', deliveries: 8, completed: 7 },
                { day: 'T3', deliveries: 12, completed: 11 },
                { day: 'T4', deliveries: 10, completed: 9 },
                { day: 'T5', deliveries: 15, completed: 14 },
                { day: 'T6', deliveries: 9, completed: 8 },
                { day: 'T7', deliveries: 11, completed: 10 },
                { day: 'CN', deliveries: 6, completed: 5 }
            ],
            deliveryStatus: [
                { status: 'Đã giao', count: 20, percentage: 44 },
                { status: 'Đang giao', count: 8, percentage: 18 },
                { status: 'Chờ giao', count: 12, percentage: 27 },
                { status: 'Đã hủy', count: 5, percentage: 11 }
            ],
            topDrivers: [
                { name: 'Trần Văn X', deliveries: 15, rating: 4.9, onTime: '98%' },
                { name: 'Lê Văn Y', deliveries: 12, rating: 4.8, onTime: '95%' },
                { name: 'Phạm Văn Z', deliveries: 10, rating: 4.7, onTime: '92%' },
                { name: 'Hoàng Văn W', deliveries: 8, rating: 4.6, onTime: '90%' }
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
        <StaffLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Báo cáo hoạt động</h1>
                            <p className="text-gray-600">Tổng quan về hiệu suất giao hàng và dịch vụ</p>
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
                                <p className="text-sm font-medium text-gray-600">Tổng giao hàng</p>
                                <p className="text-2xl font-bold text-gray-900">{reports.deliveries?.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Truck className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {getTrendIcon(reports.deliveries?.trend)}
                            <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.deliveries?.trend)}`}>
                                {reports.deliveries?.change}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">so với tuần trước</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đơn hàng đã xử lý</p>
                                <p className="text-2xl font-bold text-gray-900">{reports.orders?.processed}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <ShoppingCart className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {getTrendIcon(reports.orders?.trend)}
                            <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.orders?.trend)}`}>
                                {reports.orders?.change}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">so với tuần trước</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Khách hàng hoạt động</p>
                                <p className="text-2xl font-bold text-gray-900">{reports.customers?.active}</p>
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
                            <span className="ml-2 text-sm text-gray-500">so với tuần trước</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tỷ lệ giao đúng giờ</p>
                                <p className="text-2xl font-bold text-gray-900">{reports.performance?.onTimeDelivery}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {getTrendIcon(reports.performance?.trend)}
                            <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.performance?.trend)}`}>
                                {reports.performance?.change}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">so với tuần trước</span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Daily Deliveries Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Giao hàng theo ngày</h3>
                            <BarChart3 className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            {reports.dailyDeliveries?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{item.day}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item.completed / 15) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.completed}/{item.deliveries}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Status Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Trạng thái giao hàng</h3>
                            <PieChart className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            {reports.deliveryStatus?.map((item, index) => (
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

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Thời gian giao trung bình</h3>
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{reports.performance?.avgDeliveryTime}</div>
                        <p className="text-sm text-gray-500 mt-2">Thời gian từ khi nhận đơn đến khi giao xong</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Đánh giá khách hàng</h3>
                            <CheckCircle className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="text-3xl font-bold text-green-600">{reports.performance?.satisfactionRate}</div>
                        <p className="text-sm text-gray-500 mt-2">Điểm đánh giá trung bình từ khách hàng</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Khách hàng mới</h3>
                            <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="text-3xl font-bold text-purple-600">{reports.customers?.new}</div>
                        <p className="text-sm text-gray-500 mt-2">Số khách hàng mới trong tuần</p>
                    </div>
                </div>

                {/* Top Drivers */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Tài xế xuất sắc nhất</h3>
                        <Truck className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tài xế
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số đơn giao
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đánh giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giao đúng giờ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.topDrivers?.map((driver, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{driver.deliveries}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                                                <span className="text-yellow-400 ml-1">★</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-green-600">{driver.onTime}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default StaffReports;
