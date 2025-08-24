import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setAuthData, logout } from '../utils/auth';
import { authAPI } from '../utils/api';

const TokenVerifier = ({ children }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = getToken();

                if (!token) {
                    console.log('No token found - not redirecting');
                    setIsVerifying(false);
                    return;
                }

                console.log('Verifying token...');
                const response = await authAPI.verifyToken(token);
                const data = response.data;

                if (data.code === 1010 && data.result.valid) {
                    console.log('Token is valid:', data.result);
                    setIsAuthenticated(true);

                    // Update auth data with user info from token
                    setAuthData(token, {
                        email: data.result.email,
                        name: data.result.name,
                        role: data.result.role,
                        authenticated: true
                    });
                } else {
                    console.log('Token is invalid');
                    logout();
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                logout();
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, []);

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang kiểm tra phiên đăng nhập...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default TokenVerifier;
