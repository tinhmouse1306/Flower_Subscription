import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Heart, LogOut, Settings, Shield, ChevronDown, Package, UserCircle } from 'lucide-react';
import { isAuthenticated, getUser, logout } from '../utils/auth';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            setIsLoggedIn(authenticated);
            if (authenticated) {
                setUser(getUser());
            }
        };

        checkAuth();
        // Listen for storage changes (when user logs in/out in another tab)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check user role from user data
    const isAdmin = user?.role === 'admin';
    const isStaff = user?.role === 'staff';

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
                        <Link to="/flower-selection" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Chọn hoa
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
                        <Link to="/cart" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                2
                            </span>
                        </Link>

                        {isLoggedIn ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                                >
                                    <span className="font-medium">
                                        Welcome, {user?.fullName || user?.userName || 'User'}
                                    </span>
                                    <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Menu Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <UserCircle size={16} className="mr-3" />
                                            Hồ sơ cá nhân
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Package size={16} className="mr-3" />
                                            Đơn hàng
                                        </Link>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} className="mr-3" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}

                                {/* Role badges */}
                                <div className="flex items-center space-x-1 mt-1">
                                    {isAdmin && (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                            Admin
                                        </span>
                                    )}
                                    {isStaff && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            Staff
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Đăng ký
                                </Link>
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
                                to="/flower-selection"
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Chọn hoa
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
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-700 font-medium">
                                                Welcome, {user?.fullName || user?.userName || 'User'}
                                            </span>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <UserCircle size={16} />
                                            <span>Hồ sơ cá nhân</span>
                                        </Link>

                                        <Link
                                            to="/orders"
                                            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Package size={16} />
                                            <span>Đơn hàng</span>
                                        </Link>

                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Link
                                            to="/login"
                                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-left"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="btn-primary w-full"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Đăng ký
                                        </Link>
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
