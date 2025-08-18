import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download, Share2, Heart } from 'lucide-react';

const PaymentSuccessPage = () => {
    const [orderDetails, setOrderDetails] = useState({
        orderId: 'FS' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        orderDate: new Date().toLocaleDateString('vi-VN'),
        totalAmount: 400000,
        items: [
            {
                id: 1,
                name: "Gói Sinh Viên Cơ Bản",
                price: 150000,
                quantity: 1,
                duration: "3 tháng"
            },
            {
                id: 2,
                name: "Gói Premium",
                price: 250000,
                quantity: 1,
                duration: "6 tháng"
            }
        ],
        deliveryAddress: "123 Đường ABC, Quận 1, TP.HCM",
        deliverySchedule: "Thứ 7 hàng tuần",
        firstDelivery: "Thứ 7, 27/01/2024"
    });

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const downloadInvoice = () => {
        // Simulate download
        alert('Đang tải hóa đơn...');
    };

    const shareOrder = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Đơn hàng FlowerSub của tôi',
                text: `Tôi vừa đặt gói hoa tươi tại FlowerSub! Mã đơn hàng: ${orderDetails.orderId}`,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(`Đơn hàng FlowerSub - Mã: ${orderDetails.orderId}`);
            alert('Đã sao chép thông tin đơn hàng!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Thanh toán thành công!
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Cảm ơn bạn đã chọn FlowerSub
                    </p>
                    <p className="text-gray-500">
                        Mã đơn hàng: <span className="font-semibold text-primary-600">{orderDetails.orderId}</span>
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Chi tiết đơn hàng
                            </h2>
                            <div className="space-y-4">
                                {orderDetails.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Thời hạn: {item.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </p>
                                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-primary-600">
                                            {orderDetails.totalAmount.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Thông tin giao hàng
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">Địa chỉ giao hàng</h3>
                                        <p className="text-gray-600">{orderDetails.deliveryAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">Lịch trình giao hàng</h3>
                                        <p className="text-gray-600">{orderDetails.deliverySchedule}</p>
                                        <p className="text-sm text-primary-600">
                                            Lần giao đầu tiên: {orderDetails.firstDelivery}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Các bước tiếp theo
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs font-semibold text-primary-600">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Xác nhận đơn hàng</h3>
                                        <p className="text-gray-600">Chúng tôi sẽ gửi email xác nhận trong vòng 5 phút</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs font-semibold text-primary-600">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Chuẩn bị giao hàng</h3>
                                        <p className="text-gray-600">Hoa sẽ được chuẩn bị và giao vào {orderDetails.firstDelivery}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs font-semibold text-primary-600">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Nhận hoa tươi</h3>
                                        <p className="text-gray-600">Hoa sẽ được giao tận nơi với chất lượng tốt nhất</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thao tác đơn hàng
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={downloadInvoice}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Tải hóa đơn
                                </button>
                                <button
                                    onClick={shareOrder}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Chia sẻ đơn hàng
                                </button>
                                <Link
                                    to="/orders"
                                    className="w-full flex items-center justify-center px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                                >
                                    Xem đơn hàng của tôi
                                </Link>
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Cần hỗ trợ?
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">1900-1234</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">support@flowersub.com</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Hỗ trợ 24/7 cho mọi thắc mắc
                                </p>
                            </div>
                        </div>

                        {/* Auto Redirect */}
                        <div className="bg-primary-50 rounded-lg p-6">
                            <div className="text-center">
                                <p className="text-sm text-primary-700 mb-2">
                                    Tự động chuyển về trang chủ sau
                                </p>
                                <div className="text-2xl font-bold text-primary-600">
                                    {countdown}s
                                </div>
                                <Link
                                    to="/"
                                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                                >
                                    Chuyển ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-8 text-white">
                        <h2 className="text-2xl font-bold mb-4">
                            Chia sẻ trải nghiệm với bạn bè
                        </h2>
                        <p className="text-primary-100 mb-6">
                            Giới thiệu FlowerSub để nhận thêm ưu đãi đặc biệt
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors">
                                <Heart className="w-4 h-4 mr-2" />
                                Giới thiệu bạn bè
                            </button>
                            <Link
                                to="/packages"
                                className="flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                            >
                                Mua thêm gói hoa
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
