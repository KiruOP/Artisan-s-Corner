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
        navigate('/login?redirect=checkout'); // simple logic: redirect checkout to login if not authenticated (handled by ProtectedRoute actually)
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Cart is Empty</h2>
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 py-3 px-6 rounded-lg inline-block">
                    Explore the Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10">Shopping Cart</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-7">
                    <ul className="border-t border-gray-200 divide-y divide-gray-200">
                        {items.map((item) => (
                            <li key={item.product} className="flex py-6 sm:py-10">
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.image || 'https://placehold.co/150'}
                                        alt={item.title}
                                        className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32 shadow-sm"
                                    />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-bold text-gray-900 hover:text-blue-600">
                                                    <Link to={`/product/${item.product}`}>{item.title}</Link>
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                            <div className="flex items-center gap-4">
                                                <label htmlFor={`quantity-${item.product}`} className="sr-only">Quantity</label>
                                                <select
                                                    id={`quantity-${item.product}`}
                                                    name={`quantity-${item.product}`}
                                                    className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    value={item.quantity}
                                                    onChange={(e) => dispatch(addToCart({ ...item, quantity: Number(e.target.value) }))}
                                                >
                                                    {[...Array(10).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors"
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
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                            <dt className="text-base font-bold text-gray-900">Order total</dt>
                            <dd className="text-base font-bold text-gray-900">${totalPrice.toFixed(2)}</dd>
                        </div>
                    </dl>

                    <div className="mt-6">
                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-50 transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
