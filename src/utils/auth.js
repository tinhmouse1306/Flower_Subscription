// Authentication utility functions

export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const user = localStorage.getItem('userData') || localStorage.getItem('user');
    console.log('Auth check - Token:', token ? 'exists' : 'missing');
    console.log('Auth check - User:', user ? 'exists' : 'missing');
    console.log('Auth check - Result:', !!(token && user));
    return token && user;
};

export const getToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    const token = localStorage.getItem('token');

    console.log('🔍 getToken() - accessToken exists:', !!accessToken);
    console.log('🔍 getToken() - token exists:', !!token);
    console.log('🔍 getToken() - accessToken preview:', accessToken ? accessToken.substring(0, 50) + '...' : 'null');
    console.log('🔍 getToken() - token preview:', token ? token.substring(0, 50) + '...' : 'null');

    return accessToken || token;
};

export const getUser = () => {
    const user = localStorage.getItem('userData') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getUserId = () => {
    const user = getUser();
    // Hỗ trợ cả regular users (userId/id) và Google users (uid)
    return user?.userId || user?.id || user?.uid || null;
};

export const logout = () => {
    // Clear all possible auth keys
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');
    window.location.href = '/login';
};

export const setAuthData = (token, userData) => {
    console.log('=== setAuthData called ===');
    console.log('Setting auth data - Token:', token ? 'exists' : 'missing');
    console.log('Setting auth data - UserData:', userData);
    console.log('Token value:', token);
    console.log('UserData value:', userData);

    if (!token) {
        console.error('❌ ERROR: Token is null/undefined/empty!');
        return;
    }

    if (!userData) {
        console.error('❌ ERROR: UserData is null/undefined/empty!');
        return;
    }

    try {
        // Save in new format (compatible with existing localStorage)
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));

        // Also save in old format for backward compatibility
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('✅ Auth data saved to localStorage successfully');

        // Immediate verification
        console.log('=== Immediate Verification ===');
        console.log('accessToken:', localStorage.getItem('accessToken'));
        console.log('userData:', localStorage.getItem('userData'));
        console.log('token:', localStorage.getItem('token'));
        console.log('user:', localStorage.getItem('user'));

        // Test isAuthenticated immediately
        const authenticated = isAuthenticated();
        console.log('isAuthenticated():', authenticated);

        // Wait a bit then verify again
        setTimeout(() => {
            console.log('=== Delayed Verification ===');
            console.log('accessToken:', localStorage.getItem('accessToken'));
            console.log('userData:', localStorage.getItem('userData'));
            console.log('token:', localStorage.getItem('token'));
            console.log('user:', localStorage.getItem('user'));

            const authenticated = isAuthenticated();
            console.log('isAuthenticated():', authenticated);
        }, 100);

    } catch (error) {
        console.error('❌ Error saving auth data to localStorage:', error);
        console.error('Error details:', error.message);
    }
};



// API call with authentication
export const apiCall = async (url, options = {}) => {
    const token = getToken();

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        // Handle 401 Unauthorized
        if (response.status === 401) {
            logout();
            return null;
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};
