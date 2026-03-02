import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const orderData = {
                orderItems: items,
                shippingAddress,
            };

            await axios.post('http://localhost:5000/api/orders', orderData, config);
            dispatch(clearCart());
            alert('Order Placed Successfully. Stripe logic runs in backend automatically.');
            navigate('/');
        } catch (err) {
            console.warn("Backend checkout failed, running mock checkout flow.", err);
            // Fallback for demonstration when backend is offline
            setTimeout(() => {
                dispatch(clearCart());
                alert('Mock Order Placed Successfully!');
                navigate('/');
            }, 1000);
        } finally {
            if (!error) setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
    }

    return (
        <div className="bg-black min-h-[calc(100vh-64px)] py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-white mb-10 text-center tracking-tight">Review & Checkout</h1>

                {error && <div className="bg-[#ff453a]/20 text-[#ff453a] p-4 mb-6 rounded-2xl border border-[#ff453a]/30 font-medium text-center">{error}</div>}

                <div className="bg-[#1c1c1e] shadow-2xl rounded-[32px] overflow-hidden border border-[#2c2c2e]/50">
                    <div className="px-6 py-8 sm:p-10">
                        <h3 className="text-2xl font-semibold text-white mb-8 tracking-tight">Shipping Details</h3>
                        <form onSubmit={handleCheckout} className="space-y-6">

                            <div className="bg-[#000000] p-6 rounded-2xl border border-[#2c2c2e] space-y-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                                    <input type="text" name="address" required value={shippingAddress.address} onChange={handleInputChange} className="block w-full rounded-xl bg-[#2c2c2e] text-white border-transparent focus:border-[#0a84ff] focus:bg-[#38383a] focus:ring-0 sm:text-base py-3 px-4 outline-none transition-colors" placeholder="1 Infinite Loop" />
                                </div>

                                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">City</label>
                                        <input type="text" name="city" required value={shippingAddress.city} onChange={handleInputChange} className="block w-full rounded-xl bg-[#2c2c2e] text-white border-transparent focus:border-[#0a84ff] focus:bg-[#38383a] focus:ring-0 sm:text-base py-3 px-4 outline-none transition-colors" placeholder="Cupertino" />
                                    </div>

                                    <div>
                                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-400 mb-2">ZIP Code</label>
                                        <input type="text" name="postalCode" required value={shippingAddress.postalCode} onChange={handleInputChange} className="block w-full rounded-xl bg-[#2c2c2e] text-white border-transparent focus:border-[#0a84ff] focus:bg-[#38383a] focus:ring-0 sm:text-base py-3 px-4 outline-none transition-colors" placeholder="95014" />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                                        <input type="text" name="country" required value={shippingAddress.country} onChange={handleInputChange} className="block w-full rounded-xl bg-[#2c2c2e] text-white border-transparent focus:border-[#0a84ff] focus:bg-[#38383a] focus:ring-0 sm:text-base py-3 px-4 outline-none transition-colors" placeholder="United States" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8">
                                <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">Payment</h3>
                                <div className="flex justify-between items-center bg-[#000000] p-6 rounded-2xl mb-8 border border-[#2c2c2e]">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm mb-1">Total Amount</span>
                                        <span className="text-3xl font-bold text-white tracking-tight">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="h-12 w-16 bg-[#2c2c2e] rounded-lg flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/20 text-lg font-semibold text-white bg-[#0a84ff] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1c1c1e] focus:ring-[#0a84ff] disabled:bg-[#38383a] disabled:text-gray-500 disabled:shadow-none transition-all active:scale-[0.98]"
                                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                                >
                                    {loading ? 'Processing...' : 'Complete Purchase'}
                                </button>
                                <p className="text-center text-sm text-gray-500 mt-4">Payments are securely processed via mock Stripe infrastructure.</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
