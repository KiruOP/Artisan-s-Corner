import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice } = useSelector((state) => state.cart);

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center bg-black min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
                <div className="bg-[#1c1c1e] p-12 rounded-[32px] border border-[#2c2c2e]/50 max-w-lg w-full">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Your Cart is Empty</h2>
                    <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="text-white bg-[#0a84ff] hover:bg-blue-500 font-semibold py-4 px-8 rounded-2xl inline-flex items-center transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                        Explore the Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-[calc(100vh-64px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-12">Bag.</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <ul className="divide-y divide-[#2c2c2e] border-t border-[#2c2c2e]">
                            {items.map((item) => (
                                <li key={item.product} className="flex py-8 sm:py-10">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={item.image || 'https://placehold.co/150'}
                                            alt={item.title}
                                            className="w-24 h-24 rounded-2xl object-center object-cover sm:w-32 sm:h-32 shadow-md border border-[#2c2c2e]"
                                        />
                                    </div>

                                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-semibold text-white hover:text-[#0a84ff] tracking-tight transition-colors">
                                                        <Link to={`/product/${item.product}`}>{item.title}</Link>
                                                    </h3>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-400">Unit Price: ${item.price.toFixed(2)}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <div className="flex items-center justify-between sm:justify-end gap-6">
                                                    <p className="text-xl font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                                    <div className="flex items-center gap-4">
                                                        <label htmlFor={`quantity-${item.product}`} className="sr-only">Quantity</label>
                                                        <select
                                                            id={`quantity-${item.product}`}
                                                            name={`quantity-${item.product}`}
                                                            className="max-w-full rounded-xl bg-[#1c1c1e] border-none py-2 pl-3 pr-8 text-base font-medium text-white focus:ring-2 focus:ring-[#0a84ff] sm:text-sm appearance-none outline-none"
                                                            value={item.quantity}
                                                            onChange={(e) => dispatch(addToCart({ ...item, quantity: Number(e.target.value) }))}
                                                        >
                                                            {[...Array(10).keys()].map((x) => (
                                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                            ))}
                                                        </select>

                                                        <button
                                                            type="button"
                                                            className="-m-2 p-2 inline-flex text-gray-500 hover:text-[#ff453a] transition-colors"
                                                            onClick={() => handleRemove(item.product)}
                                                        >
                                                            <span className="sr-only">Remove</span>
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-16 bg-[#1c1c1e] rounded-[32px] px-4 py-6 sm:p-8 lg:mt-0 lg:col-span-5 shadow-2xl border border-[#2c2c2e]/50">
                        <h2 className="text-xl font-semibold text-white tracking-tight">Order summary</h2>

                        <dl className="mt-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-400">Subtotal</dt>
                                <dd className="text-sm font-medium text-white">${totalPrice.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-400">Shipping estimate</dt>
                                <dd className="text-sm font-medium text-white">Calculated at checkout</dd>
                            </div>

                            <div className="border-t border-[#38383a] pt-6 mt-6 flex items-center justify-between">
                                <dt className="text-xl font-bold text-white tracking-tight">Total</dt>
                                <dd className="text-xl font-bold text-white tracking-tight">${totalPrice.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-8">
                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-white text-black border border-transparent rounded-2xl shadow-sm py-4 px-4 text-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1c1c1e] focus:ring-white transition-all active:scale-[0.98]"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
