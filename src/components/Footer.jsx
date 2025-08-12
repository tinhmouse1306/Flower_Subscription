import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🌸</span>
                            </div>
                            <span className="text-xl font-bold">FlowerSub</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Dịch vụ đăng ký hoa hàng đầu cho sinh viên.
                            Hoa tươi, giao hàng đúng hẹn, giá cả phù hợp.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/packages" className="text-gray-400 hover:text-white transition-colors">
                                    Gói hoa
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/packages" className="text-gray-400 hover:text-white transition-colors">
                                    Gói cơ bản
                                </Link>
                            </li>
                            <li>
                                <Link to="/packages" className="text-gray-400 hover:text-white transition-colors">
                                    Gói premium
                                </Link>
                            </li>
                            <li>
                                <Link to="/packages" className="text-gray-400 hover:text-white transition-colors">
                                    Gói tiết kiệm
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery" className="text-gray-400 hover:text-white transition-colors">
                                    Tùy chọn giao hàng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <MapPin size={16} className="text-primary-500" />
                                <span className="text-gray-400">
                                    123 Đường ABC, Quận 1, TP.HCM
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone size={16} className="text-primary-500" />
                                <span className="text-gray-400">
                                    090 123 4567
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail size={16} className="text-primary-500" />
                                <span className="text-gray-400">
                                    info@flowersub.vn
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 FlowerSub. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Chính sách bảo mật
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Điều khoản sử dụng
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
