import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Heart } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock state

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🌸</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">FlowerSub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Trang chủ
                        </Link>
                        <Link to="/packages" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Gói hoa
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Về chúng tôi
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Liên hệ
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                            <Heart size={20} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                2
                            </span>
                        </button>

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-2">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                                    alt="User"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-gray-700 font-medium">Anh</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                    Đăng nhập
                                </button>
                                <button className="btn-primary">
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/packages"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Gói hoa
                            </Link>
                            <Link
                                to="/about"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Về chúng tôi
                            </Link>
                            <Link
                                to="/contact"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Liên hệ
                            </Link>

                            <div className="pt-4 border-t border-gray-200">
                                {isLoggedIn ? (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                                            alt="User"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-gray-700 font-medium">Anh</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <button className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-left">
                                            Đăng nhập
                                        </button>
                                        <button className="btn-primary w-full">
                                            Đăng ký
                                        </button>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
