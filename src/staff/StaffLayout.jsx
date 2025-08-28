import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, Home, ShoppingCart, Users, Bell
} from 'lucide-react';

import { getToken, logout } from '../utils/auth';
import { userAPI } from '../utils/api';

// Chuẩn hoá role -> 'STAFF' nếu có
const norm = (v) => String(v || '').toUpperCase().replace(/^ROLE_/, '');
const hasStaffRole = (u) => {
  if (!u) return false;
  if (norm(u.role) === 'STAFF') return true;
  if (norm(u.userRole) === 'STAFF') return true;
  if (norm(u.userRoleChoice) === 'STAFF') return true;
  if (Array.isArray(u.roles) && u.roles.some(r => norm(typeof r === 'string' ? r : (r?.name || r?.role || r?.roleName)) === 'STAFF')) return true;
  if (Array.isArray(u.authorities) && u.authorities.some(a => norm(a?.authority) === 'STAFF')) return true;
  if (u.isStaff === true) return true;
  return false;
};

const readLocalUser = () => {
  try {
    // ưu tiên key 'user', sau đó 'auth'
    const raw = localStorage.getItem('user') || localStorage.getItem('auth') || '{}';
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const StaffLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const doCheck = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login', { replace: true, state: { from: location.pathname } });
        return;
      }

      // 1) Quyết định quyền truy cập dựa trên localStorage (không gọi API)
      const localUser = readLocalUser();
      if (!hasStaffRole(localUser)) {
        // Nếu vẫn chưa có role staff trong local -> chặn
        navigate('/login', { replace: true, state: { from: location.pathname } });
        mounted && setChecking(false);
        return;
      }

      // Cho vào trang staff ngay
      if (mounted) {
        setUser(localUser);
        setChecking(false);
      }

      // 2) Làm mới profile (nếu backend có), *không* điều hướng nếu lỗi 404/403
      try {
        const res = await userAPI.getProfile();
        const profile = res?.data;
        if (profile && mounted) {
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        }
      } catch (e) {
        // BỎ QUA lỗi 404/403 hoặc network – không logout, không redirect
        // console.debug('Refresh profile failed (ignored):', e);
      }
    };

    doCheck();

    const onStorage = (ev) => {
      if (ev.key === 'token' && !ev.newValue) {
        navigate('/login', { replace: true });
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navigation = [
    { name: 'Tổng quan', href: '/staff', icon: Home },
    { name: 'Quản lý đơn hàng', href: '/staff/orders', icon: ShoppingCart },
    { name: 'Khách hàng', href: '/staff/customers', icon: Users },
  ];

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 text-gray-600">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>Đang xác thực…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Staff Panel</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Staff Panel</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <div className="hidden lg:flex lg:flex-col lg:items-end">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || user?.fullName || 'Staff'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:block">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
