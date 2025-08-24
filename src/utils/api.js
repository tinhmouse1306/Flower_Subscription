import axios from 'axios';
import { getToken, logout } from './auth';

// Tạo axios instance với base URL
const api = axios.create({
    baseURL: 'https://flower-subscription-for-student-be.onrender.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - tự động thêm token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 - Unauthorized
        if (error.response?.status === 401) {
            logout();
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

    // Google Login
    googleLogin: (data) => api.post('/auth/googleLogin', data),

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
};

export const subscriptionAPI = {
    // Get packages
    getPackages: () => api.get('/api/packages'),

    // Get package detail
    getPackageDetail: (id) => api.get(`/api/packages/${id}`),

    // Get flowers
    getFlowers: () => api.get('/api/flowers'),

    // Create subscription
    createSubscription: (data) => api.post('/api/subscriptions', data),

    // Get user subscriptions
    getUserSubscriptions: () => api.get('/api/subscriptions/user'),
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

    // Flower management
    getFlowers: () => api.get('/api/admin/flowers'),
    createFlower: (data) => api.post('/api/admin/flowers', data),
    updateFlower: (id, data) => api.put(`/api/admin/flowers/${id}`, data),
    deleteFlower: (id) => api.delete(`/api/admin/flowers/${id}`),
    updateFlowerStock: (id, stock) => api.patch(`/api/admin/flowers/${id}/stock`, { stock }),

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
