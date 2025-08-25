import { useState, useEffect, useMemo } from 'react';
import StaffLayout from './StaffLayout';
import { staffAPI } from '../utils/api';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  MessageCircle
} from 'lucide-react';

const normalizeCustomer = (c) => ({
  id: c?.id ?? c?.customerId ?? '-',
  name: c?.name ?? c?.fullName ?? '—',
  email: c?.email ?? '—',
  phone: c?.phone ?? '—',
  address: c?.address?.fullAddress ?? c?.address ?? '—',
  joinDate: (c?.joinDate || c?.createdAt || '').toString().slice(0, 10),
  totalOrders: c?.totalOrders ?? c?.ordersCount ?? 0,
  totalSpent: Number(c?.totalSpent ?? c?.lifetimeValue ?? 0),
  status: (c?.status ?? 'active').toLowerCase(),
  lastOrder: (c?.lastOrderDate || '').toString().slice(0, 10),
  subscriptionType: c?.subscriptionType ?? c?.tier ?? '—',
  deliveryPreferences: c?.deliveryPreferences ?? '—',
  notes: c?.notes ?? ''
});

const StaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [raw, setRaw] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');


  const fetchCustomers = async (filters = {}) => {
    setLoading(true);
    setErr('');
    try {
      const res = await staffAPI.getCustomers(filters);
      const data = res?.data?.items ?? res?.data ?? [];
      const list = Array.isArray(data) ? data.map(normalizeCustomer) : [];
      setRaw(list);
    } catch (e) {
      console.error('getCustomers failed', e);
      setErr('Không tải được danh sách khách hàng.');
      setRaw([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

 
  const customersFiltered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return raw;
    return raw.filter(c =>
      [c.id, c.name, c.email, c.phone, c.address]
        .some(v => String(v || '').toLowerCase().includes(s))
    );
  }, [q, raw]);


  const handleViewDetails = async (id) => {
    try {
      const res = await staffAPI.getCustomerDetails(id);
      const detail = res?.data;
 
      alert(`Chi tiết khách hàng #${id}:\n` + JSON.stringify(detail, null, 2));
    } catch (e) {
      console.error('getCustomerDetails failed', e);
      alert('Không tải được chi tiết khách hàng.');
    }
  };

  // 3) Liên hệ KH (call / sms / email)
  const handleContact = async (id) => {
    const method = prompt('Nhập phương thức liên hệ (call/sms/email):', 'call') || 'call';
    const notes = prompt('Ghi chú cho lần liên hệ này:', '') || '';
    try {
      await staffAPI.contactCustomer(id, method, notes);
      alert('Đã ghi nhận liên hệ khách hàng.');
    } catch (e) {
      console.error('contactCustomer failed', e);
      alert('Không liên hệ được khách hàng.');
    }
  };


  const handleStatusChange = (id, newStatus) => {
    setCustomers(prev => prev.map(customer =>
      customer.id === id ? { ...customer, status: newStatus } : customer
    ));
    setRaw(prev => prev.map(customer =>
      customer.id === id ? { ...customer, status: newStatus } : customer
    ));
    console.log(`Customer ${id} status changed to: ${newStatus} (local only)`);
  };


  useEffect(() => {
    setCustomers(customersFiltered);
  }, [customersFiltered]);

  return (
    <StaffLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600">Xem thông tin và hỗ trợ khách hàng</p>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="text"
                  placeholder="Tìm khách hàng..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                />
              </div>
              <button
                onClick={() => fetchCustomers(q ? { q: q.trim() } : {})}
                className="btn-secondary"
              >
                <Filter size={16} className="mr-2" />
                Lọc
              </button>
            </div>
          </div>
          {loading && <div className="text-sm text-gray-500 mt-3">Đang tải khách hàng…</div>}
          {!!err && <div className="text-sm text-red-600 mt-3">{err}</div>}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">ID: #{customer.id}</p>
                  </div>
                </div>
                <select
                  value={customer.status}
                  onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                  className={`text-sm border-gray-300 rounded-md px-2 py-1 ${
                    customer.status === 'active'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <div className="flex items-center mt-1">
                      <Mail className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{customer.email}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                    <div className="flex items-center mt-1">
                      <Phone className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                  <div className="flex items-start mt-1">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{customer.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngày tham gia</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{customer.joinDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gói dịch vụ</p>
                    <span className="text-sm font-medium text-blue-600">{customer.subscriptionType}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                    <span className="text-lg font-bold text-gray-900">{customer.totalOrders}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tổng chi tiêu</p>
                    <span className="text-lg font-bold text-green-600">
                      {Number(customer.totalSpent || 0).toLocaleString()}đ
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Thời gian giao hàng ưa thích</p>
                  <span className="text-sm text-gray-900">{customer.deliveryPreferences}</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                  <span className="text-sm text-gray-600">{customer.notes}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Đơn hàng cuối: {customer.lastOrder || '—'}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(customer.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    >
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleContact(customer.id)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Tổng khách hàng</div>
            <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Khách hàng hoạt động</div>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Khách VIP</div>
            <div className="text-2xl font-bold text-purple-600">
              {customers.filter(c => ['VIP', 'Siêu VIP'].includes(c.subscriptionType)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
            <div className="text-2xl font-bold text-blue-600">
              {customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0).toLocaleString()}đ
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffCustomers;
