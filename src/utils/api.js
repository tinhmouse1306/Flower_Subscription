import axios from 'axios';
import { getToken, logout } from './auth';

// Tạo axios instance với base URL
const api = axios.create({
    baseURL: 'https://flower-subscription-for-student-be.onrender.com',
    timeout: 30000, // Tăng timeout lên 30 giây
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - tự động thêm token
api.interceptors.request.use(
    (config) => {
        // Bỏ qua gắn token nếu request đánh dấu skipAuth
        if (config && config.skipAuth) {
            console.log('🔍 Request with skipAuth:', config.url);
            return config;
        }

        const token = getToken();
        console.log('🔍 Request to:', config.url);
        console.log('🔍 Token exists:', !!token);
        console.log('🔍 Token preview:', token ? token.substring(0, 50) + '...' : 'null');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔍 Authorization header set');
        } else {
            console.log('🔍 No token found');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý lỗi
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response success:', response.config?.url, response.status);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error.config?.url, error.response?.status, error.response?.data);

        // Xử lý lỗi 401 - Unauthorized (trừ khi request đánh dấu skipAuth)
        if (error.response?.status === 401 && !error.config?.skipAuth) {
            // Check if user is Google user - don't logout for Google users
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            if (!userData.isGoogleUser) {
                console.log('🔍 Regular user 401 error, logging out');
                logout();
            } else {
                // Log error for Google users but don't logout
                console.warn('Google user API error (401):', error.config?.url);
            }
        }

        // Xử lý lỗi network
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        }

        return Promise.reject(error);
    }
);

// API functions
export const authAPI = {
    // Login with username/password
    login: (credentials) => api.post(`/auth/login?userName=${credentials.userName}&password=${credentials.password}`),

    // Register
    register: (userData, role = 'user') =>
        api.post(`/api/register?userRoleChoice=${role}`, userData),

    // Google Login (không gửi Bearer token)
    googleLogin: (data) => api.post('/auth/googleLogin', data, { skipAuth: true }),

    // Verify Token
    verifyToken: (token) => api.post('/auth/verifyToken', { token }),
};

export const userAPI = {
    // Get user profile
    getProfile: () => api.get('/api/user/profile'),

    // Update profile
    updateProfile: (data) => api.put('/api/user/profile', data),

    // Change password
    changePassword: (data) => api.post('/api/user/change-password', data),

    // Check old password
    checkPassword: (data) => api.post('/auth/user/checkPass', data),

    // Reset password with OTP
    resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', null, {
        params: { email, otp, newPassword }
    }),

    // Get user dashboard info
    getDashboard: (userId) => api.get(`/api/dashBoard/${userId}`),

    // Get my info
    getMyInfo: () => api.get('/api/myInfo'),

    // Get all users (admin only)
    getUsers: () => api.get('/api/getUsers'),

    // Get user by ID (admin only)
    getUser: (userId) => api.get(`/api/${userId}`),

    // Update user (admin only)
    updateUser: (userId, data) => api.put(`/api/updateUser/${userId}`, data),

    // Delete user (admin only)
    deleteUser: (userId) => api.delete(`/api/deleteUser/${userId}`),

    // Set user role (admin only)
    setUserRole: (userId, role) => api.put(`/api/setRole/${userId}?role=${role}`),
};

export const subscriptionAPI = {
    // Get packages (public API - no auth required)
    getPackages: () => api.get('/api/packages', { skipAuth: true }),

    // Get package detail (public API - no auth required)
    getPackageDetail: (id) => api.get(`/api/packages/${id}`, { skipAuth: true }),

    // Get flowers (requires authentication)
    getFlowers: () => api.get('/api/flowers'),

    // Get bouquets (public for Google users, authenticated for regular users)
    getBouquets: () => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const isGoogleUser = userData.isGoogleUser || false;

        if (isGoogleUser) {
            // Google users: use public flowers endpoint as temporary workaround
            console.log('🔍 Google user detected, using public flowers endpoint');
            return api.get('/api/flowers', { skipAuth: true });
        } else {
            // Regular users: use JWT token for bouquets
            console.log('🔍 Regular user detected, using authenticated bouquets endpoint');
            return api.get('/api/admin/bouquets');
        }
    },

    // Create subscription
    createSubscription: (data) => api.post('/api/subscriptions', data),

    // Get all subscriptions (admin only)
    getAllSubscriptions: () => api.get('/api/subscriptions'),

    // Get subscription by ID
    getSubscriptionById: (id) => api.get(`/api/subscriptions/${id}`),

    // Get subscription detail (alias for getSubscriptionById)
    getSubscriptionDetail: (id) => api.get(`/api/subscriptions/${id}`),

    // Update subscription status
    updateSubscriptionStatus: (id, status) => api.put(`/api/subscriptions/${id}/status?status=${status}`),
};

// Admin API
export const adminAPI = {
    // Dashboard stats
    getDashboardStats: () => api.get('/api/admin/dashboard/stats'),

    // Revenue analytics
    getRevenueAnalytics: (period = 'month') => api.get(`/api/admin/analytics/revenue?period=${period}`),

    // Export reports
    exportReport: (type, dateRange) => api.post('/api/admin/reports/export', { type, dateRange }),

    // Package management
    createPackage: (data) => api.post('/api/admin/packages', data),
    getPackageDetail: (id) => api.get(`/api/admin/packages/${id}`),
    updatePackage: (id, data) => api.put(`/api/admin/packages/${id}`, data),
    deletePackage: (id) => api.delete(`/api/admin/packages/${id}`),
    updatePackageStatus: (id, status) => api.patch(`/api/admin/packages/${id}/status`, { status }),

    // Flower management - requires authentication
    getFlowers: () => api.get('/api/flowers'),
    getFlowerDetail: (flowerId) => api.get(`/api/admin/flowers/${flowerId}`),
    createFlower: (data) => api.post('/api/admin/flowers', data),
    updateFlower: (flowerId, data) => api.put(`/api/admin/flowers/${flowerId}`, data),
    deleteFlower: (flowerId) => api.delete(`/api/admin/flowers/${flowerId}`),
    updateFlowerStock: (flowerId, stock) => api.patch(`/api/admin/flowers/${flowerId}/stock`, { stock }),

    // Bouquet management (admin only)
    getBouquets: () => api.get('/api/admin/bouquets'),
    getBouquetDetail: (id) => api.get(`/api/admin/bouquets/${id}`),
    createBouquet: (data) => api.post('/api/admin/bouquets', data),
    updateBouquet: (id, data) => api.put(`/api/admin/bouquets/${id}`, data),
    deleteBouquet: (id) => api.delete(`/api/admin/bouquets/${id}`),

    // Order management
    getOrders: (filters = {}) => api.get('/api/admin/orders', { params: filters }),
    getOrderDetails: (id) => api.get(`/api/admin/orders/${id}`),
    updateOrderStatus: (id, status) => api.patch(`/api/admin/orders/${id}/status`, { status }),
    deleteOrder: (id) => api.delete(`/api/admin/orders/${id}`),

    // Customer management
    getCustomers: (filters = {}) => api.get('/api/admin/customers', { params: filters }),
    getCustomerDetails: (id) => api.get(`/api/admin/customers/${id}`),
    updateCustomer: (id, data) => api.put(`/api/admin/customers/${id}`, data),
    deleteCustomer: (id) => api.delete(`/api/admin/customers/${id}`),
    updateCustomerStatus: (id, status) => api.patch(`/api/admin/customers/${id}/status`, { status }),
};

// Staff API
export const staffAPI = {
    // Dashboard stats
    getDashboardStats: () => api.get('/api/staff/dashboard/stats'),

    // Order management
    getOrders: (filters = {}) => api.get('/api/staff/orders', { params: filters }),
    getOrderDetails: (id) => api.get(`/api/staff/orders/${id}`),
    updateOrderStatus: (id, status) => api.patch(`/api/staff/orders/${id}/status`, { status }),
    getTodayOrders: () => api.get('/api/staff/orders/today'),
    getDeliverySchedule: (date) => api.get(`/api/staff/delivery-schedule?date=${date}`),

    // Customer management
    getCustomers: (filters = {}) => api.get('/api/staff/customers', { params: filters }),
    getCustomerDetails: (id) => api.get(`/api/staff/customers/${id}`),
    contactCustomer: (id, method, notes) => api.post(`/api/staff/customers/${id}/contact`, { method, notes }),

    // Package information
    getPackages: () => api.get('/api/staff/packages'),
    getPackageDetails: (id) => api.get(`/api/staff/packages/${id}`),
};

export default api;

// Payment API
export const paymentAPI = {
    // Tạo thanh toán VNPAY: trả về URL để redirect
    create: (amount) => api.post('/payment/create', { amount }),
    // Xác minh thanh toán từ VNPAY callback
    verify: (params) => api.get('/payment/verify', { params })
};