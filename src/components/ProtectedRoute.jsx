import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getToken } from '../utils/auth';


const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            console.log('ProtectedRoute: Checking authentication...');
            const authenticated = isAuthenticated();
            const token = getToken();
            // Lấy role từ localStorage
            let currentRole = null;
            try {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    currentRole = parsed.role;
                }
            } catch (error) {
                console.error('ProtectedRoute: Error parsing userData:', error);
            }

            console.log('ProtectedRoute: Authenticated:', authenticated);
            console.log('ProtectedRoute: Token:', token ? 'Present' : 'Missing');
            console.log('ProtectedRoute: Role:', currentRole);

            // Check if user is Google user
            let isGoogleUser = false;
            try {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    isGoogleUser = parsed.isGoogleUser || false;
                }
            } catch (error) {
                console.error('ProtectedRoute: Error parsing userData:', error);
            }

            console.log('ProtectedRoute: Is Google User:', isGoogleUser);

            // For Google users, only check authenticated status, not token
            if (!authenticated) {
                console.log('ProtectedRoute: Not authenticated, clearing storage and redirecting to login');
                localStorage.clear();
                navigate('/login');
                return;
            }

            // For non-Google users, check token
            if (!isGoogleUser && !token) {
                console.log('ProtectedRoute: No token for non-Google user, clearing storage and redirecting to login');
                localStorage.clear();
                navigate('/login');
                return;
            }

            // Kiểm tra role
            if (!currentRole) {
                console.log('ProtectedRoute: No role found, clearing storage and redirecting to login');
                localStorage.clear();
                navigate('/login');
                return;
            }

            // Log role để debug
            console.log('ProtectedRoute: Current role:', currentRole);
            console.log('ProtectedRoute: Current path:', window.location.pathname);

            // Kiểm tra xem user có đúng role cho route này không
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin') && currentRole !== 'ADMIN' && currentRole !== 'admin') {
                console.log('ProtectedRoute: User not admin, redirecting to login');
                localStorage.clear();
                navigate('/login');
                return;
            }
            if (currentPath.startsWith('/staff') && currentRole !== 'STAFF' && currentRole !== 'staff') {
                console.log('ProtectedRoute: User not staff, redirecting to login');
                localStorage.clear();
                navigate('/login');
                return;
            }

            console.log('ProtectedRoute: Valid auth, allowing access');
            setIsLoading(false);
        };

        // Increased delay to ensure localStorage is fully updated and avoid race conditions
        setTimeout(checkAuth, 200);
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
