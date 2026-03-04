import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLayout from './VendorLayout';

const SellerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const [productsRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/products/vendor/me', config),
                    axios.get('http://localhost:5000/api/orders/vendor/me', config)
                ]);

                const fetchedProducts = productsRes.data;
                const fetchedOrders = ordersRes.data;

                setProducts(fetchedProducts);
                setOrders(fetchedOrders);

                // Calculate Stats
                const totalSales = fetchedOrders.reduce((acc, order) => {
                    // Extract exactly what the vendor sold within the global order object
                    const vendorTotal = order.orderItems.reduce((itemAcc, item) => itemAcc + (item.price * item.qty), 0);
                    return acc + vendorTotal;
                }, 0);

                setStats({
                    totalSales,
                    totalOrders: fetchedOrders.length,
                    totalProducts: fetchedProducts.length,
                });

            } catch (error) {
                console.error('Backend unavailable. Dashboard failed to load.', error);
                setErrorMsg('Unable to fetch dashboard data. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <VendorLayout title="Overview" subtitle="Here's how your shop is performing today.">
                <div className="flex justify-center items-center h-full pt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ede35]"></div>
                </div>
            </VendorLayout>
        );
    }

    return (
        <VendorLayout title="Overview" subtitle="Here's how your shop is performing today.">

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 text-sm font-medium">{errorMsg}</span>
                </div>
            )}

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-[#f0fbf4] text-[#4ede35] rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            +8%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Total Earnings</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">₹{stats.totalSales.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-[#f0fbf4] text-[#4ede35] rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            +5%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Total Orders</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats.totalOrders}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-500 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                            0%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Active Listings</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats.totalProducts}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-full h-full flex items-center justify-center relative min-h-[300px]">
                        {/* Placeholder graphic for the SVG line chart */}
                        <div className="w-full border-t border-b border-gray-100 absolute h-full border-dashed flex items-center justify-center pointer-events-none opacity-20">
                            <div className="w-full border-t border-gray-100 border-dashed absolute top-1/2"></div>
                        </div>
                        <svg viewBox="0 0 500 150" className="w-full text-[#4ede35]" fill="none" preserveAspectRatio="none">
                            <path d="M0,100 C50,150 150,50 250,70 C350,90 400,20 500,40" stroke="currentColor" strokeWidth="3" fill="none" />
                            <circle cx="250" cy="70" r="4" fill="white" stroke="currentColor" strokeWidth="2" />
                            <circle cx="400" cy="28" r="4" fill="white" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <p className="absolute text-gray-400 font-bold text-sm tracking-widest uppercase">Analytics Coming Soon</p>
                    </div>
                </div>

                {/* Right Column: Top Products + Promo */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Top Products</h3>
                            <Link to="/dashboard/products" className="text-sm font-bold text-[#4ede35] hover:text-[#3fb826] transition-colors">View All</Link>
                        </div>
                        <div className="space-y-5">
                            {products.length === 0 && <p className="text-sm text-gray-400 font-medium">No sales yet.</p>}
                            {products.slice(0, 3).map((p, i) => (
                                <div key={p._id} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                        <img src={p.images?.[0] || 'https://placehold.co/100'} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#4ede35] transition-colors cursor-pointer">{p.title}</h4>
                                        <p className="text-xs font-semibold text-gray-400 truncate">{p.category}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-black text-gray-900">₹{p.price}</p>
                                        <p className="text-xs font-bold text-[#4ede35]">{p.stock} units</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#f0fbf4] rounded-[2rem] p-6 border border-[#dcfce7] flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4ede35] shadow-sm mb-4">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </div>
                        <h4 className="text-base font-extrabold text-gray-900 mb-2">Boost Your Sales</h4>
                        <p className="text-sm font-medium text-gray-600 mb-5">Promote your listings to reach more buyers this weekend.</p>
                        <button className="w-full py-3 bg-[#4ede35] hover:bg-[#3fb826] transition-colors rounded-xl text-white font-bold text-sm shadow-sm">
                            Create Promotion
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Recent Orders</h3>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input type="text" placeholder="Search orders..." className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ede35] focus:border-transparent font-medium" />
                            <svg className="w-4 h-4 text-gray-400 absolute left-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filter
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest pl-8">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => {
                                    // Calculate vendor slice of order
                                    const vendorTotal = order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4 pl-8 whitespace-nowrap text-sm font-bold text-[#4ede35]">#{order._id.substring(0, 8).toUpperCase()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{order?.user?.name || 'Guest User'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">₹{vendorTotal.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.isPaid ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fbf4] border border-[#dcfce7] text-[#2ecc71] text-xs font-bold">
                                                        Paid/Processing
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-500 text-xs font-bold">
                                                        Pending Payment
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 font-medium text-center">No orders yet. Keep promoting your products!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </VendorLayout>
    );
};

export default SellerDashboard;
