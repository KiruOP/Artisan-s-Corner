import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState({ type: '', message: '' });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
            } catch (error) {
                console.error("Products Fetch Error:", error);
                setErrorMsg('Unable to fetch live products from the server. Check your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            setSubscribeStatus({ type: 'error', message: 'Please enter an email' });
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/subscribers', { email });
            setSubscribeStatus({ type: 'success', message: 'Success! You are now subscribed.' });
            setEmail('');
            setTimeout(() => setSubscribeStatus({ type: '', message: '' }), 4000);
        } catch (error) {
            setSubscribeStatus({
                type: 'error',
                message: error.response?.data?.message || 'Subscription failed. Please try again.'
            });
            setTimeout(() => setSubscribeStatus({ type: '', message: '' }), 4000);
        }
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        dispatch(addToCart({
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image: product.images[0],
            vendor: product.vendor?._id || product.vendor?.name || 'mock_vendor',
        }));
    };

    // Extract unique categories and one representative image from fetched products
    const displayCategories = Array.from(
        new Map(products.map(p => [p.category, p.images[0]])).entries()
    ).map(([name, image]) => ({ name, image }));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[var(--color-background-soft)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="text-gray-500 font-medium">Loading collection...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-16">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {errorMsg && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center">
                        <span className="text-orange-600 text-sm font-medium">{errorMsg}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 items-stretch h-auto md:h-[500px]">
                    <div className="bg-[#f3f4f6] rounded-3xl p-10 flex-1 flex flex-col justify-center">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-2">Discover</h1>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-brand)] mb-2">Handmade</h1>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">Treasures</h1>
                        <p className="text-gray-600 text-lg mb-8 max-w-md">
                            Shop unique, handcrafted items from independent creators around the world. Find something that speaks to your soul.
                        </p>
                        <div className="flex gap-4 items-center">
                            <Link to="/" className="btn-primary">Shop Now</Link>
                            <Link to="/" className="bg-white text-gray-900 font-medium rounded-full px-6 py-2.5 hover:bg-gray-50 transition-colors shadow-sm">Our Story</Link>
                        </div>
                        <div className="mt-8 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?img=1" alt="Face 1" className="w-8 h-8 rounded-full border-2 border-[#f3f4f6]" />
                                <img src="https://i.pravatar.cc/100?img=2" alt="Face 2" className="w-8 h-8 rounded-full border-2 border-[#f3f4f6]" />
                                <img src="https://i.pravatar.cc/100?img=3" alt="Face 3" className="w-8 h-8 rounded-full border-2 border-[#f3f4f6]" />
                            </div>
                            <span className="text-sm text-gray-600">Join <strong>10k+</strong> artisans & creators</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <img className="w-full h-full object-cover rounded-3xl" src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80" alt="Pottery Artisan" />
                    </div>
                </div>
            </div>

            {/* Browse Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
                        <p className="text-gray-500 mt-1">Curated collections just for you</p>
                    </div>
                    <Link to="/" className="text-[var(--color-brand)] font-medium hover:underline flex items-center gap-1">
                        View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {displayCategories.length > 0 ? displayCategories.slice(0, 6).map((cat, idx) => (
                        <div key={idx} className="group block cursor-pointer">
                            <div className="rounded-2xl overflow-hidden bg-gray-100 mb-3 aspect-square relative">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                            </div>
                            <h3 className="text-center font-medium text-gray-900 group-hover:text-[var(--color-brand)] transition-colors">{cat.name}</h3>
                        </div>
                    )) : (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="group block cursor-pointer">
                                <div className="rounded-2xl overflow-hidden bg-gray-100 mb-3 aspect-square relative animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-1 animate-pulse"></div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="group block mb-4 border border-gray-100 rounded-3xl p-3 hover:shadow-lg transition-shadow bg-white">
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] sm:aspect-square">
                                {product.isSale && (
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">SALE</span>
                                )}
                                <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full z-10 hover:bg-white" onClick={(e) => { e.preventDefault(); }}>
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                </button>
                                <img
                                    src={product.images[0]?.startsWith('http') ? product.images[0] : 'https://placehold.co/400x400/f3f4f6/a1a1aa'}
                                    alt={product.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>
                            <div className="pt-4 pb-2 px-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 flex-shrink-0 py-0.5 rounded text-xs font-medium text-gray-700">
                                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        {product.rating || (Math.random() * (5 - 4) + 4).toFixed(1)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-1">by {product.vendor?.name}</p>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-[var(--color-brand)]">₹{product.price.toFixed(2)}</span>
                                        {product.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through">₹{product.oldPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="flex justify-center items-center w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-colors duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Newsletter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="bg-[#f3f4f6] rounded-[2.5rem] p-12 text-center relative overflow-hidden flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#bcf0a3] rounded-full flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-[#50a618]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Join our community of artisans</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Subscribe for exclusive updates, new arrival alerts, and inspiration delivered straight to your inbox.
                    </p>
                    <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 relative z-10 bg-white p-1 rounded-full shadow-sm border border-gray-100" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 bg-transparent border-none px-6 py-3 focus:outline-none text-gray-700"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
                    </form>
                    {subscribeStatus.message && (
                        <p className={`text-sm mt-3 font-medium transition-all ${subscribeStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {subscribeStatus.message}
                        </p>
                    )}
                    <p className="text-xs text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>

        </div>
    );
};

export default Home;
