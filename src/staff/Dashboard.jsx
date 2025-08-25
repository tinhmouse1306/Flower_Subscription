import { useState, useEffect } from 'react';
import StaffLayout from './StaffLayout';
import { staffAPI } from '../utils/api';
import {
  ShoppingCart,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar
} from 'lucide-react';

const StaffDashboard = () => {
  const [stats, setStats] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chuẩn hoá stats từ API -> cấu trúc UI đang dùng
  const normalizeStats = (s) => ([
    {
      title: 'Đơn hàng hôm nay',
      value: String(s?.todayOrders ?? s?.ordersToday ?? s?.totalToday ?? 0),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Đơn hàng đang giao',
      value: String(s?.shipping ?? s?.inTransit ?? s?.processingShipping ?? 0),
      icon: Truck,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Đơn hàng đã hoàn thành',
      value: String(s?.delivered ?? s?.completed ?? 0),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Khách hàng cần hỗ trợ',
      value: String(s?.needSupport ?? s?.supportNeeded ?? 0),
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
  ]);

  // Chuẩn hoá đơn hôm nay
  const normalizeOrder = (o) => {
    // Lấy mốc thời gian -> biến thành HH:mm nếu có thể
    const toHHmm = (t) => {
      try {
        if (!t) return '—';
        const dt = new Date(t);
        if (!isNaN(dt)) {
          const hh = String(dt.getHours()).padStart(2, '0');
          const mm = String(dt.getMinutes()).padStart(2, '0');
          return `${hh}:${mm}`;
        }
        // nếu đã là 'HH:mm' dạng string thì giữ lại 5 ký tự đầu
        return String(t).slice(0, 5);
      } catch {
        return '—';
      }
    };

    return {
      id: o?.id ?? o?.orderId ?? o?.code ?? '-',
      customer: o?.customer?.name ?? o?.customerName ?? o?.user?.fullName ?? '—',
      package: o?.packageName ?? o?.subscription?.name ?? '—',
      status: String(o?.status ?? 'pending').toLowerCase(),
      time: toHHmm(o?.time ?? o?.deliveryTime ?? o?.scheduledTime ?? o?.createdAt),
      address: o?.address?.fullAddress ?? o?.address ?? '—',
    };
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    (async () => {
      try {
        const [statsRes, todayRes] = await Promise.all([
          staffAPI.getDashboardStats(),
          staffAPI.getTodayOrders()
        ]);

        if (!mounted) return;

        const s = statsRes?.data ?? {};
        setStats(normalizeStats(s));

        const raw = todayRes?.data?.items ?? todayRes?.data ?? [];
        const list = Array.isArray(raw) ? raw.map(normalizeOrder) : [];
        setTodayOrders(list);
      } catch (e) {
        console.error('Failed to load dashboard', e);
        setError('Không tải được dữ liệu tổng quan.');
        setStats(normalizeStats({}));   // fallback = 0
        setTodayOrders([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

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

          {/* Quick Actions */}
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

        {/* Recent Activity (giữ nguyên mock, có thể nối sau nếu có endpoint) */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Đã giao đơn hàng #123 cho khách hàng Nguyễn Văn A</p>
                <p className="text-xs text-gray-500">2 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Xác nhận đơn hàng #124 cho khách hàng Trần Thị B</p>
                <p className="text-xs text-gray-500">15 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Bắt đầu giao đơn hàng #125 cho khách hàng Lê Văn C</p>
                <p className="text-xs text-gray-500">30 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Cập nhật thông tin khách hàng Phạm Thị D</p>
                <p className="text-xs text-gray-500">1 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
