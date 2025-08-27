import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { getRedirectResult } from 'firebase/auth';
import { authAPI } from '../utils/api';
import { setAuthData } from '../utils/auth';
import Swal from 'sweetalert2';

const GoogleAuthHandler = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const handleRedirectResult = async () => {
            console.log('GoogleAuthHandler: Starting redirect result handling...');
            try {
                // auth is already imported from unified firebase config
                if (!auth) {
                    console.log('Firebase auth not available');
                    setIsLoading(false);
                    navigate('/login');
                    return;
                }

                console.log('Getting redirect result...');
                console.log('Auth object in handler:', auth);
                const result = await getRedirectResult(auth);
                console.log('Redirect result:', result);
                console.log('Result user:', result?.user);
                console.log('Result error:', result?.error);

                if (result.user) {
                    console.log('Google login successful:', result.user);

                    const idToken = await result.user.getIdToken();
                    console.log('Got ID token:', idToken);

                    console.log('Calling BE API with token...');
                    const response = await authAPI.googleLogin({ idToken });
                    console.log('BE API response:', response);
                    const data = response.data;
                    console.log('BE API data:', data);

                    if (data.code === 1010) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Đăng nhập Google thành công!',
                            text: `Chào mừng ${data.result.name}!`,
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            background: '#f8fafc',
                            color: '#1f2937',
                            customClass: {
                                popup: 'rounded-lg shadow-xl',
                                title: 'text-xl font-bold text-gray-900',
                                content: 'text-gray-600'
                            }
                        });

                        setAuthData(data.result.token, {
                            email: data.result.email,
                            name: data.result.name,
                            uid: data.result.uid,
                            authenticated: true
                        });

                        navigate('/');
                    } else {
                        throw new Error(data.message || 'Server authentication failed');
                    }
                } else {
                    console.log('No redirect result found - redirecting to login');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Google auth error:', error);

                if (error.code === 'auth/popup-closed-by-user' ||
                    error.message === 'Redirect initiated') {
                    // User cancelled or redirect was initiated
                    console.log('Auth cancelled or redirect initiated');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi đăng nhập Google',
                        text: error.message || 'Có lỗi xảy ra khi đăng nhập Google',
                        confirmButtonText: 'Thử lại',
                        background: '#f8fafc',
                        color: '#1f2937',
                        customClass: {
                            popup: 'rounded-lg shadow-xl',
                            title: 'text-xl font-bold text-gray-900',
                            content: 'text-gray-600'
                        }
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        handleRedirectResult();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang xử lý đăng nhập Google...</p>
                </div>
            </div>
        );
    }

    return null;
};

export default GoogleAuthHandler;
