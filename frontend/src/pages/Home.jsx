import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addToCart({
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image: product.images[0],
            vendor: product.vendor._id || product.vendor,
        }));
    };

    if (loading) return <div className="text-center mt-20">Loading amazing products...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    Discover Unique <span className="text-blue-600">Artisan</span> Craft
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Support independent vendors and find exactly what you're looking for.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                        <Link to={`/product/${product._id}`}>
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                                <img
                                    src={product.images[0]?.startsWith('http') ? product.images[0] : 'https://placehold.co/400x300?text=Product'}
                                    alt={product.title}
                                    className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </Link>
                        <div className="p-5">
                            <Link to={`/product/${product._id}`}>
                                <h3 className="text-lg font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-gray-900 hover:bg-blue-600 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    aria-label="Add to cart"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                                Vendor: {product.vendor?.storeProfile?.storeName || product.vendor?.name || 'Unknown'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
