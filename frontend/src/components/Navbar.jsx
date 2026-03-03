import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const location = useLocation();

    if (location.pathname === '/checkout') {
        return null; // The Checkout page provides its own minimal header
    }

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                            {/* Simple approximation of the green Artisan logo */}
                            <svg className="w-8 h-8 text-[#61c521]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fillOpacity="0" />
                                {/* Approximation path for the logo */}
                                <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l6 4.5v9H6v-9l6-4.5z" />
                                <circle cx="12" cy="14" r="3" />
                            </svg>
                            <span className="text-2xl font-bold tracking-tight text-gray-900">
                                Artisan's Corner
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Links  */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/shop" className="text-gray-600 hover:text-gray-900 font-medium">Shop</Link>
                        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Stories</Link>
                        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">About Us</Link>
                        {user?.roles?.includes('buyer') && !user?.roles?.includes('vendor') && (
                            <Link to="/dashboard/setup" className="text-gray-600 hover:text-gray-900 font-medium">Sell on Artisan</Link>
                        )}
                        {user?.roles?.includes('vendor') && (
                            <Link to="/dashboard/seller" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                        )}
                    </div>

                    {/* Right: Search & Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input type="text" placeholder="Search handmade..." className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-500" />
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative text-gray-900 hover:text-[var(--color-brand)] transition-colors">
                            {/* App-like Cart Icon */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[20px] h-[20px] text-xs font-bold text-white bg-[var(--color-brand)] rounded-full px-1.5 shadow-sm border-2 border-white">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        {/* User / Login */}
                        {user ? (
                            <div className="relative group cursor-pointer">
                                <span className="text-gray-900 font-medium hover:text-[var(--color-brand)] transition-colors">
                                    {user.name.split(' ')[0]}
                                </span>
                                <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <button
                                        onClick={onLogout}
                                        className="text-red-600 block w-full px-4 py-3 text-sm text-left hover:bg-gray-50 rounded-xl"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] transition-all shadow-sm">
                                Sign In
                            </Link>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
