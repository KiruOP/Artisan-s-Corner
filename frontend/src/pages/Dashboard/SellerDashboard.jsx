import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
                    const vendorPayout = order.vendorPayout.find(v => v.vendor.toString() === user._id || user.roles.includes('admin'));
                    return acc + (vendorPayout ? vendorPayout.amount : 0);
                }, 0);

                setStats({
                    totalSales,
                    totalOrders: fetchedOrders.length,
                    totalProducts: fetchedProducts.length,
                });

            } catch (error) {
                console.warn('Backend unavailable. Loading Mock Dashboard.', error);
                setErrorMsg('Operating in Offline Demo Mode. Displaying showcase data.');

                // Offline Mock Data
                const mockProducts = [
                    { _id: 'mp1', title: 'Example Ceramic Bowl', price: 42.00, stock: 15, category: 'Home Decor' },
                    { _id: 'mp2', title: 'Hand-poured Candle', price: 25.00, stock: 40, category: 'Lifestyle' }
                ];

                const mockOrders = [
                    { _id: 'mo1', totalAmount: 67.00, isPaid: true, createdAt: new Date().toISOString() }
                ];

                setProducts(mockProducts);
                setOrders(mockOrders);
                setStats({
                    totalSales: 63.65, // 95% of 67
                    totalOrders: 1,
                    totalProducts: 2,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-black">
                <div className="animate-pulse h-12 w-12 bg-[#2c2c2e] rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-[calc(100vh-64px)] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {errorMsg && (
                    <div className="mb-8 p-4 bg-orange-900/20 border border-orange-500/30 rounded-2xl flex items-center justify-center">
                        <svg className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-orange-400 text-sm font-medium">{errorMsg}</span>
                    </div>
                )}

                <div className="md:flex md:items-center md:justify-between mb-10">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-3xl font-bold leading-7 text-white sm:text-4xl sm:truncate tracking-tight flex items-center gap-3">
                            Store Dashboard
                            <span className="text-sm font-medium bg-[#2c2c2e] text-gray-300 px-3 py-1 rounded-full uppercase tracking-wider">
                                {user.storeProfile?.storeName || 'Vendor'}
                            </span>
                        </h2>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
                        <button className="inline-flex items-center px-6 py-3 border border-[#38383a] rounded-2xl shadow-sm text-sm font-medium text-white bg-[#1c1c1e] hover:bg-[#2c2c2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#38383a] transition-all active:scale-[0.98]">
                            Manage Profile
                        </button>
                        <button className="inline-flex items-center px-6 py-3 border border-transparent rounded-2xl shadow-lg shadow-blue-500/20 text-sm font-medium text-white bg-[#0a84ff] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#0a84ff] transition-all active:scale-[0.98]">
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12">
                    <div className="bg-[#1c1c1e] overflow-hidden rounded-[32px] shadow border border-[#2c2c2e]/50 hover:border-[#38383a] transition-colors">
                        <div className="px-6 py-8">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-[#32d74b]/10 p-4 rounded-2xl">
                                    <svg className="h-8 w-8 text-[#32d74b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-400 truncate tracking-wide">Total Earnings</dt>
                                        <dd className="text-3xl font-bold text-white tracking-tight">${stats.totalSales.toFixed(2)}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1c1c1e] overflow-hidden rounded-[32px] shadow border border-[#2c2c2e]/50 hover:border-[#38383a] transition-colors">
                        <div className="px-6 py-8">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-[#0a84ff]/10 p-4 rounded-2xl">
                                    <svg className="h-8 w-8 text-[#0a84ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-400 truncate tracking-wide">Total Orders</dt>
                                        <dd className="text-3xl font-bold text-white tracking-tight">{stats.totalOrders}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1c1c1e] overflow-hidden rounded-[32px] shadow border border-[#2c2c2e]/50 hover:border-[#38383a] transition-colors">
                        <div className="px-6 py-8">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-500/10 p-4 rounded-2xl">
                                    <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-400 truncate tracking-wide">Active Products</dt>
                                        <dd className="text-3xl font-bold text-white tracking-tight">{stats.totalProducts}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listings Section */}
                <div className="mb-12">
                    <h3 className="text-xl leading-6 font-semibold text-white mb-6 tracking-tight">Your Products</h3>
                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border border-[#2c2c2e]/50 rounded-3xl">
                                    <table className="min-w-full divide-y divide-[#2c2c2e]">
                                        <thead className="bg-[#1c1c1e]">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Edit</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[#000000] divide-y divide-[#2c2c2e]">
                                            {products.map((product) => (
                                                <tr key={product._id} className="hover:bg-[#1c1c1e]/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-[#2c2c2e] overflow-hidden border border-[#38383a]">
                                                                <img src={product.images?.[0] || 'https://placehold.co/100'} alt="" className="h-12 w-12 object-cover" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-white">{product.title}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-[#32d74b]/10 text-[#32d74b]' : 'bg-[#ff453a]/10 text-[#ff453a]'}`}>
                                                            {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{product.category}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button className="text-[#0a84ff] hover:text-blue-400 mr-4 transition-colors">Edit</button>
                                                        <button className="text-[#ff453a] hover:text-red-400 transition-colors">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {products.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">No products found. Start adding some!</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div>
                    <h3 className="text-xl leading-6 font-semibold text-white mb-6 tracking-tight">Recent Orders</h3>
                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border border-[#2c2c2e]/50 rounded-3xl">
                                    <table className="min-w-full divide-y divide-[#2c2c2e]">
                                        <thead className="bg-[#1c1c1e]">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[#000000] divide-y divide-[#2c2c2e]">
                                            {orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-[#1c1c1e]/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0a84ff]">#{order._id.substring(0, 8)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${order.totalAmount.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isPaid ? 'bg-[#32d74b]/10 text-[#32d74b]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                            {order.isPaid ? 'Paid' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">No orders yet. Keep promoting your products!</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerDashboard;
