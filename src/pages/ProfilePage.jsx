import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Edit, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { userAPI } from '../utils/api';
import { isAuthenticated, getUser } from '../utils/auth';
import Swal from 'sweetalert2';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError('');

                // Check if user is authenticated
                if (!isAuthenticated()) {
                    setError('Bạn cần đăng nhập để xem hồ sơ cá nhân');
                    return;
                }

                // Get user data from localStorage for Google users
                const userData = getUser();
                if (userData?.isGoogleUser) {
                    // For Google users, use data from localStorage
                    setProfile({
                        fullName: userData.name || userData.fullName || 'N/A',
                        email: userData.email || 'N/A',
                        role: userData.role || 'USER'
                    });
                } else {
                    // For regular users, fetch from API
                    const response = await userAPI.getMyInfo();
                    const apiData = response.data.result; // Lấy result từ response

                    console.log('API Response:', response.data);
                    console.log('API Data:', apiData);

                    setProfile({
                        fullName: apiData.fullName || 'N/A',
                        email: apiData.email || 'N/A',
                        role: apiData.roles?.[0]?.userType || 'USER'
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = () => {
        setEditForm({
            fullName: profile?.fullName || ''
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const handleSave = async () => {
        try {
            // For Google users, just update localStorage
            const userData = getUser();
            if (userData?.isGoogleUser) {
                const updatedUserData = {
                    ...userData,
                    ...editForm
                };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));

                setProfile(prev => ({ ...prev, ...editForm }));
                setIsEditing(false);

                await Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công!',
                    text: 'Thông tin hồ sơ đã được cập nhật.',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
            } else {
                // For regular users, call API
                await userAPI.updateProfile(editForm);
                setProfile(prev => ({ ...prev, ...editForm }));
                setIsEditing(false);

                await Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công!',
                    text: 'Thông tin hồ sơ đã được cập nhật.',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi cập nhật',
                text: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
                confirmButtonText: 'Thử lại',
                background: '#f8fafc',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-lg shadow-xl',
                    title: 'text-xl font-bold text-gray-900',
                    content: 'text-gray-600'
                }
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleChangePassword = () => {
        setShowChangePassword(true);
        setPasswordForm({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleCancelChangePassword = () => {
        setShowChangePassword(false);
        setPasswordForm({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleSavePassword = async () => {
        try {
            // Validate form
            if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng điền đầy đủ thông tin.',
                    confirmButtonText: 'Thử lại',
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
                return;
            }

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Mật khẩu mới và xác nhận mật khẩu không khớp.',
                    confirmButtonText: 'Thử lại',
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
                return;
            }

            if (passwordForm.newPassword.length < 6) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
                    confirmButtonText: 'Thử lại',
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
                return;
            }

            // Check old password first
            const checkResponse = await userAPI.checkPassword({
                oldPassword: passwordForm.oldPassword
            });

            if (checkResponse.data.code === 1010) {
                // Old password is correct, proceed with change
                await userAPI.changePassword({
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                });

                setShowChangePassword(false);
                setPasswordForm({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                await Swal.fire({
                    icon: 'success',
                    title: 'Đổi mật khẩu thành công!',
                    text: 'Mật khẩu của bạn đã được cập nhật.',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Mật khẩu cũ không đúng.',
                    confirmButtonText: 'Thử lại',
                    background: '#f8fafc',
                    color: '#1f2937',
                    customClass: {
                        popup: 'rounded-lg shadow-xl',
                        title: 'text-xl font-bold text-gray-900',
                        content: 'text-gray-600'
                    }
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi đổi mật khẩu',
                text: 'Không thể đổi mật khẩu. Vui lòng thử lại.',
                confirmButtonText: 'Thử lại',
                background: '#f8fafc',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-lg shadow-xl',
                    title: 'text-xl font-bold text-gray-900',
                    content: 'text-gray-600'
                }
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                        <p className="text-lg font-medium">{error}</p>
                    </div>
                    <Link to="/login" className="btn-primary">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Quay lại trang chủ
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                    <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân của bạn</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                    <User size={40} className="text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {profile?.fullName || 'Chưa có tên'}
                                    </h2>
                                    <p className="text-primary-100">
                                        {profile?.role === 'ADMIN' ? 'Quản trị viên' :
                                            profile?.role === 'STAFF' ? 'Nhân viên' : 'Khách hàng'}
                                    </p>
                                </div>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Edit size={16} />
                                    <span>Chỉnh sửa</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6">
                        {isEditing ? (
                            // Edit Form
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={editForm.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={profile?.email || ''}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <X size={16} />
                                        <span>Hủy</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center space-x-2 btn-primary"
                                    >
                                        <Save size={16} />
                                        <span>Lưu thay đổi</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Display Info
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <User size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Họ và tên</p>
                                        <p className="font-medium">{profile?.fullName || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{profile?.email || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        to="/my-subscriptions"
                        className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Gói đăng ký</h3>
                                <p className="text-gray-600">Xem các gói đăng ký của bạn</p>
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={handleChangePassword}
                        className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-left w-full"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Lock size={24} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Đổi mật khẩu</h3>
                                <p className="text-gray-600">Cập nhật mật khẩu tài khoản</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h3>
                            <button
                                onClick={handleCancelChangePassword}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu hiện tại
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.oldPassword ? 'text' : 'password'}
                                        name="oldPassword"
                                        value={passwordForm.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('oldPassword')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.oldPassword ? (
                                            <EyeOff size={16} className="text-gray-400" />
                                        ) : (
                                            <Eye size={16} className="text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.newPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('newPassword')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.newPassword ? (
                                            <EyeOff size={16} className="text-gray-400" />
                                        ) : (
                                            <Eye size={16} className="text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.confirmPassword ? (
                                            <EyeOff size={16} className="text-gray-400" />
                                        ) : (
                                            <Eye size={16} className="text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={handleCancelChangePassword}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSavePassword}
                                className="btn-primary"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
