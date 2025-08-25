import { useState, useEffect, useMemo } from 'react';
import StaffLayout from './StaffLayout';
import api, { staffAPI } from '../utils/api';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Truck,
  Users,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';

// tiện ích nhỏ
const pct = (n) => (typeof n === 'number' ? n : Number(n || 0));
const asTrend = (t) => {
  const v = String(t || '').toLowerCase();
  if (v.includes('down') || v === 'decrease' || v === 'downward') return 'down';
  if (v.includes('up') || v === 'increase' || v === 'upward') return 'up';
  return 'flat';
};
const humanizeSeconds = (s) => {
  const sec = Number(s || 0);
  if (!sec) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

// Chuẩn hoá payload từ API -> cấu trúc UI
const normalizeReports = (d = {}) => {
  const deliveriesTotal =
    d.deliveries?.total ?? d.deliveryTotal ?? d.deliveriesTotal ?? 0;
  const deliveriesPending =
    d.deliveries?.pending ?? d.pendingDeliveries ?? 0;
  const deliveriesInProg =
    d.deliveries?.inProgress ?? d.inTransit ?? d.shipping ?? 0;
  const deliveriesCompleted =
    d.deliveries?.completed ?? d.delivered ?? 0;
  const deliveriesCancelled =
    d.deliveries?.cancelled ?? d.canceled ?? 0;

  const ordersProcessed =
    d.orders?.processed ?? d.processedOrders ?? d.completedOrders ?? 0;

  const perfOnTime =
    d.performance?.onTimeDelivery ??
    (d.onTimeDeliveryRate ? `${d.onTimeDeliveryRate}%` : undefined);

  const perfSatis =
    d.performance?.satisfactionRate ??
    (d.csat?.avg ? `${d.csat.avg}/5` : undefined);

  const perfAvgTime =
    d.performance?.avgDeliveryTime ??
    (d.avgDeliverySeconds ? humanizeSeconds(d.avgDeliverySeconds) : undefined);

  const daily =
    d.dailyDeliveries ??
    d.deliveriesByDay ??
    d.weeklyDeliveries ??
    [];

  // Nếu backend trả breakdown khác, map sang label tiếng Việt sẵn dùng
  const breakdown =
    d.deliveryStatus ??
    d.deliveryStatusBreakdown ??
    [
      { status: 'Đã giao', count: deliveriesCompleted, percentage: 0 },
      { status: 'Đang giao', count: deliveriesInProg, percentage: 0 },
      { status: 'Chờ giao', count: deliveriesPending, percentage: 0 },
      { status: 'Đã hủy', count: deliveriesCancelled, percentage: 0 },
    ];

  // tính percentage nếu thiếu
  const totalForPct = breakdown.reduce((s, x) => s + Number(x.count || 0), 0) || 1;
  const breakdownWithPct = breakdown.map(b => ({
    ...b,
    percentage: b.percentage ?? Math.round((Number(b.count || 0) * 100) / totalForPct)
  }));

  return {
    deliveries: {
      total: deliveriesTotal,
      pending: deliveriesPending,
      inProgress: deliveriesInProg,
      completed: deliveriesCompleted,
      cancelled: deliveriesCancelled,
      change: pct(d.deliveries?.change ?? d.change?.deliveries ?? 0),
      trend: asTrend(d.deliveries?.trend ?? d.trend?.deliveries ?? 'flat'),
    },
    orders: {
      total: d.orders?.total ?? d.ordersTotal ?? 0,
      processed: ordersProcessed,
      pending: d.orders?.pending ?? d.pendingOrders ?? 0,
      change: pct(d.orders?.change ?? d.change?.orders ?? 0),
      trend: asTrend(d.orders?.trend ?? d.trend?.orders ?? 'flat'),
    },
    customers: {
      active: d.customers?.active ?? d.activeCustomers ?? 0,
      new: d.customers?.new ?? d.newCustomers ?? 0,
      total: d.customers?.total ?? d.customersTotal ?? 0,
      change: pct(d.customers?.change ?? d.change?.customers ?? 0),
      trend: asTrend(d.customers?.trend ?? d.trend?.customers ?? 'flat'),
    },
    performance: {
      avgDeliveryTime: perfAvgTime ?? '—',
      satisfactionRate: perfSatis ?? '—',
      onTimeDelivery: perfOnTime ?? '—',
      change: pct(d.performance?.change ?? d.change?.performance ?? 0),
      trend: asTrend(d.performance?.trend ?? d.trend?.performance ?? 'flat'),
    },
    dailyDeliveries: daily.map(x => ({
      day: x.day ?? x.label ?? '—',
      deliveries: Number(x.deliveries ?? x.total ?? 0),
      completed: Number(x.completed ?? x.done ?? 0),
    })),
    deliveryStatus: breakdownWithPct,
    topDrivers: d.topDrivers ?? [],
  };
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
    default: return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getTrendColor = (trend) => {
  switch (trend) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const StaffReports = () => {
  const [reports, setReports] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async (period) => {
    setLoading(true);
    setError('');
    try {
      // Thử gọi có period (nếu BE hỗ trợ)
      let res;
      try {
        res = await api.get(`/api/staff/dashboard/stats?period=${encodeURIComponent(period)}`);
      } catch {
        // fallback: không có period thì gọi mặc định
        res = await staffAPI.getDashboardStats();
      }
      const data = res?.data ?? {};
      setReports(normalizeReports(data));
    } catch (e) {
      console.error('Failed to load staff reports', e);
      setError('Không tải được báo cáo.');
      setReports(normalizeReports({}));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(selectedPeriod);
  }, [selectedPeriod]);

  const handleExport = () => {
    try {
      const blob = new Blob(
        [JSON.stringify({ period: selectedPeriod, reports }, null, 2)],
        { type: 'application/json;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
      a.download = `staff-report-${selectedPeriod}-${ts}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  // dùng denominator an toàn theo từng dòng để không bị NaN
  const barWidthPct = (item) => {
    const denom = Math.max(Number(item.deliveries || 0), 1);
    return `${Math.min(100, Math.round((Number(item.completed || 0) * 100) / denom))}%`;
  };

  return (
    <StaffLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo cáo hoạt động</h1>
              <p className="text-gray-600">Tổng quan về hiệu suất giao hàng và dịch vụ</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
              </select>
              <button onClick={handleExport} className="btn-secondary">
                <Download size={16} className="mr-2" />
                Xuất báo cáo
              </button>
            </div>
          </div>
          {loading && <div className="text-sm text-gray-500 mt-3">Đang tải báo cáo…</div>}
          {!!error && <div className="text-sm text-red-600 mt-3">{error}</div>}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giao hàng</p>
                <p className="text-2xl font-bold text-gray-900">{reports.deliveries?.total ?? 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {getTrendIcon(reports.deliveries?.trend)}
              <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.deliveries?.trend)}`}>
                {reports.deliveries?.change ?? 0}%
              </span>
              <span className="ml-2 text-sm text-gray-500">so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đơn hàng đã xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{reports.orders?.processed ?? 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {getTrendIcon(reports.orders?.trend)}
              <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.orders?.trend)}`}>
                {reports.orders?.change ?? 0}%
              </span>
              <span className="ml-2 text-sm text-gray-500">so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Khách hàng hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{reports.customers?.active ?? 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {getTrendIcon(reports.customers?.trend)}
              <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.customers?.trend)}`}>
                {reports.customers?.change ?? 0}%
              </span>
              <span className="ml-2 text-sm text-gray-500">so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ lệ giao đúng giờ</p>
                <p className="text-2xl font-bold text-gray-900">{reports.performance?.onTimeDelivery ?? '—'}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {getTrendIcon(reports.performance?.trend)}
              <span className={`ml-2 text-sm font-medium ${getTrendColor(reports.performance?.trend)}`}>
                {reports.performance?.change ?? 0}%
              </span>
              <span className="ml-2 text-sm text-gray-500">so với kỳ trước</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Deliveries Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Giao hàng theo ngày</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {reports.dailyDeliveries?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.day}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: barWidthPct(item) }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.completed}/{item.deliveries}
                    </span>
                  </div>
                </div>
              ))}
              {!loading && (!reports.dailyDeliveries || reports.dailyDeliveries.length === 0) && (
                <div className="text-sm text-gray-500">Không có dữ liệu theo ngày.</div>
              )}
            </div>
          </div>

          {/* Delivery Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Trạng thái giao hàng</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {reports.deliveryStatus?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                    <span className="text-sm text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
              {!loading && (!reports.deliveryStatus || reports.deliveryStatus.length === 0) && (
                <div className="text-sm text-gray-500">Không có dữ liệu trạng thái.</div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thời gian giao trung bình</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{reports.performance?.avgDeliveryTime ?? '—'}</div>
            <p className="text-sm text-gray-500 mt-2">Thời gian từ khi nhận đơn đến khi giao xong</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Đánh giá khách hàng</h3>
              <CheckCircle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-green-600">{reports.performance?.satisfactionRate ?? '—'}</div>
            <p className="text-sm text-gray-500 mt-2">Điểm đánh giá trung bình từ khách hàng</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Khách hàng mới</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{reports.customers?.new ?? 0}</div>
            <p className="text-sm text-gray-500 mt-2">Số khách hàng mới trong kỳ</p>
          </div>
        </div>

        {/* Top Drivers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tài xế xuất sắc nhất</h3>
            <Truck className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tài xế
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số đơn giao
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giao đúng giờ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.topDrivers?.map((driver, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.deliveries}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">{driver.onTime}</div>
                    </td>
                  </tr>
                ))}
                {!loading && (!reports.topDrivers || reports.topDrivers.length === 0) && (
                  <tr><td className="px-6 py-4 text-sm text-gray-500" colSpan={4}>Không có dữ liệu tài xế.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffReports;
