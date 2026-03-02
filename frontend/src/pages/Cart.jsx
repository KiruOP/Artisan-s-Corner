import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartQty } from '../redux/cartSlice';

const Cart = () => {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkOutHandler = () => {
        navigate('/checkout');
    };

    const platformFee = items.length === 0 ? 0 : parseFloat((totalPrice * 0.05).toFixed(2));
    const shipping = items.length === 0 ? 0 : 12.50; // Mock shipping logic matching UI
    const totalAmount = totalPrice + platformFee + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-[var(--color-background-soft)] flex flex-col justify-center items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added any handcrafted treasures to your cart yet.</p>
                <Link to="/" className="btn-primary inline-flex gap-2 items-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background-soft)] min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Your Shopping Cart</h1>
                    <p className="text-gray-500 text-lg">You have {items.length} unique items in your cart ready for checkout.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-5">
                        {items.map((item) => (
                            <div key={item.product} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
                                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow flex flex-col w-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 truncate pr-4">{item.title}</h3>
                                        <span className="text-xl font-bold text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-1">Color/Variant Name</p>
                                    <p className="text-sm font-medium text-[var(--color-brand)] flex items-center gap-1.5 mb-6">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fillOpacity="0" /><path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l6 4.5v9H6v-9l6-4.5z" /></svg>
                                        {item.vendor?.name || 'Artisan Seller'}
                                    </p>

                                    <div className="flex items-center justify-between w-full mt-auto">
                                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-1 h-10 w-28">
                                            <button
                                                onClick={() => dispatch(updateCartQty({ id: item.product, qty: Math.max(1, item.quantity - 1) }))}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                            >−</button>
                                            <span className="flex-1 text-center font-medium text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateCartQty({ id: item.product, qty: item.quantity + 1 }))}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.product))}
                                            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors p-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-28">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 text-gray-600 mb-8 border-b border-gray-100 pb-8">
                                <div className="flex justify-between font-medium">
                                    <span>Subtotal ({items.reduce((a, c) => a + c.quantity, 0)} items)</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500">
                                    <span className="flex items-center gap-1">Platform Fee (5%) <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></span>
                                    <span>${platformFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping estimate</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex mb-8 gap-2">
                                <input type="text" placeholder="Promo code" className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] text-gray-700 placeholder-gray-400" />
                                <button className="bg-gray-200 text-gray-700 font-semibold rounded-full px-6 py-3 hover:bg-gray-300 transition-colors">Apply</button>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-gray-900 block leading-none mb-1">${totalAmount.toFixed(2)}</span>
                                    <span className="text-xs text-gray-400">USD including taxes</span>
                                </div>
                            </div>

                            <button onClick={checkOutHandler} className="w-full h-14 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-lg font-bold rounded-full shadow-sm shadow-[var(--color-brand)]/20 transition-all flex items-center justify-center gap-2 mb-4">
                                Proceed to Checkout
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>

                            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-sm font-medium">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                Secure Checkout
                            </div>
                        </div>

                        {/* Badges Box */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 border-dashed flex justify-center gap-8 shadow-sm">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-[#bcf0a3]/50 rounded-full flex items-center justify-center text-[var(--color-brand)]">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" /></svg>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">Fast Ship</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-[#bcf0a3]/50 rounded-full flex items-center justify-center text-[var(--color-brand)]">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">Verified</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-[#bcf0a3]/50 rounded-full flex items-center justify-center text-[var(--color-brand)]">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">Eco-friendly</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
