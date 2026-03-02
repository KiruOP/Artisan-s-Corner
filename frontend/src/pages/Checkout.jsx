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
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Checkout</h1>

            {error && <div className="bg-red-50 text-red-500 p-4 mb-6 rounded-md border border-red-200">{error}</div>}

            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Shipping Information</h3>
                    <form onSubmit={handleCheckout} className="space-y-6">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" name="address" required value={shippingAddress.address} onChange={handleInputChange} className="mt-1 flex-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" placeholder="123 Main St" />
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" name="city" required value={shippingAddress.city} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" placeholder="New York" />
                            </div>

                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input type="text" name="postalCode" required value={shippingAddress.postalCode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" placeholder="10001" />
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <input type="text" name="country" required value={shippingAddress.country} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" placeholder="United States" />
                            </div>
                        </div>

                        <div className="mt-10 border-t border-gray-200 pt-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Summary</h3>
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md mb-6">
                                <span className="font-medium text-gray-700">Total Price:</span>
                                <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
                                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                            >
                                {loading ? 'Processing...' : 'Pay with Stripe (Mock)'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
