import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrderConfirmation = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchOrderAndSuggestions = async () => {
            try {
                if (id && id !== 'success') {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
                    setOrder(res.data);
                }

                // Fetch suggestions
                const prodRes = await axios.get('http://localhost:5000/api/products');
                // Just grab 3 random or top products for suggestions
                if (prodRes.data && prodRes.data.length > 0) {
                    setSuggestions(prodRes.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching order confirmation details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndSuggestions();
    }, [id, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Default dates if order data isn't perfect
    const orderDate = order ? new Date(order.createdAt) : new Date();
    const deliveryStart = new Date(orderDate);
    deliveryStart.setDate(deliveryStart.getDate() + 3);
    const deliveryEnd = new Date(orderDate);
    deliveryEnd.setDate(deliveryEnd.getDate() + 7);

    const formatDateObj = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">

                {/* Success Header Box */}
                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center mb-8">
                    <div className="w-20 h-20 bg-[#f0fbf4] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-[#2ecc71]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                        Thank you for supporting independent creators. We've sent a detailed confirmation email to <span className="font-semibold text-gray-900">{order?.buyer?.email || 'your email'}</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/shop" className="w-full sm:w-auto px-8 py-3.5 bg-[#4ede35] hover:bg-[#43c42e] text-white font-semibold rounded-full shadow-sm transition-all transform hover:scale-[1.02] flex justify-center items-center">
                            Continue Shopping →
                        </Link>
                        <Link to="/dashboard/seller" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-full transition-all flex justify-center items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            View Order Status
                        </Link>
                    </div>
                </div>

                {/* Order Details Details */}
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-12">

                    <div className="border-b border-gray-100 p-6 sm:px-8 bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order Number</p>
                            <p className="text-gray-900 font-bold select-all">#AC-{id === 'success' ? '8492-JK' : id?.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Estimated Delivery</p>
                            <p className="text-[#2ecc71] font-bold">{formatDateObj(deliveryStart)} - {formatDateObj(deliveryEnd)}</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

                        <div className="space-y-6">
                            {(order?.orderItems || [
                                { _id: 1, title: 'Speckled Ceramic Vase - Minimalist Collection', vendor: { storeProfile: { storeName: 'Earth & Clay Studio' } }, price: 68, quantity: 1, image: 'https://placehold.co/100' },
                                { _id: 2, title: 'Woven Wall Tapestry - "Desert Sunset"', vendor: { storeProfile: { storeName: 'Loom & Weave' } }, price: 145, quantity: 1, image: 'https://placehold.co/100' }
                            ]).map((item, idx) => (
                                <div key={item._id || idx} className="flex gap-4 sm:gap-6 items-center">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 pr-4">{item.title}</h4>
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1">Creator: <span className="text-[#4ede35] font-medium">{item.vendor?.storeProfile?.storeName || 'Artisan Seller'}</span></p>
                                            <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-gray-900 mt-1 sm:mt-0">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
                            <span className="text-gray-500 font-medium tracking-wide">Total Paid</span>
                            <span className="text-2xl font-black text-gray-900">₹{(order?.totalAmount || 213.00).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* You might also like section */}
                {suggestions.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">You might also like</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {suggestions.map((prod) => (
                                <Link to={`/product/${prod._id}`} key={prod._id} className="group cursor-pointer">
                                    <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 mb-3 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                                        <img src={prod.images?.[0] || 'https://placehold.co/300'} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm truncate">{prod.title}</h4>
                                    <p className="text-xs text-gray-500 mb-1 truncate">By {prod.vendor?.storeProfile?.storeName || 'Artisan'}</p>
                                    <p className="font-bold text-[var(--color-text-primary)] text-sm">₹{prod.price.toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrderConfirmation;
