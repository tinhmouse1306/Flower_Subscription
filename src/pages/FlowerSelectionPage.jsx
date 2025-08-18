import { useState } from 'react';
import { flowerPreferences, seasonalFlowers, colorPreferences, specialOccasions } from '../data/mockData';
import { Filter, Heart, Calendar, Palette, Sun } from 'lucide-react';

const FlowerSelectionPage = () => {
    const [selectedPreference, setSelectedPreference] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedOccasion, setSelectedOccasion] = useState(null);

    const handlePreferenceSelect = (preference) => {
        setSelectedPreference(preference);
        setSelectedSeason(null);
        setSelectedColor(null);
        setSelectedOccasion(null);
    };

    const handleSeasonSelect = (season) => {
        setSelectedSeason(season);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleOccasionSelect = (occasion) => {
        setSelectedOccasion(occasion);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Chọn hoa theo sở thích
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Khám phá và chọn loại hoa phù hợp với sở thích và nhu cầu của bạn.
                            Chúng tôi có đa dạng các loại hoa theo mùa, màu sắc và dịp lễ.
                        </p>
                    </div>
                </div>
            </div>

            {/* Preference Selection */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Bạn muốn chọn hoa theo cách nào?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Chọn một trong những tùy chọn dưới đây để bắt đầu
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {flowerPreferences.map((preference) => (
                        <div
                            key={preference.id}
                            onClick={() => handlePreferenceSelect(preference)}
                            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedPreference?.id === preference.id ? 'ring-2 ring-primary-500' : ''
                                }`}
                        >
                            <img
                                src={preference.image}
                                alt={preference.name}
                                className="w-full h-48 object-cover rounded-t-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {preference.name}
                            </h3>
                            <p className="text-gray-600">
                                {preference.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Seasonal Flowers */}
                {selectedPreference?.name === "Hoa theo mùa" && (
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                                <Sun className="mr-2" />
                                Chọn hoa theo mùa
                            </h3>
                            <p className="text-lg text-gray-600">
                                Mỗi mùa có những loại hoa đặc trưng riêng
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {seasonalFlowers.map((season) => (
                                <div
                                    key={season.season}
                                    onClick={() => handleSeasonSelect(season)}
                                    className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedSeason?.season === season.season ? 'ring-2 ring-primary-500' : ''
                                        }`}
                                >
                                    <div className="text-center">
                                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                            {season.season}
                                        </h4>
                                        <div className="space-y-3">
                                            {season.flowers.map((flower) => (
                                                <div key={flower.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={flower.image}
                                                            alt={flower.name}
                                                            className="w-12 h-12 object-cover rounded-lg mr-3"
                                                        />
                                                        <span className="font-medium text-gray-900">
                                                            {flower.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-primary-600 font-semibold">
                                                        {flower.price.toLocaleString('vi-VN')}đ
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Color Preferences */}
                {selectedPreference?.name === "Hoa theo màu sắc" && (
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                                <Palette className="mr-2" />
                                Chọn hoa theo màu sắc
                            </h3>
                            <p className="text-lg text-gray-600">
                                Mỗi màu sắc mang một ý nghĩa riêng
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {colorPreferences.map((color) => (
                                <div
                                    key={color.color}
                                    onClick={() => handleColorSelect(color)}
                                    className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedColor?.color === color.color ? 'ring-2 ring-primary-500' : ''
                                        }`}
                                >
                                    <div className="text-center">
                                        <div
                                            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-200"
                                            style={{ backgroundColor: color.hex }}
                                        ></div>
                                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                            {color.color}
                                        </h4>
                                        <p className="text-gray-600 mb-4">
                                            {color.meaning}
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            {color.flowers.length} loại hoa có sẵn
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Special Occasions */}
                {selectedPreference?.name === "Hoa theo dịp lễ" && (
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                                <Calendar className="mr-2" />
                                Chọn hoa theo dịp lễ
                            </h3>
                            <p className="text-lg text-gray-600">
                                Hoa đặc biệt cho những dịp quan trọng
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {specialOccasions.map((occasion) => (
                                <div
                                    key={occasion.id}
                                    onClick={() => handleOccasionSelect(occasion)}
                                    className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedOccasion?.id === occasion.id ? 'ring-2 ring-primary-500' : ''
                                        }`}
                                >
                                    <img
                                        src={occasion.image}
                                        alt={occasion.name}
                                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                                    />
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        {occasion.name}
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        {occasion.description}
                                    </p>
                                    <div className="text-primary-600 font-semibold text-lg">
                                        {occasion.price.toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {(selectedSeason || selectedColor || selectedOccasion) && (
                    <div className="text-center">
                        <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Bạn đã chọn:
                            </h3>
                            <div className="mb-6">
                                {selectedSeason && (
                                    <div className="text-lg text-gray-700">
                                        <strong>Mùa:</strong> {selectedSeason.season}
                                    </div>
                                )}
                                {selectedColor && (
                                    <div className="text-lg text-gray-700">
                                        <strong>Màu sắc:</strong> {selectedColor.color} - {selectedColor.meaning}
                                    </div>
                                )}
                                {selectedOccasion && (
                                    <div className="text-lg text-gray-700">
                                        <strong>Dịp lễ:</strong> {selectedOccasion.name}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="btn-primary text-lg px-8 py-4">
                                    Tiếp tục đăng ký
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedPreference(null);
                                        setSelectedSeason(null);
                                        setSelectedColor(null);
                                        setSelectedOccasion(null);
                                    }}
                                    className="btn-secondary text-lg px-8 py-4"
                                >
                                    Chọn lại
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlowerSelectionPage;
