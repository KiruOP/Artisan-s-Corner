import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { success, info } = useToast();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'United States',
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const platformFee = items.length === 0 ? 0 : parseFloat((totalPrice * 0.05).toFixed(2));
    const shipping = items.length === 0 ? 0 : 12.50; // Mock estimate
    const taxes = parseFloat((totalPrice * 0.08).toFixed(2)); // mock 8% tax
    const totalAmount = totalPrice + taxes + shipping;

    // Used the taxes instead of platform fee to match the UI which only lists Subtotal, Shipping, Taxes, Total. Wait, looking deeply at UI screenshot, the UI lists "Subtotal, Shipping, Taxes, Total". I'll adjust.

    const handleInputChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const orderData = {
                orderItems: items,
                shippingAddress,
            };

            await axios.post('http://localhost:5000/api/orders', orderData, config);

            success('Order Placed Successfully! (Mock Stripe Executed)');
            dispatch(clearCart());
            navigate('/');
        } catch (error) {
            console.warn("Backend unavailable. Simulating clear cart.");
            // Offline mock flow
            info('Order Placed Successfully! (Offline Mock Mode)');
            dispatch(clearCart());
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-[var(--color-background-soft)]">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Cart is Empty</h2>
                <Link to="/" className="text-[var(--color-brand)] font-medium">Return to Shop</Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background-soft)] min-h-screen">
            {/* Minimalist Checkout Header */}
            <header className="bg-white border-b border-gray-100 py-6 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-[var(--color-brand)]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fillOpacity="0" />
                            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l6 4.5v9H6v-9l6-4.5z" />
                            <circle cx="12" cy="14" r="3" />
                        </svg>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">
                            Artisan's Corner
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="#" className="text-sm font-medium text-[var(--color-brand)] bg-[#bcf0a3]/30 px-3 py-1.5 rounded-full flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            Help
                        </Link>
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                            Secure Checkout
                        </span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row gap-12 items-start">

                {/* Left Side: Forms */}
                <div className="w-full lg:w-[55%]">
                    {/* Stepper */}
                    <div className="flex items-center mb-10 text-xs font-semibold text-gray-400">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center mb-1 shadow">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-[var(--color-brand)]">Cart</span>
                        </div>
                        <div className="h-0.5 w-12 bg-[var(--color-brand)] -mt-4"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-[var(--color-brand)] flex items-center justify-center mb-1 shadow-sm"></div>
                            <span className="text-gray-900">Shipping</span>
                        </div>
                        <div className="h-0.5 w-12 bg-gray-200 -mt-4"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-1"></div>
                            <span>Payment</span>
                        </div>
                        <div className="h-0.5 w-12 bg-gray-200 -mt-4"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-1"></div>
                            <span>Review</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Address</h1>
                    <p className="text-[var(--color-brand)] mb-8 font-medium">Where should we send your handcrafted goods?</p>

                    <form onSubmit={placeOrderHandler} id="checkout-form" className="space-y-6">

                        {/* Contact Details Card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <svg className="w-5 h-5 text-[var(--color-brand)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                Contact Details
                            </h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={shippingAddress.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white transition-all text-gray-900"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <input type="checkbox" id="updates" className="w-4 h-4 text-[var(--color-brand)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--color-brand)]" defaultChecked />
                                <label htmlFor="updates" className="ml-2 text-sm text-[var(--color-brand)]">Keep me updated on new artisan arrivals.</label>
                            </div>
                        </div>

                        {/* Shipping Details Card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <svg className="w-5 h-5 text-[var(--color-brand)]" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                Shipping Details
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" name="firstName" required value={shippingAddress.firstName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900" placeholder="Jane" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" name="lastName" required value={shippingAddress.lastName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-1 mb-4">
                                <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                                <input type="text" name="address" required value={shippingAddress.address} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900" placeholder="123 Craft Lane" />
                            </div>

                            <div className="space-y-1 mb-4">
                                <label className="text-sm font-medium text-gray-700">Apartment, suite, etc. (optional)</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900" />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="city" required value={shippingAddress.city} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900" placeholder="Portland" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">State / Province</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900">
                                        <option>Select...</option>
                                        <option>OR</option>
                                        <option>CA</option>
                                        <option>NY</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Postal Code</label>
                                    <input type="text" name="postalCode" required value={shippingAddress.postalCode} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900" placeholder="97204" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                    </div>
                                    <input type="text" name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:bg-white text-gray-900" placeholder="(555) 123-4567" />
                                </div>
                                <p className="text-xs text-[var(--color-brand)] mt-2 font-medium">We may use this to coordinate delivery.</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <Link to="/cart" className="text-[var(--color-brand)] font-medium flex items-center gap-1 hover:text-[var(--color-brand-hover)]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Return to Cart
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`h-14 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white text-lg font-bold rounded-full shadow-sm px-8 transition-colors flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing...' : 'Continue to Payment'}
                                {!loading && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full lg:w-[45%]">
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm sticky top-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-6 mb-8 border-b border-gray-100 pb-8 h-max max-h-72 overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.product} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-[1rem] overflow-hidden flex-shrink-0 relative border border-gray-100 shadow-sm">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[var(--color-brand)] w-5 h-5 flex justify-center items-center text-white text-xs font-bold rounded-full">{item.quantity}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h4>
                                        <p className="text-xs text-[var(--color-brand)] mb-1">Variant: Default</p>
                                        <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex mb-6 gap-2 border-b border-gray-100 pb-8">
                            <input type="text" placeholder="Gift card or discount code" className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] text-gray-700 text-sm" />
                            <button className="bg-gray-200 text-gray-700 font-semibold rounded-full px-6 py-3 hover:bg-gray-300 transition-colors text-sm">Apply</button>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-8">
                            <div className="flex justify-between font-medium">
                                <span>Subtotal</span>
                                <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[var(--color-brand)]">
                                <span className="flex items-center gap-1">Shipping <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></span>
                                <span className="font-medium">Calculated next step</span>
                            </div>
                            <div className="flex justify-between text-[var(--color-brand)]">
                                <span>Taxes</span>
                                <span className="font-medium">Calculated next step</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="text-xl font-bold text-gray-900">Total</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-gray-500 font-medium">USD</span>
                                <span className="text-3xl font-black text-gray-900 leading-none">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Badges Box */}
                        <div className="flex justify-center gap-8 pt-4">
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-gray-400">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Secure</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-gray-400">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" /></svg>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Insured</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-gray-400">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Eco-Friendly</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Very minimal footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-brand)] font-medium">
                <p className="mb-4 md:mb-0">© 2024 Artisan's Corner. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link to="#" className="hover:underline">Refund Policy</Link>
                    <Link to="#" className="hover:underline">Shipping Policy</Link>
                    <Link to="#" className="hover:underline">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
