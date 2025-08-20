import { useState, useEffect } from 'react';
import StaffLayout from './StaffLayout';
import {
    Search,
    Filter,
    Eye,
    MapPin,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    Phone
} from 'lucide-react';

const StaffDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        // Mock data
        setDeliveries([
            {
                id: 1,
                orderId: 'ORD-001',
                customerName: 'Nguyễn Văn A',
                customerPhone: '0123456789',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                package: 'Gói Premium',
                scheduledDate: '2024-01-25',
                scheduledTime: '09:00 - 11:00',
                status: 'pending',
                driver: 'Trần Văn X',
                driverPhone: '0987654321',
                notes: 'Giao vào buổi sáng, khách hàng yêu cầu gọi trước'
            },
            {
                id: 2,
                orderId: 'ORD-002',
                customerName: 'Trần Thị B',
                customerPhone: '0987654321',
                address: '456 Đường DEF, Quận 3, TP.HCM',
                package: 'Gói Cơ Bản',
                scheduledDate: '2024-01-25',
                scheduledTime: '14:00 - 16:00',
                status: 'in_progress',
                driver: 'Lê Văn Y',
                driverPhone: '0555666777',
                notes: 'Khách hàng ở chung cư, cần gọi cửa'
            },
            {
                id: 3,
                orderId: 'ORD-003',
                customerName: 'Lê Văn C',
                customerPhone: '0555666777',
                address: '789 Đường GHI, Quận 5, TP.HCM',
                package: 'Gói VIP',
                scheduledDate: '2024-01-25',
                scheduledTime: '16:00 - 18:00',
                status: 'completed',
                driver: 'Phạm Văn Z',
                driverPhone: '0333444555',
                notes: 'Đã giao thành công, khách hàng hài lòng'
            },
            {
                id: 4,
                orderId: 'ORD-004',
                customerName: 'Phạm Thị D',
                customerPhone: '0333444555',
                address: '321 Đường JKL, Quận 7, TP.HCM',
                package: 'Gói Siêu VIP',
                scheduledDate: '2024-01-26',
                scheduledTime: '10:00 - 12:00',
                status: 'cancelled',
                driver: 'Hoàng Văn W',
                driverPhone: '0222333444',
                notes: 'Khách hàng hủy đơn hàng'
            },
            {
                id: 5,
                orderId: 'ORD-005',
                customerName: 'Hoàng Văn E',
                customerPhone: '0222333444',
                address: '654 Đường MNO, Quận 10, TP.HCM',
                package: 'Gói Premium',
                scheduledDate: '2024-01-26',
                scheduledTime: '15:00 - 17:00',
                status: 'pending',
                driver: 'Trần Văn X',
                driverPhone: '0987654321',
                notes: 'Khách hàng yêu cầu giao vào buổi chiều'
            }
        ]);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ giao';
            case 'in_progress':
                return 'Đang giao';
            case 'completed':
                return 'Đã giao';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'in_progress':
                return <Truck className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'cancelled':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setDeliveries(prev => prev.map(delivery =>
            delivery.id === id ? { ...delivery, status: newStatus } : delivery
        ));
        console.log(`Delivery ${id} status changed to: ${newStatus}`);
    };

    return (
        <StaffLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý giao hàng</h1>
                    <p className="text-gray-600">Theo dõi và quản lý các đơn hàng đang giao</p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm đơn hàng..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                                />
                            </div>
                            <button className="btn-secondary">
                                <Filter size={16} className="mr-2" />
                                Lọc
                            </button>
                        </div>
                    </div>
                </div>

                {/* Deliveries List */}
                <div className="space-y-4">
                    {deliveries.map((delivery) => (
                        <div key={delivery.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {delivery.orderId}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                                                {getStatusIcon(delivery.status)}
                                                <span className="ml-1">{getStatusText(delivery.status)}</span>
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                                            <p className="text-sm text-gray-900">{delivery.customerName}</p>
                                            <div className="flex items-center mt-1">
                                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                                <span className="text-xs text-gray-500">{delivery.customerPhone}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</p>
                                            <div className="flex items-start mt-1">
                                                <MapPin className="h-3 w-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs text-gray-500">{delivery.address}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Gói dịch vụ</p>
                                            <p className="text-sm text-gray-900">{delivery.package}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Ngày giao hàng</p>
                                            <div className="flex items-center mt-1">
                                                <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                                <span className="text-xs text-gray-500">{delivery.scheduledDate}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{delivery.scheduledTime}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Tài xế</p>
                                            <p className="text-sm text-gray-900">{delivery.driver}</p>
                                            <div className="flex items-center mt-1">
                                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                                <span className="text-xs text-gray-500">{delivery.driverPhone}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                                            <p className="text-xs text-gray-500 mt-1">{delivery.notes}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:flex-shrink-0">
                                    <select
                                        value={delivery.status}
                                        onChange={(e) => handleStatusChange(delivery.id, e.target.value)}
                                        className="text-sm border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="pending">Chờ giao</option>
                                        <option value="in_progress">Đang giao</option>
                                        <option value="completed">Đã giao</option>
                                        <option value="cancelled">Đã hủy</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng đơn hàng</div>
                        <div className="text-2xl font-bold text-gray-900">{deliveries.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Chờ giao</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {deliveries.filter(d => d.status === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Đang giao</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {deliveries.filter(d => d.status === 'in_progress').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Đã giao</div>
                        <div className="text-2xl font-bold text-green-600">
                            {deliveries.filter(d => d.status === 'completed').length}
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default StaffDeliveries;
