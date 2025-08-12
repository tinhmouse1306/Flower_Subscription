import { Check, Star } from 'lucide-react';

const PackageCard = ({ package: packageData, onSelect }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className={`card relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${packageData.popular ? 'ring-2 ring-primary-500' : ''}`}>
            {/* Popular Badge */}
            {packageData.popular && (
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
                    src={packageData.image}
                    alt={packageData.name}
                    className="w-full h-48 object-cover rounded-lg"
                />
                {packageData.popular && (
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                        <Star size={20} className="text-primary-500 fill-current" />
                    </div>
                )}
            </div>

            {/* Package Info */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{packageData.name}</h3>
                <p className="text-gray-600 mb-4">{packageData.description}</p>

                {/* Price */}
                <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold text-primary-600">
                            {formatPrice(packageData.price)}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                            {formatPrice(packageData.originalPrice)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">mỗi tuần</p>
                </div>
            </div>

            {/* Features */}
            <div className="mb-6">
                <ul className="space-y-3">
                    {packageData.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Check size={18} className="text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Button */}
            <button
                onClick={() => onSelect(packageData)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${packageData.popular
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
