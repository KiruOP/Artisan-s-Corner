import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../redux/authSlice';

const VendorLayout = ({ children, title, subtitle }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        window.location.href = '/';
    };

    const navItems = [
        { name: 'Overview', path: '/dashboard/seller', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'My Products', path: '/dashboard/products', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
        { name: 'Add Product', path: '/dashboard/products/new', icon: 'M12 4v16m8-8H4' },
        { name: 'Orders', path: '/dashboard/orders', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { name: 'Analytics', path: '/dashboard/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { name: 'Settings', path: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    ];

    return (
        <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-[#fcfcfc] border-r border-gray-100 flex flex-col pt-6 pb-6 px-4 shrink-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <img src={user?.storeProfile?.logo !== 'no-photo.jpg' && user?.storeProfile?.logo ? user.storeProfile.logo : "https://placehold.co/100"} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 leading-tight">Artisan's Corner</h2>
                        <p className="text-[11px] font-medium text-gray-400">Seller Dashboard</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#f0fbf4] text-[#4ede35]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <svg className={`w-5 h-5 ${isActive ? 'text-[#4ede35]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100/60">
                    <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full py-3 bg-[#5ee038] hover:bg-[#4dd326] text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="px-8 py-6 flex justify-between items-start sticky top-0 bg-[#f8f9fa] z-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
                        <p className="text-gray-500 mt-1 font-medium">{subtitle}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-900 bg-white shadow-sm relative transition-colors cursor-pointer">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#4ede35] rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-white shadow-sm flex items-center justify-center text-[#e35d25] font-bold cursor-pointer hover:border-gray-300 transition-colors">
                            {user?.storeProfile?.logo && user.storeProfile.logo !== 'no-photo.jpg' ? <img src={user.storeProfile.logo} className="w-full h-full object-cover" alt="" /> : <img src="https://placehold.co/100" className="w-full h-full object-cover" alt="" />}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default VendorLayout;

