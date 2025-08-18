import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Gift, CreditCard } from 'lucide-react';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Gói Sinh Viên Cơ Bản",
            price: 150000,
            originalPrice: 200000,
            image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop",
            quantity: 1,
            duration: "3 tháng",
            features: [
                "1 bó hoa tươi mỗi tuần",
                "Giao hàng miễn phí",
                "Hoa theo mùa",
                "Có thể hủy bất cứ lúc nào"
            ]
        },
        {
            id: 2,
            name: "Gói Premium",
            price: 250000,
            originalPrice: 350000,
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop",
            quantity: 1,
            duration: "6 tháng",
            features: [
                "2 bó hoa tươi mỗi tuần",
                "Hoa cao cấp, đa dạng",
                "Giao hàng miễn phí",
                "Tặng kèm chậu trồng"
            ]
        }
    ]);

    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const applyDiscount = () => {
        const discountCodes = {
            'STUDENT15': { name: 'Giảm giá sinh viên', discount: 15 },
            'WELCOME10': { name: 'Chào mừng khách hàng mới', discount: 10 },
            'SPRING20': { name: 'Ưu đãi mùa xuân', discount: 20 }
        };

        const discount = discountCodes[discountCode.toUpperCase()];
        if (discount) {
            setAppliedDiscount(discount);
            alert(`Áp dụng thành công mã giảm giá ${discount.name}!`);
        } else {
            alert('Mã giảm giá không hợp lệ!');
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateDiscount = () => {
        if (!appliedDiscount) return 0;
        return (calculateSubtotal() * appliedDiscount.discount) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const handleCheckout = () => {
        setIsLoading(true);
        // Simulate checkout process
        setTimeout(() => {
            console.log('Proceeding to checkout:', {
                items: cartItems,
                subtotal: calculateSubtotal(),
                discount: calculateDiscount(),
                total: calculateTotal()
            });
            // Navigate to payment success page
            window.location.href = '/payment-success';
        }, 1000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Giỏ hàng trống
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Bạn chưa có sản phẩm nào trong giỏ hàng
                        </p>
                        <Link
                            to="/packages"
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Xem các gói hoa
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/packages"
                        className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Tiếp tục mua sắm
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Giỏ hàng ({cartItems.length} sản phẩm)
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Sản phẩm đã chọn
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Thời hạn: {item.duration}
                                                </p>
                                                <div className="text-sm text-gray-600 mb-3">
                                                    <ul className="space-y-1">
                                                        {item.features.slice(0, 2).map((feature, index) => (
                                                            <li key={index}>• {feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-12 text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-semibold text-primary-600">
                                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                                        </div>
                                                        {item.originalPrice > item.price && (
                                                            <div className="text-sm text-gray-500 line-through">
                                                                {(item.originalPrice * item.quantity).toLocaleString('vi-VN')}đ
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm sticky top-8">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Tóm tắt đơn hàng
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Discount Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã giảm giá
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            placeholder="Nhập mã giảm giá"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={applyDiscount}
                                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                                            {appliedDiscount.name} - Giảm {appliedDiscount.discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Tạm tính:</span>
                                        <span>{calculateSubtotal().toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Giảm giá:</span>
                                            <span>-{calculateDiscount().toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span>Phí giao hàng:</span>
                                        <span className="text-green-600">Miễn phí</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Tổng cộng:</span>
                                            <span className="text-primary-600">
                                                {calculateTotal().toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full btn-primary py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Đang xử lý...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Thanh toán ngay
                                        </div>
                                    )}
                                </button>

                                {/* Security Info */}
                                <div className="text-center text-sm text-gray-500">
                                    <p>🔒 Thanh toán an toàn</p>
                                    <p>✅ Giao hàng miễn phí</p>
                                    <p>🔄 Đổi trả dễ dàng</p>
                                </div>
                            </div>
                        </div>

                        {/* Student Benefits */}
                        <div className="mt-6 bg-primary-50 rounded-lg p-6">
                            <div className="flex items-center mb-3">
                                <Gift className="w-5 h-5 text-primary-600 mr-2" />
                                <h3 className="text-lg font-semibold text-primary-900">
                                    Ưu đãi sinh viên
                                </h3>
                            </div>
                            <ul className="text-sm text-primary-700 space-y-1">
                                <li>• Giảm thêm 15% với mã STUDENT15</li>
                                <li>• Giao hàng miễn phí</li>
                                <li>• Ưu đãi đặc biệt cho gói dài hạn</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
