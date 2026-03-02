import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SellerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [vendorOrders, setVendorOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Quick Mock values for Analytics since we haven't implemented comprehensive aggregation routes yet.
    const totalSales = vendorOrders.length;
    const totalEarnings = vendorOrders.reduce((sum, order) => {
        // Only sum up items that belong to the vendor
        const vendorItems = order.orderItems.filter(i => i.vendor === user._id);
        const itemTotal = vendorItems.reduce((s, i) => s + (i.price * i.quantity), 0);
        // Rough 95% payout
        return sum + (itemTotal * 0.95);
    }, 0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const [productsRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/products/vendor', config),
                    axios.get('http://localhost:5000/api/orders/vendor', config)
                ]);

                setVendorProducts(productsRes.data);
                setVendorOrders(ordersRes.data);
            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your store: {user.storeProfile?.storeName}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                    + Add New Product
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                                <dd className="text-2xl font-semibold text-gray-900">${totalEarnings.toFixed(2)}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                <dd className="text-2xl font-semibold text-gray-900">{totalSales}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Your Products</dt>
                                <dd className="text-2xl font-semibold text-gray-900">{vendorProducts.length}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Products</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {vendorProducts.length === 0 ? (
                            <li className="px-6 py-4 text-gray-500">No products found. Start listing items!</li>
                        ) : (
                            vendorProducts.map(product => (
                                <li key={product._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded object-cover" src={product.images[0] || 'https://placehold.co/100'} alt="" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">{product.title}</p>
                                            <p className="text-sm text-gray-500">${product.price.toFixed(2)} | Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-sm text-blue-600 font-medium">Edit</button>
                                        <button className="text-sm text-red-600 font-medium">Delete</button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
