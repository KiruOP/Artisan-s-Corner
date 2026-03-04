import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { setCredentials } from '../../redux/authSlice';

const VendorSetup = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const [storeName, setStoreName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const res = await axios.post(
                'http://localhost:5000/api/users/become-vendor',
                { storeName, description },
                config
            );

            dispatch(setCredentials(res.data));
            success('Store created successfully! Welcome to the Artisan community.');
            navigate('/dashboard/seller');
        } catch (error) {
            toastError(error.response?.data?.message || 'Failed to create store.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Minimal Setup Navbar */}
            <header className="bg-[#fffbf7] border-b border-orange-900/5 py-4 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-[#e35d25]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11 2v4.26l-3.32-1.92-1 1.74L10 8.01v3.98l-3.46 2-1-1.73-1.73 1L7 16.5l3.5-2v-4L14 8.5V4h-3V2zM6 14.5l-2-1.16 1-1.74 3.47 2L6 14.5zM20 18l-1.73-1-3.47 2L18 20.73 20 18zM19.27 10L17.54 9l-2 3.46 1.73 1L19.27 10zM14 12.5l-3.5 2v4L14 16.5v-4zM22 14.5l-2-1.16 1-1.74 3.47 2L22 14.5z" />
                        </svg>
                        <span className="text-2xl font-bold tracking-tight text-gray-900 font-serif">
                            Artisan's Corner
                        </span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-700">
                        <span className="text-gray-900 cursor-pointer hover:text-[#e35d25] transition-colors">Dashboard</span>
                        <span className="cursor-pointer hover:text-[#e35d25] transition-colors">Resources</span>
                        <span className="cursor-pointer hover:text-[#e35d25] transition-colors">Help</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#fce7db] text-[#e35d25] flex items-center justify-center font-bold text-sm">
                            {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
                {/* Stepper */}
                <div className="mb-10 w-full max-w-sm mx-auto">
                    <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                        <span className="text-[#4ede35]">Step 1</span>
                        <span>Create Store</span>
                        <span>33%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#4ede35] w-1/3 rounded-full"></div>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3 font-serif">Create Your Artisan Store</h1>
                        <p className="text-gray-500 font-medium tracking-wide">Tell us about your craft and brand identity.</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-8">
                        {/* Logo Upload Placeholder */}
                        <div className="flex flex-col items-center mb-8">
                            <span className="text-sm font-bold text-gray-900 mb-4 block">Store Logo</span>
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#e35d25]/40 flex items-center justify-center bg-[#fce7db]/20 cursor-pointer hover:bg-[#fce7db]/40 transition-colors">
                                <svg className="w-8 h-8 text-[#9aa0a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-xs text-[#9aa0a6] mt-4 text-center">
                                Drag & drop or click to upload<br />Recommended: 400x400px JPG or PNG
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Store Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#e35d25] focus:bg-white transition-all text-gray-900"
                                    placeholder="e.g. Clay & Earth Ceramics"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">This will be your brand identity displayed to buyers across the marketplace.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Store Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e35d25] focus:bg-white transition-all text-gray-900 resize-none"
                                placeholder="Describe your craft, your materials, and what makes your creations unique..."
                                maxLength="500"
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-2 text-right">{description.length}/500 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-14 bg-[#5ee038] hover:bg-[#4dd326] text-white text-lg font-bold rounded-full shadow-sm px-8 transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Setting up...' : 'Continue to My Dashboard'}
                            {!loading && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                        </button>
                    </form>
                </div>

                <div className="mt-8 flex justify-center gap-6 text-xs text-gray-400 font-medium">
                    <span className="hover:text-gray-600 cursor-pointer">Seller Policy</span>
                    <span className="hover:text-gray-600 cursor-pointer">Fees & Payments</span>
                    <span className="hover:text-gray-600 cursor-pointer">Need Help?</span>
                </div>
            </div>
        </div>
    );
};

export default VendorSetup;
