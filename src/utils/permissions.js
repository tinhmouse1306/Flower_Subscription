import { getToken } from './auth';

// Decode JWT token để lấy thông tin user
export const decodeToken = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const payload = parts[1];
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));

        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

// Lấy thông tin user từ token
export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded) return null;

    return {
        id: decoded.sub,
        scope: decoded.scope,
        role: decoded.scope, // scope chính là role
        issuedAt: decoded.iat,
        expiresAt: decoded.exp
    };
};

// Kiểm tra user có role cụ thể không
export const hasRole = (requiredRole) => {
    const user = getUserFromToken();
    if (!user) return false;

    return user.role === requiredRole;
};

// Kiểm tra user có một trong các role được yêu cầu
export const hasAnyRole = (requiredRoles) => {
    const user = getUserFromToken();
    if (!user) return false;

    return requiredRoles.includes(user.role);
};

// Kiểm tra user có tất cả role được yêu cầu
export const hasAllRoles = (requiredRoles) => {
    const user = getUserFromToken();
    if (!user) return false;

    return requiredRoles.every(role => user.role === role);
};

// Kiểm tra user có quyền admin
export const isAdmin = () => {
    return hasRole('ADMIN');
};

// Kiểm tra user có quyền staff
export const isStaff = () => {
    return hasRole('STAFF');
};

// Kiểm tra user có quyền user thường
export const isUser = () => {
    return hasRole('USER');
};

// Lấy role hiện tại của user
export const getCurrentRole = () => {
    const user = getUserFromToken();
    return user ? user.role : null;
};

// Kiểm tra token có hết hạn chưa
export const isTokenExpired = () => {
    const user = getUserFromToken();
    if (!user) return true;

    return user.expiresAt * 1000 < Date.now();
};

// Lấy thời gian còn lại của token (tính bằng giây)
export const getTokenTimeRemaining = () => {
    const user = getUserFromToken();
    if (!user) return 0;

    const remaining = user.expiresAt * 1000 - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
};

// Format thời gian còn lại thành string dễ đọc
export const formatTokenTimeRemaining = () => {
    const seconds = getTokenTimeRemaining();
    if (seconds === 0) return 'Hết hạn';

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
};
