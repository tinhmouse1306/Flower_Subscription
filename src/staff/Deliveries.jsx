import { useState, useEffect, useMemo } from 'react';
import StaffLayout from './StaffLayout';
import { staffAPI } from '../utils/api';
import {
  Search,
  Filter,
  Eye,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Phone
} from 'lucide-react';

const mapStatus = (s) => {
  const v = String(s || '').toLowerCase();
  if (['pending', 'awaiting', 'scheduled'].includes(v)) return 'pending';
  if (['in_progress', 'shipping', 'out_for_delivery', 'on_the_way'].includes(v)) return 'in_progress';
  if (['completed', 'delivered', 'done'].includes(v)) return 'completed';
  if (['cancelled', 'canceled'].includes(v)) return 'cancelled';
  return 'pending';
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

const normalizeDelivery = (d) => ({
  id: d?.id ?? d?.deliveryId ?? d?.orderId ?? '-',
  orderId: d?.orderCode ?? d?.orderId ?? `ORD-${d?.id ?? '—'}`,
  customerName: d?.customerName ?? d?.customer?.name ?? d?.user?.fullName ?? '—',
  customerPhone: d?.customerPhone ?? d?.customer?.phone ?? '—',
  address: d?.address?.fullAddress ?? d?.address ?? '—',
  package: d?.packageName ?? d?.subscription?.name ?? '—',
  scheduledDate: toDate10(d?.scheduledDate ?? d?.deliveryDate),
  scheduledTime: d?.scheduledTime ?? d?.timeWindow ?? '',
  status: mapStatus(d?.status),
  driver: d?.driverName ?? d?.driver ?? '—',
  driverPhone: d?.driverPhone ?? '—',
  notes: d?.notes ?? ''
});

const StaffDeliveries = () => {
  const [allDeliveries, setAllDeliveries] = useState([]);
  const [query, setQuery] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDeliveries = async (theDate) => {
    setLoading(true);
    setError('');
    try {
      const res = await staffAPI.getDeliverySchedule(theDate);
      const raw = res?.data?.items ?? res?.data ?? [];
      const list = Array.isArray(raw) ? raw.map(normalizeDelivery) : [];
      setAllDeliveries(list);
    } catch (e) {
      console.error('Failed to load delivery schedule', e);
      setError('Không tải được lịch giao hàng.');
      setAllDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  // gọi API lần đầu & mỗi khi đổi ngày
  useEffect(() => {
    fetchDeliveries(date);
  }, [date]);

  // lọc client-side theo query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allDeliveries;
    return allDeliveries.filter(d =>
      [d.orderId, d.customerName, d.address, d.package, d.driver]
        .some(x => String(x || '').toLowerCase().includes(q))
    );
  }, [query, allDeliveries]);

  // hiện chỉ update local; nếu có endpoint cập nhật trạng thái, gọi ở đây
  const handleStatusChange = async (id, newStatus) => {
    // TODO (khi có API): await staffAPI.updateDeliveryStatus(id, newStatus);
    setAllDeliveries(prev =>
      prev.map(delivery =>
        delivery.id === id ? { ...delivery, status: mapStatus(newStatus) } : delivery
      )
    );
    console.log(`Delivery ${id} status changed to: ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ giao';
      case 'in_progress': return 'Đang giao';
      case 'completed': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Truck className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <StaffLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý giao hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng đang giao</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* search */}
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

              {/* chọn ngày */}
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-3 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-48"
                />
              </div>

              <button
                onClick={() => fetchDeliveries(date)}
                className="btn-secondary"
              >
                <Filter size={16} className="mr-2" />
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && <div className="text-sm text-gray-500 mb-4">Đang tải lịch giao hàng…</div>}
        {!!error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {/* Deliveries List */}
        <div className="space-y-4">
          {filtered.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {delivery.orderId}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        <span className="ml-1">{getStatusText(delivery.status)}</span>
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                      <p className="text-sm text-gray-900">{delivery.customerName}</p>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{delivery.customerPhone}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</p>
                      <div className="flex items-start mt-1">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-500">{delivery.address}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Gói dịch vụ</p>
                      <p className="text-sm text-gray-900">{delivery.package}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày giao hàng</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{delivery.scheduledDate}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{delivery.scheduledTime}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Tài xế</p>
                      <p className="text-sm text-gray-900">{delivery.driver}</p>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{delivery.driverPhone}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                      <p className="text-xs text-gray-500 mt-1">{delivery.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:flex-shrink-0">
                  <select
                    value={delivery.status}
                    onChange={(e) => handleStatusChange(delivery.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="pending">Chờ giao</option>
                    <option value="in_progress">Đang giao</option>
                    <option value="completed">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="text-sm text-gray-500">Không có đơn giao hàng trong ngày này.</div>
          )}
        </div>

        {/* Summary Stats (theo danh sách đang hiển thị) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Tổng đơn hàng</div>
            <div className="text-2xl font-bold text-gray-900">{filtered.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Chờ giao</div>
            <div className="text-2xl font-bold text-yellow-600">
              {filtered.filter(d => d.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Đang giao</div>
            <div className="text-2xl font-bold text-blue-600">
              {filtered.filter(d => d.status === 'in_progress').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Đã giao</div>
            <div className="text-2xl font-bold text-green-600">
              {filtered.filter(d => d.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDeliveries;
