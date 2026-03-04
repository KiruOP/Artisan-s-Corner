import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLayout from './VendorLayout';

const VendorOrders = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Using the specific vendor orders endpoint to pull the vendor's subset of sales
                const res = await axios.get('http://localhost:5000/api/orders/vendor', config);
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to fetch vendor orders', error);
                setErrorMsg('Error loading your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const pendingCount = orders.filter(o => !o.isDelivered && o.isPaid).length;
    const completedCount = orders.filter(o => o.isDelivered).length;

    const filteredOrders = orders.filter(o => {
        if (filter === 'pending') return !o.isDelivered && o.isPaid;
        if (filter === 'completed') return o.isDelivered;
        return true; // 'all'
    });

    if (loading) {
        return (
            <VendorLayout title="Orders" subtitle="Track and fulfill your recent sales.">
                <div className="flex justify-center items-center h-full pt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ede35]"></div>
                </div>
            </VendorLayout>
        );
    }

    return (
        <VendorLayout title="Orders" subtitle="Track and fulfill your recent sales.">

            <div className="max-w-7xl mx-auto pt-4">
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center">
                        <span className="text-red-700 text-sm font-medium">{errorMsg}</span>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-6 bg-white border border-gray-100 rounded-full px-2 py-1.5 shadow-sm text-sm font-semibold text-gray-500 overflow-x-auto w-full lg:w-auto">
                        <button onClick={() => setFilter('all')} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#dcfce7] text-green-800' : 'hover:bg-gray-50'}`}>
                            All Orders <span className={`${filter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'} text-[10px] px-2 py-0.5 rounded-full`}>{orders.length}</span>
                        </button>
                        <button onClick={() => setFilter('pending')} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === 'pending' ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-50'}`}>
                            Pending Fulfillment <span className={`${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'} text-[10px] px-2 py-0.5 rounded-full`}>{pendingCount}</span>
                        </button>
                        <button onClick={() => setFilter('completed')} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === 'completed' ? 'bg-[#dcfce7] text-green-800' : 'hover:bg-gray-50'}`}>
                            Completed <span className={`${filter === 'completed' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'} text-[10px] px-2 py-0.5 rounded-full`}>{completedCount}</span>
                        </button>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input type="text" placeholder="Search order ID..." className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ede35] focus:border-transparent font-medium shadow-sm" />
                            <svg className="w-4 h-4 text-gray-400 absolute left-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest pl-8">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Items</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => {
                                    // Calculate vendor's portion of this order's total since an order might contain mixed vendor products
                                    // Our backend getVendorOrders already filters the products returned to only matching ones.
                                    const vendorTotal = order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4 pl-8 text-sm font-bold text-[#4ede35]">#{order._id.substring(0, 8).toUpperCase()}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{order?.user?.name || 'Guest User'} <br /><span className="text-xs font-medium text-gray-400">{order?.user?.email}</span></td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-700">{order.orderItems.length} items</td>
                                            <td className="px-6 py-4 text-sm font-black text-gray-900">₹{vendorTotal.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {order.isDelivered ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fbf4] border border-[#dcfce7] text-[#2ecc71] text-xs font-bold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71]"></span> Fulfilled
                                                    </span>
                                                ) : order.isPaid ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-500 text-xs font-bold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> Processing
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Unpaid
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 pr-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-gray-400 hover:text-[#4ede35] font-bold text-sm bg-gray-50 hover:bg-[#f0fbf4] px-4 py-2 rounded-lg transition-colors border border-gray-200 hover:border-[#4ede35]">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 whitespace-nowrap text-sm text-gray-500 font-medium text-center bg-gray-50/30">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {filteredOrders.length > 0 && (
                            <div className="border-t border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm font-medium text-green-600">
                                    Showing <span className="font-bold text-gray-900">1-{filteredOrders.length}</span> of <span className="font-bold text-gray-900">{filteredOrders.length}</span> orders
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </VendorLayout>
    );
};

export default VendorOrders;
