import { useEffect, useMemo, useState } from 'react';
import StaffLayout from './StaffLayout';
import { Search, Calendar } from 'lucide-react';

// ---- helpers ----
const toDate10 = (x) => {
  if (!x) return '';
  try {
    const d = new Date(x);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
  } catch {}
  const s = String(x || '');
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s;
};
const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

// Gom subscriptions => danh sách khách hàng
const buildCustomers = (subs) => {
  const map = new Map();

  (subs || []).forEach((s) => {
    const userId = s?.userId ?? s?.user?.id;
    if (!userId) return;

    const key = String(userId);
    const price = Number(s?.price ?? 0);
    const status = String(s?.status || '').toUpperCase();
    const delivered = status === 'COMPLETED';
    const active = status === 'ACTIVE';

    const base = map.get(key) || {
      id: userId,
      name: s?.user?.fullName || s?.user?.name || (s?.userId ? `User #${s.userId}` : '—'),
      email: s?.user?.email || '',
      phone: s?.user?.phone || '',
      orders: 0,
      activeOrders: 0,
      completedOrders: 0,
      totalSpent: 0,
      lastDelivery: null,
    };

    base.orders += 1;
    if (active) base.activeOrders += 1;
    if (delivered) {
      base.completedOrders += 1;
      base.totalSpent += price;
    }

    const d = s?.deliveryDate || s?.createdAt;
    if (d) {
      const cur = base.lastDelivery ? new Date(base.lastDelivery) : null;
      if (!cur || new Date(d) > cur) base.lastDelivery = d;
    }

    map.set(key, base);
  });

  return Array.from(map.values()).map((c) => ({
    ...c,
    vip: c.completedOrders >= 3 || c.totalSpent >= 500000,
    status: c.activeOrders > 0 ? 'Đang sử dụng' : (c.completedOrders > 0 ? 'Đã hoàn tất' : 'Mới'),
  }));
};

const Customers = () => {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        let res;

        // 1) Thử wrapper chuẩn
        try {
          res = await subscriptionAPI.list({ pageSize: 500 });
        } catch (e1) {
          // 2) Fallback khi server dùng prefix khác
          const candidates = ['/api/subscriptions', '/subscriptions'];
          let lastErr = e1;
          for (const path of candidates) {
            try {
              res = await api.get(path, { params: { pageSize: 500 } });
              break;
            } catch (e) {
              lastErr = e;
            }
          }
          if (!res) throw lastErr;
        }

        const data = res?.data;
        const items = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];

        const customers = buildCustomers(items);
        if (alive) setRows(customers);
      } catch (e) {
        const status = e?.response?.status;
        console.error('getCustomers failed', e);
        if (alive) {
          setErr(
            status === 401
              ? 'Phiên đăng nhập hết hạn/thiếu quyền (401).'
              : status === 404
              ? 'API /subscriptions không tồn tại trên server hiện tại (404).'
              : 'Không tải được danh sách khách hàng.'
          );
          setRows([]);
        }
      } finally {
        alive && setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c) =>
      [c.name, c.email, c.phone, c.id].some((x) => String(x ?? '').toLowerCase().includes(q))
    );
  }, [rows, query]);

  // KPIs
  const kpiTotal = filtered.length;
  const kpiActive = filtered.filter((c) => c.activeOrders > 0).length;
  const kpiVip = filtered.filter((c) => c.vip).length;
  const kpiRevenue = sum(filtered.map((c) => c.totalSpent));

  return (
    <StaffLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600">Xem thông tin và hỗ trợ khách hàng</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full"
            />
          </div>
        </div>

        {loading && <div className="text-sm text-gray-500 mb-4">Đang tải khách hàng…</div>}
        {!!err && <div className="text-sm text-red-600 mb-4">{err}</div>}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần giao gần nhất</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.name}</div>
                    <div className="text-sm text-gray-500">ID: {c.id}</div>
                    {c.vip && (
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                        VIP
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{c.phone || '—'}</div>
                    <div className="text-sm text-gray-500">{c.email || ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Tổng: {c.orders}</div>
                    <div className="text-xs text-gray-500">
                      Đang hoạt động: {c.activeOrders} &nbsp;•&nbsp; Hoàn tất: {c.completedOrders}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {Number(c.totalSpent || 0).toLocaleString()}đ
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{toDate10(c.lastDelivery) || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        c.activeOrders > 0
                          ? 'bg-green-100 text-green-700'
                          : c.completedOrders > 0
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="p-6 text-sm text-gray-500">Không tải được danh sách khách hàng.</div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Tổng khách hàng</div>
            <div className="text-2xl font-bold text-gray-900">{kpiTotal}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Khách hàng hoạt động</div>
            <div className="text-2xl font-bold text-green-600">{kpiActive}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Khách VIP</div>
            <div className="text-2xl font-bold text-purple-600">{kpiVip}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
            <div className="text-2xl font-bold text-blue-600">
              {Number(kpiRevenue || 0).toLocaleString()}đ
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default Customers;
