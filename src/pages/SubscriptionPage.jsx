import { useState } from 'react';
import { subscriptionPlans, deliveryTimeSlots, paymentMethods, studentDiscounts } from '../data/mockData';
import { Calendar, Clock, CreditCard, Gift, Users, CheckCircle } from 'lucide-react';

const SubscriptionPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [isStudent, setIsStudent] = useState(false);
    const [studentId, setStudentId] = useState('');

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
    };

    const handlePaymentSelect = (payment) => {
        setSelectedPayment(payment);
    };

    const applyDiscount = () => {
        const discount = studentDiscounts.find(d => d.code === discountCode.toUpperCase());
        if (discount) {
            setAppliedDiscount(discount);
            alert(`Áp dụng thành công mã giảm giá ${discount.name}!`);
        } else {
            alert('Mã giảm giá không hợp lệ!');
        }
    };

    const calculateTotal = () => {
        if (!selectedPlan) return 0;

        let total = selectedPlan.price;

        if (appliedDiscount) {
            total = total * (1 - appliedDiscount.discount / 100);
        }

        return total;
    };

    const handleSubmit = () => {
        if (!selectedPlan || !selectedTimeSlot || !selectedPayment) {
            alert('Vui lòng chọn đầy đủ thông tin!');
            return;
        }

        console.log('Đăng ký gói:', {
            plan: selectedPlan,
            timeSlot: selectedTimeSlot,
            payment: selectedPayment,
            discount: appliedDiscount,
            isStudent,
            studentId,
            total: calculateTotal()
        });

        alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Đăng ký gói hoa
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chọn gói phù hợp và tận hưởng dịch vụ hoa tươi mỗi tuần.
                            Đặc biệt ưu đãi cho sinh viên!
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Selection */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Plan Selection */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <Calendar className="w-6 h-6 text-primary-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Chọn gói đăng ký
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {subscriptionPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedPlan?.id === plan.id ? 'ring-2 ring-primary-500' : ''
                                            }`}
                                    >
                                        <div className="text-center">
                                            {plan.popular && (
                                                <div className="bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">
                                                    Phổ biến
                                                </div>
                                            )}
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {plan.name}
                                            </h3>
                                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                                {plan.price.toLocaleString('vi-VN')}đ
                                            </div>
                                            <div className="text-gray-500 line-through mb-2">
                                                {plan.originalPrice.toLocaleString('vi-VN')}đ
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                {plan.description}
                                            </p>
                                            <div className="text-sm text-gray-500">
                                                {plan.duration} tháng
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Time Selection */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <Clock className="w-6 h-6 text-primary-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Chọn thời gian giao hàng
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {deliveryTimeSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        onClick={() => slot.available && handleTimeSlotSelect(slot)}
                                        className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedTimeSlot?.id === slot.id ? 'ring-2 ring-primary-500' : ''
                                            } ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {slot.time}
                                            </h3>
                                            <p className="text-gray-600">
                                                {slot.description}
                                            </p>
                                            {!slot.available && (
                                                <div className="text-red-500 text-sm mt-2">
                                                    Không khả dụng
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="card">
                            <div className="flex items-center mb-6">
                                <CreditCard className="w-6 h-6 text-primary-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Chọn phương thức thanh toán
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {paymentMethods.map((payment) => (
                                    <div
                                        key={payment.id}
                                        onClick={() => handlePaymentSelect(payment)}
                                        className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedPayment?.id === payment.id ? 'ring-2 ring-primary-500' : ''
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-4">{payment.icon}</span>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {payment.name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {payment.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Tóm tắt đơn hàng
                            </h2>

                            {/* Selected Plan */}
                            {selectedPlan && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Gói đã chọn:
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{selectedPlan.name}</span>
                                            <span className="text-primary-600 font-semibold">
                                                {selectedPlan.price.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {selectedPlan.duration} tháng
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Selected Time Slot */}
                            {selectedTimeSlot && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Thời gian giao:
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="font-medium">{selectedTimeSlot.time}</div>
                                        <div className="text-sm text-gray-500">{selectedTimeSlot.description}</div>
                                    </div>
                                </div>
                            )}
                            {/* Total */}
                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                                    <span>Tổng cộng:</span>
                                    <span className="text-2xl text-primary-600">
                                        {calculateTotal().toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                                {appliedDiscount && (
                                    <div className="text-sm text-green-600 mt-2">
                                        Tiết kiệm: {((selectedPlan?.price || 0) * appliedDiscount.discount / 100).toLocaleString('vi-VN')}đ
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedPlan || !selectedTimeSlot || !selectedPayment}
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
