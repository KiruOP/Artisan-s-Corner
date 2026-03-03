import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFail } from '../redux/authSlice';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { success, error } = useToast();
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
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                dispatch(loginSuccess(response.data));
                success("Welcome back!");
                navigate('/');
            }
        } catch (err) {
            console.error("Backend Login Failed", err);
            const msg = err.response?.data?.message || 'Login failed';
            dispatch(loginFail(msg));
            error(msg);
        }
    };

    return (
        <div className="bg-[var(--color-background-soft)] min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
                <div>
                    <div className="mx-auto w-12 h-12 bg-[#bcf0a3]/50 rounded-full flex items-center justify-center text-[var(--color-brand)] mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Sign in to access your artisan account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2 px-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white sm:text-sm transition-colors"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2 px-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white sm:text-sm transition-colors"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)] transition-all shadow-sm"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors">
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
