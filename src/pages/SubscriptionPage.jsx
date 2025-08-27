import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, Gift, Users, Clock, MapPin } from 'lucide-react';
import { subscriptionAPI, paymentAPI, adminAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import Swal from 'sweetalert2';

const SubscriptionPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedBouquet, setSelectedBouquet] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('09:00');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [isStudent, setIsStudent] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [bouquets, setBouquets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Dữ liệu payment methods theo API BE
    const paymentMethods = [
        { id: 1, name: 'VNPAY', code: 'CREDIT_CARD', description: 'Thanh toán qua VNPAY', icon: '💳' },
        { id: 2, name: 'MOMO', code: 'MOMO', description: 'Thanh toán qua MOMO', icon: '📱' },
        { id: 3, name: 'Tiền mặt', code: 'COD', description: 'Thanh toán khi nhận hàng', icon: '💰' }
    ];

    // Dữ liệu student discounts
    const studentDiscounts = [
        { id: 1, name: 'Sinh viên', discount: 10, description: 'Giảm 10% cho sinh viên' },
        { id: 2, name: 'Học sinh', discount: 5, description: 'Giảm 5% cho học sinh' }
    ];

    // Kiểm tra đăng nhập
    useEffect(() => {
        if (!isAuthenticated()) {
            Swal.fire({
                title: 'Cần đăng nhập!',
                text: 'Vui lòng đăng nhập để đăng ký gói hoa!',
                icon: 'info',
                confirmButtonText: 'Đăng nhập ngay',
                confirmButtonColor: '#8B5CF6',
                showCancelButton: true,
                cancelButtonText: 'Hủy',
                cancelButtonColor: '#6B7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                } else {
                    navigate('/');
                }
            });
            return;
        }
    }, [navigate]);

    // Fetch package detail và bouquets
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch package detail
                const params = new URLSearchParams(location.search);
                const packageId = params.get('packageId');
                if (packageId) {
                    const packageRes = await subscriptionAPI.getPackageDetail(packageId);
                    const p = packageRes.data;
                    const plan = {
                        id: p.packageId || p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        duration: p.duration,
                        deliveryFrequency: p.deliveryFrequency,
                        imageUrl: p.imageUrl
                    };
                    setSelectedPlan(plan);
                }

                // Fetch bouquets from API (sử dụng admin API vì user vẫn có thể dùng)
                try {
                    const bouquetsRes = await adminAPI.getBouquets();
                    setBouquets(bouquetsRes.data || []);
                } catch (bouquetError) {
                    console.warn('Không thể tải danh sách bouquets:', bouquetError);
                    setBouquets([]);
                }

                // Set default delivery date (next week)
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setDeliveryDate(nextWeek.toISOString().split('T')[0]);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Không thể tải thông tin. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const handleBouquetSelect = (bouquet) => {
        setSelectedBouquet(bouquet);
    };

    const handlePaymentSelect = (payment) => {
        setSelectedPayment(payment);
    };

    const handleDiscountApply = () => {
        if (!discountCode.trim()) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng nhập mã giảm giá!',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
            return;
        }

        // Tìm discount trong danh sách
        const discount = studentDiscounts.find(d => d.name.toLowerCase() === discountCode.toLowerCase());
        if (discount) {
            setAppliedDiscount(discount);
            Swal.fire({
                title: 'Thành công!',
                text: `Áp dụng thành công mã giảm giá ${discount.name}!`,
                icon: 'success',
                confirmButtonColor: '#8B5CF6'
            });
        } else {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Mã giảm giá không hợp lệ!',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    const calculateSubtotal = () => {
        return selectedPlan ? selectedPlan.price : 0;
    };

    const calculateDiscount = () => {
        if (!appliedDiscount) return 0;
        return (calculateSubtotal() * appliedDiscount.discount) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const handleSubmit = async () => {
        if (!selectedPlan || !selectedBouquet || !selectedPayment || !deliveryDate) {
            Swal.fire({
                title: 'Thiếu thông tin!',
                text: 'Vui lòng chọn đầy đủ thông tin gói, bó hoa, phương thức thanh toán và ngày giao hàng!',
                icon: 'warning',
                confirmButtonColor: '#F59E0B'
            });
            return;
        }

        // Tạo delivery date từ date và time
        const deliveryDateTime = new Date(`${deliveryDate}T${deliveryTime}`);

        // Chuẩn bị data cho API theo SubscriptionRequest
        const subscriptionData = {
            packageId: selectedPlan.id,
            bouquetId: selectedBouquet.id,
            deliveryDate: deliveryDateTime.toISOString(),
            paymentMethod: selectedPayment.code
        };

        try {
            // Nếu chọn VNPAY hoặc MOMO thì tạo payment và redirect
            if (selectedPayment?.code === 'CREDIT_CARD' || selectedPayment?.code === 'MOMO') {
                const res = await paymentAPI.create(Math.round(calculateTotal()));
                const paymentUrl = res.data?.result || res.data;

                if (paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                } else {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Không thể tạo URL thanh toán!',
                        icon: 'error',
                        confirmButtonColor: '#EF4444'
                    });
                    return;
                }
            } else {
                // Tạo subscription cho COD
                const response = await subscriptionAPI.createSubscription(subscriptionData);
                console.log('Subscription created:', response);

                Swal.fire({
                    title: 'Đăng ký thành công!',
                    text: 'Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#8B5CF6'
                }).then(() => {
                    navigate('/');
                });
            }
        } catch (error) {
            console.error('Error creating subscription:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể tạo đăng ký. Vui lòng thử lại sau.',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 mb-4">
                        <Calendar size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Đăng ký gói hoa
                    </h1>
                    <p className="text-xl text-gray-600">
                        Hoàn tất thông tin để đăng ký gói hoa của bạn
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Package Selection */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <Calendar className="w-6 h-6 text-primary-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Gói đã chọn
                                </h2>
                            </div>
                            {selectedPlan && (
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        {selectedPlan.imageUrl && (
                                            <img
                                                src={selectedPlan.imageUrl}
                                                alt={selectedPlan.name}
                                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {selectedPlan.name}
                                            </h3>
                                            <p className="text-gray-600 mb-2">
                                                {selectedPlan.description}
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{selectedPlan.duration} tháng</span>
                                                <span className="mx-2">•</span>
                                                <span>{selectedPlan.deliveryFrequency} lần/tuần</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary-600">
                                                {selectedPlan.price.toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bouquet Selection */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <Gift className="w-6 h-6 text-primary-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Chọn bó hoa
                                </h2>
                            </div>
                            {bouquets.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {bouquets.map((bouquet) => (
                                        <div
                                            key={bouquet.id}
                                            onClick={() => handleBouquetSelect(bouquet)}
                                            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedBouquet?.id === bouquet.id ? 'ring-2 ring-primary-500' : ''
                                                }`}
                                        >
                                            <img
                                                src={bouquet.imageUrl}
                                                alt={bouquet.name}
                                                className="w-full h-32 object-cover rounded-t-lg mb-4"
                                            />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {bouquet.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {bouquet.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Chưa có bó hoa nào</p>
                                </div>
                            )}
                        </div>

                        {/* Delivery Date Selection */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <Clock className="w-6 h-6 text-primary-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Chọn ngày và giờ giao hàng
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày giao hàng
                                    </label>
                                    <input
                                        type="date"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giờ giao hàng
                                    </label>
                                    <select
                                        value={deliveryTime}
                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="09:00">09:00</option>
                                        <option value="10:00">10:00</option>
                                        <option value="11:00">11:00</option>
                                        <option value="14:00">14:00</option>
                                        <option value="15:00">15:00</option>
                                        <option value="16:00">16:00</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <CreditCard className="w-6 h-6 text-primary-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Phương thức thanh toán
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {paymentMethods.map((payment) => (
                                    <div
                                        key={payment.id}
                                        onClick={() => handlePaymentSelect(payment)}
                                        className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedPayment?.id === payment.id ? 'ring-2 ring-primary-500' : ''
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">{payment.icon}</div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {payment.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {payment.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Tóm tắt đơn hàng
                            </h2>

                            {/* Selected Package */}
                            {selectedPlan && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Gói đã chọn:
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            {selectedPlan.imageUrl && (
                                                <img
                                                    src={selectedPlan.imageUrl}
                                                    alt={selectedPlan.name}
                                                    className="w-12 h-12 object-cover rounded-lg mr-3"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <span className="font-medium">{selectedPlan.name}</span>
                                                <div className="text-sm text-gray-600">
                                                    {selectedPlan.duration} tháng
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Selected Bouquet */}
                            {selectedBouquet && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Bó hoa đã chọn:
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <img
                                                src={selectedBouquet.imageUrl}
                                                alt={selectedBouquet.name}
                                                className="w-12 h-12 object-cover rounded-lg mr-3"
                                            />
                                            <span className="font-medium">{selectedBouquet.name}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delivery Info */}
                            {deliveryDate && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Thông tin giao hàng:
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            <span>Ngày: {new Date(deliveryDate).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>Giờ: {deliveryTime}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t pt-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tạm tính:</span>
                                        <span>{calculateSubtotal().toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá ({appliedDiscount.discount}%):</span>
                                            <span>-{calculateDiscount().toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                                        <span>Tổng cộng:</span>
                                        <span>{calculateTotal().toLocaleString('vi-VN')}đ</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!selectedPlan || !selectedBouquet || !selectedPayment || !deliveryDate}
                                className="w-full btn-primary text-lg py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Đăng ký ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
