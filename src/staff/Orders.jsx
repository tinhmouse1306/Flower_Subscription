import { useState, useEffect, useMemo } from 'react';
import StaffLayout from './StaffLayout';
import { staffAPI } from '../utils/api';
import {
  Search,
  Filter,
  Eye,
  Phone,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';

const mapStatus = (s) => {
  const v = String(s || '').toLowerCase();
  if (['pending', 'awaiting'].includes(v)) return 'pending';
  if (['confirmed'].includes(v)) return 'confirmed';
  if (['processing', 'preparing'].includes(v)) return 'processing';
  if (['shipping', 'shipped', 'out_for_delivery'].includes(v)) return 'shipping';
  if (['delivered', 'completed', 'done'].includes(v)) return 'delivered';
  if (['cancelled', 'canceled'].includes(v)) return 'cancelled';
  return v || 'pending';
};

const toDate10 = (x) => {
  if (!x) return '';
  try {
    const d = new Date(x);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
  } catch {}
  const s = String(x);
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s;
};

const normalizeOrder = (o) => ({
  id: o?.id ?? o?.orderId ?? o?.code ?? '-',
  customer: o?.customer?.name ?? o?.customerName ?? '—',
  package: o?.packageName ?? o?.subscription?.name ?? '—',
  amount: Number(o?.amount ?? o?.totalAmount ?? o?.price ?? 0),
  status: mapStatus(o?.status),
  date: toDate10(o?.date ?? o?.createdAt),
  phone: o?.customer?.phone ?? o?.phone ?? '—',
  address: o?.shippingAddress?.fullAddress ?? o?.shippingAddress ?? o?.address ?? '—',
  deliveryDate: toDate10(o?.deliveryDate ?? o?.scheduledDate),
  notes: o?.notes ?? ''
});

const StaffOrders = () => {
  const [rawOrders, setRawOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await staffAPI.getOrders(filters);
      const raw = res?.data?.items ?? res?.data ?? [];
      const list = Array.isArray(raw) ? raw.map(normalizeOrder) : [];
      setRawOrders(list);
    } catch (e) {
      console.error('Failed to load orders', e);
      setError('Không tải được danh sách đơn hàng.');
      setRawOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rawOrders;
    return rawOrders.filter(o =>
      [o.id, o.customer, o.package, o.phone, o.address]
        .some(x => String(x || '').toLowerCase().includes(q))
    );
  }, [query, rawOrders]);

  const handleStatusChange = (id, newStatus) => {
    // cập nhật local ngay để UI phản hồi nhanh
    setRawOrders(prev => prev.map(o => (o.id === id ? { ...o, status: mapStatus(newStatus) } : o)));
  };

  const handleUpdateClick = async (order) => {
    try {
      setLoading(true);
      await staffAPI.updateOrderStatus(order.id, order.status);
      await fetchOrders(); // reload để đồng bộ với server
    } catch (e) {
      console.error('Update status failed', e);
      setError('Cập nhật trạng thái thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipping': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <StaffLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Cập nhật trạng thái và theo dõi đơn hàng</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm đơn hàng..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                />
              </div>
              <button onClick={() => fetchOrders(query ? { q: query.trim() } : {})} className="btn-secondary">
                <Filter size={16} className="mr-2" />
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && <div className="text-sm text-gray-500 mb-4">Đang tải đơn hàng…</div>}
        {!!error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {/* Orders List */}
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Đơn hàng #{order.id}
                  </h4>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Khách hàng</p>
                  <p className="text-sm text-gray-900">{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                  <p className="text-sm text-gray-900">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Gói dịch vụ</p>
                  <p className="text-sm text-gray-900">{order.package}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Số tiền</p>
                  <p className="text-sm text-gray-900">{Number(order.amount || 0).toLocaleString()}đ</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</p>
                <p className="text-sm text-gray-900">{order.address}</p>
              </div>

              {order.notes && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú</p>
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Ngày giao: {order.deliveryDate}
                    </span>
                  </div>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Phone size={16} />
                    <span className="text-sm">Gọi</span>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <button
                    onClick={() => handleUpdateClick(order)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="text-sm text-gray-500">Không có đơn hàng phù hợp.</div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Tổng đơn hàng</div>
            <div className="text-2xl font-bold text-gray-900">{filtered.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Chờ xác nhận</div>
            <div className="text-2xl font-bold text-yellow-600">
              {filtered.filter(order => order.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Đang giao</div>
            <div className="text-2xl font-bold text-orange-600">
              {filtered.filter(order => order.status === 'shipping').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Đã giao</div>
            <div className="text-2xl font-bold text-green-600">
              {filtered.filter(order => order.status === 'delivered').length}
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffOrders;
