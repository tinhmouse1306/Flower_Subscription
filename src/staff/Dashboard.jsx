import { useState, useEffect } from 'react';
import StaffLayout from './StaffLayout';
import { subscriptionAPI } from '../utils/api';
import {
  ShoppingCart,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar
} from 'lucide-react';

// ---- helpers ----
const toHHmm = (t) => {
  try {
    if (!t) return '—';
    const d = new Date(t);
    if (!isNaN(d)) {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    }
    return String(t).slice(0, 5);
  } catch {
    return '—';
  }
};

const isSameYMD = (a, b = new Date()) => {
  try {
    const d = new Date(a);
    if (isNaN(d)) return false;
    return (
      d.getFullYear() === b.getFullYear() &&
      d.getMonth() === b.getMonth() &&
      d.getDate() === b.getDate()
    );
  } catch {
    return false;
  }
};

const uiStatus = (apiStatus) => {
  const v = String(apiStatus || '').toUpperCase();
  if (v === 'AVAILABLE' || v === 'PENDING') return 'pending';
  if (v === 'ACTIVE') return 'shipping';
  if (v === 'COMPLETED') return 'delivered';
  if (v === 'CANCELLED') return 'cancelled';
  return 'pending';
};

// Chuẩn hoá stats -> cấu trúc UI đang dùng
const normalizeStats = (s) => ([
  {
    title: 'Đơn hàng hôm nay',
    value: String(s.todayOrders ?? 0),
    icon: ShoppingCart,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    title: 'Đơn hàng đang giao',
    value: String(s.shipping ?? 0),
    icon: Truck,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  {
    title: 'Đơn hàng đã hoàn thành',
    value: String(s.delivered ?? 0),
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
  {
    title: 'Khách hàng cần hỗ trợ',
    value: String(s.needSupport ?? 0),
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
]);

// Chuẩn hoá 1 bản ghi subscription về item hiển thị ở “Đơn hôm nay”
const normalizeTodayItem = (sub) => ({
  id: sub?.id ?? '-',
  customer: sub?.user?.fullName || sub?.user?.name || (sub?.userId ? `User #${sub.userId}` : '—'),
  package: sub?.subscriptionPackage?.name || sub?.package?.name || '—',
  time: toHHmm(sub?.deliveryDate ?? sub?.createdAt),
  status: uiStatus(sub?.status),
});

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-purple-100 text-purple-800';
    case 'shipping': return 'bg-orange-100 text-orange-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Chờ xác nhận';
    case 'processing': return 'Đang xử lý';
    case 'shipping': return 'Đang giao';
    case 'delivered': return 'Đã giao';
    default: return status;
  }
};

const StaffDashboard = () => {
  const [stats, setStats] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    (async () => {
      try {
        // LẤY DANH SÁCH SUBSCRIPTIONS (thay cho các endpoint /api/staff/...)
        const res = await subscriptionAPI.list({ pageSize: 200 });
        const list = Array.isArray(res?.data?.items)
          ? res.data.items
          : (Array.isArray(res?.data) ? res.data : []);

        // Thống kê
        const shipping = list.filter(x => String(x.status).toUpperCase() === 'ACTIVE').length;
        const delivered = list.filter(x => String(x.status).toUpperCase() === 'COMPLETED').length;
        const needSupport = list.filter(x => ['AVAILABLE', 'PENDING'].includes(String(x.status).toUpperCase())).length;
        const today = list.filter(x => isSameYMD(x.deliveryDate));

        // Sắp xếp và map “Đơn hôm nay”
        today.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
        const todayUI = today.map(normalizeTodayItem);

        if (!mounted) return;
        setStats(normalizeStats({
          todayOrders: today.length,
          shipping,
          delivered,
          needSupport,
        }));
        setTodayOrders(todayUI);
      } catch (e) {
        console.error('Failed to load dashboard', e);
        if (mounted) {
          setError('Không tải được dữ liệu tổng quan.');
          setStats(normalizeStats({})); // fallback = 0
          setTodayOrders([]);
        }
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return (
    <StaffLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600">Chào mừng bạn! Đây là tổng quan về công việc hôm nay</p>
        </div>

        {/* Loading & Error */}
        {loading && <div className="text-sm text-gray-500 mb-4">Đang tải dữ liệu…</div>}
        {!!error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Đơn hàng hôm nay</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
            </div>
            <div className="space-y-3">
              {todayOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{order.time}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.package}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
              {!loading && todayOrders.length === 0 && (
                <div className="text-sm text-gray-500">Không có đơn nào cho hôm nay.</div>
              )}
            </div>
          </div>

          {/* Quick Actions (giữ nguyên) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Xem đơn hàng mới</p>
                  <p className="text-sm text-gray-500">Kiểm tra và xác nhận đơn hàng</p>
                </div>
              </button>
              <button className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Truck className="h-8 w-8 text-orange-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Cập nhật trạng thái</p>
                  <p className="text-sm text-gray-500">Cập nhật trạng thái giao hàng</p>
                </div>
              </button>
              <button className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Lịch giao hàng</p>
                  <p className="text-sm text-gray-500">Xem lịch giao hàng hôm nay</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
