import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFail } from '../redux/authSlice';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [localError, setLocalError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                dispatch(loginSuccess(response.data));
                navigate('/');
            }
        } catch (error) {
            console.warn("Backend Login Failed", error);
            // Mock logic fallback for Demo
            if (error.code === 'ERR_NETWORK') {
                if (formData.email === 'buyer@test.com' && formData.password === 'password123') {
                    const mockBuyer = { _id: 'b1', name: 'Test Buyer', email: 'buyer@test.com', roles: ['buyer'], token: 'mock-token-buyer' };
                    localStorage.setItem('user', JSON.stringify(mockBuyer));
                    dispatch(loginSuccess(mockBuyer));
                    navigate('/');
                    return;
                } else if (formData.email === 'vendor@test.com' && formData.password === 'password123') {
                    const mockVendor = { _id: 'v1', name: 'Test Vendor', email: 'vendor@test.com', roles: ['buyer', 'vendor'], storeProfile: { storeName: 'Test Vendor Store' }, token: 'mock-token-vendor' };
                    localStorage.setItem('user', JSON.stringify(mockVendor));
                    dispatch(loginSuccess(mockVendor));
                    navigate('/');
                    return;
                }
                setLocalError('Network error connecting to backend. Use buyer@test.com / password123 for local demo.');
                return;
            }

            const msg = error.response?.data?.message || error.message;
            dispatch(loginFail(msg));
        }
    };

    return (
        <div className="bg-black min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[#1c1c1e] p-10 rounded-[32px] shadow-2xl border border-[#2c2c2e]/50">
                <div>
                    <h2 className="mt-2 text-center text-4xl font-bold text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-4 text-center text-sm text-gray-400">
                        Sign in to access your account
                    </p>
                </div>

                {(isError || localError) && (
                    <div className="bg-[#ff453a]/10 border border-[#ff453a]/30 rounded-2xl p-4 mb-4 text-center">
                        <p className="text-sm text-[#ff453a] font-medium">{localError || message}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-400 block mb-2 px-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-[#2c2c2e] border border-transparent placeholder-gray-500 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:bg-[#38383a] sm:text-base outline-none transition-colors"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400 block mb-2 px-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-[#2c2c2e] border border-transparent placeholder-gray-500 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:bg-[#38383a] sm:text-base outline-none transition-colors"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-[#0a84ff] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1c1c1e] focus:ring-[#0a84ff] transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-[#0a84ff] hover:text-blue-400 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
