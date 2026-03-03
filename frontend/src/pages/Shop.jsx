import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState({ type: '', message: '' });

    // Filters State
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [sortOption, setSortOption] = useState('Featured');
    const [categories, setCategories] = useState(['All Products']);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [minRating, setMinRating] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
                setFilteredProducts(data);

                // Extract unique categories
                const uniqueCategories = ['All Products', ...new Set(data.map(p => p.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Products Fetch Error:", error);
                setErrorMsg('Unable to fetch live products from the server. Check your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle Filtering
    useEffect(() => {
        let result = [...products];

        if (selectedCategory !== 'All Products') {
            result = result.filter(p => p.category === selectedCategory);
        }

        result = result.filter(p => p.price <= maxPrice);

        if (minRating > 0) {
            result = result.filter(p => (p.rating || 4.5) >= minRating); // Defaulting to 4.5 mock rating
        }

        // Sorting logic placeholder
        if (sortOption === 'Price: Low to High') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'Price: High to Low') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(result);
    }, [selectedCategory, sortOption, maxPrice, minRating, products]);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-[#fafafa]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="text-gray-500 font-medium">Loading collection...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fafafa] min-h-screen pt-8 pb-16 font-sans">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">

                {/* Left Sidebar - Filters */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    {/* Categories Filter */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                        <div className="space-y-3">
                            {categories.map((cat, idx) => (
                                <label key={idx} className={`flex items-center p-3 rounded-full cursor-pointer transition-colors border ${selectedCategory === cat ? 'bg-white border-[#e5e5e5] shadow-sm' : 'border-transparent hover:bg-gray-100'}`}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedCategory === cat ? 'border-[var(--color-brand)]' : 'border-gray-300'}`}>
                                        {selectedCategory === cat && <div className="w-2.5 h-2.5 bg-[var(--color-brand)] rounded-full"></div>}
                                    </div>
                                    <span className={`text-sm font-medium ${selectedCategory === cat ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Price Range</h3>
                            <span className="text-sm font-medium text-[var(--color-brand)]">Up to ₹{maxPrice}</span>
                        </div>
                        <div className="pt-2">
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="50"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand)]"
                            />
                            <div className="flex justify-between text-xs text-gray-500 font-medium tracking-wide mt-3">
                                <span>₹0</span>
                                <span>₹2,000+</span>
                            </div>
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Rating</h3>
                            {minRating > 0 && <button onClick={() => setMinRating(0)} className="text-xs font-semibold text-gray-500 hover:text-[var(--color-brand)]">Clear</button>}
                        </div>
                        <div className="space-y-3">
                            {[4, 3, 2].map(rating => (
                                <label key={rating} className="flex items-center cursor-pointer group" onClick={() => setMinRating(rating)}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 group-hover:border-[var(--color-brand)] transition-colors ${minRating === rating ? 'border-[var(--color-brand)]' : 'border-gray-300'}`}>
                                        {minRating === rating && <div className="w-2.5 h-2.5 bg-[var(--color-brand)] rounded-full"></div>}
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className={`text-xs ml-2 font-medium ${minRating === rating ? 'text-gray-900' : 'text-gray-500'}`}>& Up</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content - Product Grid */}
                <div className="flex-1">
                    {/* Breadcrumbs & Header */}
                    <div className="mb-8">
                        <div className="flex items-center text-sm text-gray-500 font-medium mb-3">
                            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900 border-b border-gray-900 pb-0.5">Shop</span>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900 font-semibold">{selectedCategory}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 tracking-tight font-serif mb-2">
                                    Handcrafted Treasures
                                </h1>
                                <p className="text-sm text-gray-500 font-medium">
                                    Showing 1-{Math.min(filteredProducts.length, 12)} of {products.length} unique items
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-900">Sort by:</span>
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] shadow-sm cursor-pointer"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option>Featured</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Newest Arrivals</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-brand)]">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                        {filteredProducts.map((product, idx) => (
                            <Link key={product._id} to={`/product/${product._id}`} className="group block">
                                <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 aspect-[4/5] object-cover mb-4">
                                    {/* Mocking Badges based on index logic for visual match */}
                                    {idx === 0 && (
                                        <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                            Best Seller
                                        </span>
                                    )}
                                    {idx === 3 && (
                                        <span className="absolute bottom-4 left-4 bg-[#61c521] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                            New Arrival
                                        </span>
                                    )}
                                    <img
                                        src={product.images[0]?.startsWith('http') ? product.images[0] : 'https://placehold.co/400x500/f3f4f6/a1a1aa'}
                                        alt={product.title}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    {/* Quick add fade-in on hover overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            Quick Add
                                        </button>
                                    </div>
                                </div>
                                <div className="px-1 mt-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-base font-bold text-gray-900 truncate pr-2">
                                            {product.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-xl font-black text-gray-900">₹{product.price.toFixed(2)}</span>
                                        {product.oldPrice && (
                                            <span className="text-xs font-semibold text-gray-400 line-through">₹{product.oldPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">by {product.vendor?.name || 'Local Artisan'}</p>
                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-gray-900">{product.rating || (Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                                        <span className="text-gray-400">({product.numReviews || Math.floor(Math.random() * 100) + 12})</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                            <button onClick={() => setSelectedCategory('All Products')} className="mt-4 text-[var(--color-brand)] font-semibold hover:underline">Clear Filters</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredProducts.length > 0 && (
                        <div className="mt-16 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-[var(--color-brand)] text-white font-semibold shadow-sm flex items-center justify-center">1</button>
                                <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">2</button>
                                <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">3</button>
                                <span className="px-2 text-gray-400">...</span>
                                <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">12</button>
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Newsletter (Separated per design) */}
            <div className="mt-24 border-t border-gray-100 pt-20 bg-white w-full flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-[#f4fdf4] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-[var(--color-brand)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Join the Artisan Community</h2>
                <p className="text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
                    Subscribe for updates on new arrivals, artist stories, and exclusive offers. Find something truly unique today.
                </p>
                <form className="w-full max-w-md flex flex-col sm:flex-row gap-4 mb-20 px-4" onSubmit={handleSubscribe}>
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-1 bg-[#fafafa] border border-gray-200 rounded-full px-6 py-3.5 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] text-gray-700 w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="bg-[var(--color-brand)] hover:bg-[#52ad17] text-white font-bold py-3.5 px-8 rounded-full shadow-sm transition-colors w-full sm:w-auto">
                        Subscribe
                    </button>
                    {subscribeStatus.message && (
                        <p className={`absolute -bottom-6 w-full text-center text-sm font-medium ${subscribeStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {subscribeStatus.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Shop;
