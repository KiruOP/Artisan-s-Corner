import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFail } from '../redux/authSlice';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
        if (formData.password !== formData.confirmPassword) {
            dispatch(loginFail('Passwords do not match'));
            error('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('https://artisans-backend-9zxt.onrender.com/api/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                dispatch(loginSuccess(response.data));
                success("Account created successfully!");
                navigate('/');
            }
        } catch (err) {
            console.error("Backend Registration Failed", err);
            const msg = err.response?.data?.message || 'Registration failed due to network error.';
            dispatch(loginFail(msg));
            error(msg);
        }
    };

    return (
        <div className="bg-[var(--color-background-soft)] min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
                <div>
                    <div className="mx-auto w-12 h-12 bg-[#bcf0a3]/50 rounded-full flex items-center justify-center text-[var(--color-brand)] mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-gray-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Join the Artisan's Corner community
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2 px-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white sm:text-sm transition-colors"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={onChange}
                            />
                        </div>
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
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2 px-1">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white sm:text-sm transition-colors"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)] transition-all shadow-sm"
                        >
                            Sign up
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

