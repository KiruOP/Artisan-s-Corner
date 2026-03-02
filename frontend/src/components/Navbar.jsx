import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 top-0 left-0 bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-[#38383a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center transition-opacity hover:opacity-80">
                            <span className="text-xl font-semibold tracking-tight text-white">
                                Artisan's Corner
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <Link to="/cart" className="text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors relative flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="hidden sm:inline">Cart</span>
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-blue-500 rounded-full px-1">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <>
                                {user.roles.includes('vendor') && (
                                    <Link to="/dashboard/seller" className="text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors hidden sm:block">
                                        Dashboard
                                    </Link>
                                )}
                                <div className="relative group">
                                    <button className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors">
                                        {user.name.split(' ')[0]}
                                    </button>
                                    <div className="absolute right-0 w-48 mt-2 origin-top-right bg-[#2c2c2e] border border-[#38383a] divide-y divide-[#38383a] rounded-xl shadow-2xl outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                                        <div className="p-1">
                                            {user.roles.includes('vendor') && (
                                                <Link to="/dashboard/seller" className="text-gray-200 block sm:hidden w-full px-4 py-2 text-sm text-left hover:bg-[#38383a] rounded-lg transition-colors">
                                                    Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={onLogout}
                                                className="text-red-400 font-medium flex justify-between w-full px-4 py-2 text-sm text-left hover:bg-[#38383a] rounded-lg transition-colors"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register" className="bg-[#0a84ff] text-white hover:bg-blue-500 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
