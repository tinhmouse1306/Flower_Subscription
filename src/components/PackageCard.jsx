import { Check, Star } from 'lucide-react';

const PackageCard = ({ package: packageData, onSelect }) => {
    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Handle missing data gracefully
    const safePackage = {
        id: packageData.id || Math.random(),
        packageId: packageData.packageId || packageData.id,
        name: packageData.name || 'Gói không tên',
        description: packageData.description || 'Mô tả không có sẵn',
        price: packageData.price || 0,
        originalPrice: packageData.originalPrice || packageData.price || 0,
        image: packageData.image || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
        popular: packageData.popular || false,
        category: packageData.category || 'basic',
        durationMonths: packageData.durationMonths || packageData.duration || 1
    };

    return (
        <div className={`card relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${safePackage.popular ? 'ring-2 ring-primary-500' : ''}`}>
            {/* Popular Badge */}
            {safePackage.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                        <Star size={16} className="mr-1" />
                        Phổ biến nhất
                    </div>
                </div>
            )}

            {/* Package Image */}
            <div className="relative mb-6">
                <img
                    src={safePackage.image}
                    alt={safePackage.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop';
                    }}
                />
                {safePackage.popular && (
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                        <Star size={20} className="text-primary-500 fill-current" />
                    </div>
                )}
            </div>

            {/* Package Info */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{safePackage.name}</h3>
                <p className="text-gray-600 mb-4">{safePackage.description}</p>

                {/* Price */}
                <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold text-primary-600">
                            {formatPrice(safePackage.price)}
                        </span>
                        {safePackage.originalPrice > safePackage.price && (
                            <span className="text-lg text-gray-400 line-through">
                                {formatPrice(safePackage.originalPrice)}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{safePackage.durationMonths} tháng</p>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={() => onSelect(safePackage)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${safePackage.popular
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
            >
                Chọn gói này
            </button>
        </div>
    );
};

export default PackageCard;
