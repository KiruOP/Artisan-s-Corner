import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const MOCK_CATEGORIES = [
    { name: 'Jewelry', desc: 'Handcrafted adornments', image: 'https://images.unsplash.com/photo-1599643478524-fb66f70d00f7?auto=format&fit=crop&q=80&w=400' },
    { name: 'Home Decor', desc: 'Cozy living spaces', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Art & Prints', desc: 'Original artworks', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400' },
    { name: 'Clothing', desc: 'Sustainable fashion', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&q=80&w=400' },
    { name: 'Ceramics', desc: 'Unique pottery', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400' },
    { name: 'Gifts', desc: 'Thoughtful presents', image: 'https://images.unsplash.com/photo-1511216113906-8f56bbce5bb6?auto=format&fit=crop&q=80&w=400' },
];

const MOCK_PRODUCTS = [
    { _id: 'm1', title: 'Earthen Vase', description: 'A beautiful ceramic vase.', price: 45.00, images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600'], vendor: { name: 'Terra Clay Studio' }, category: 'Home Decor', rating: 4.9 },
    { _id: 'm2', title: 'Woven Basket', description: 'Woven basket.', price: 32.50, images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600'], vendor: { name: "Weaver's Nest" }, category: 'Home Decor', rating: 4.7 },
    { _id: 'm3', title: 'Linen Dress', description: 'Linen Dress.', price: 89.00, images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&q=80&w=600'], vendor: { name: "Pure Threads" }, category: 'Clothing', rating: 5.0 },
    { _id: 'm4', title: 'Silver Ring', description: 'Silver Ring.', price: 55.00, oldPrice: 65.00, images: ['https://images.unsplash.com/photo-1599643478524-fb66f70d00f7?auto=format&fit=crop&q=80&w=600'], vendor: { name: "Silver Soul" }, category: 'Jewelry', rating: 4.8, isSale: true },
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                // Use backend data if available, or merge with mocks for layout
                setProducts(data.length > 0 ? data.slice(0, 4) : MOCK_PRODUCTS);
            } catch (error) {
                console.warn("Backend unavailable. Loading mock products for showcase.", error);
                setErrorMsg('Backend connection failed. Displaying offline showcase items.');
                setProducts(MOCK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                            <Link to="/product/m1" className="btn-primary">Shop Now</Link>
                            <Link to="/about" className="bg-white text-gray-900 font-medium rounded-full px-6 py-2.5 hover:bg-gray-50 transition-colors shadow-sm">Our Story</Link>
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
                    <Link to="/categories" className="text-[var(--color-brand)] font-medium hover:underline flex items-center gap-1">
                        View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {MOCK_CATEGORIES.map((cat) => (
                        <Link key={cat.name} to={`/category/${cat.name.toLowerCase()}`} className="group block">
                            <div className="rounded-2xl overflow-hidden bg-gray-100 mb-3 aspect-square relative">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                            <p className="text-sm text-gray-500">{cat.desc}</p>
                        </Link>
                    ))}
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
                                        <span className="text-lg font-bold text-[var(--color-brand)]">${product.price.toFixed(2)}</span>
                                        {product.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
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
                    <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 relative z-10 bg-white p-1 rounded-full shadow-sm border border-gray-100">
                        <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent border-none px-6 py-3 focus:outline-none text-gray-700" />
                        <button type="submit" className="btn-primary whitespace-nowrap" onClick={(e) => e.preventDefault()}>Subscribe</button>
                    </form>
                    <p className="text-xs text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>

            {/* Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <svg className="w-6 h-6 text-[var(--color-brand)]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fillOpacity="0" />
                                <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l6 4.5v9H6v-9l6-4.5z" />
                            </svg>
                            <span className="text-xl font-bold text-gray-900">Artisan's Corner</span>
                        </Link>
                        <p className="text-gray-500 text-sm mb-6">Connecting you with independent creators and unique handmade treasures from around the globe.</p>
                        <div className="flex gap-4">
                            <button className="text-gray-400 hover:text-gray-900"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg></button>
                            <button className="text-gray-400 hover:text-gray-900"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.72 0 5.22.46 7.05 1.25.96.42 1.45 1.5 1.2 2.5l-1.07 4.28c-.18.73-.87 1.22-1.63 1.18l-3.32-.17c-1.12-.06-1.92.85-1.92 1.97v4c0 1.27-.85 2.37-2.09 2.58l-3.08.51c-.68.11-1.3-.26-1.54-.91L4.31 16.5c-.52-1.42 1.05-2.6 2.3-1.66l1.39 1.04v-3.41c0-2.3 1.52-4.32 3.73-4.83l3.24-.74c1.17-.27 1.83-1.48 1.4-2.6L15.65 2.5C14.52 2.18 13.28 2 12 2Z" fillOpacity="0" /><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg></button>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link to="/shop" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Gift Cards</Link></li>
                            <li><Link to="/sitemap" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Sitemap</Link></li>
                            <li><Link to="/blog" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Artisan Blog</Link></li>
                            <li><Link to="/login" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Sell</h4>
                        <ul className="space-y-3">
                            <li><Link to="/sell" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Sell on Artisan</Link></li>
                            <li><Link to="/teams" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Teams</Link></li>
                            <li><Link to="/forums" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Forums</Link></li>
                            <li><Link to="/affiliates" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Affiliates</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">About</h4>
                        <ul className="space-y-3">
                            <li><Link to="/story" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Our Story</Link></li>
                            <li><Link to="/careers" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Careers</Link></li>
                            <li><Link to="/press" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Press</Link></li>
                            <li><Link to="/impact" className="text-gray-500 hover:text-[var(--color-brand)] text-sm">Impact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-gray-100">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 Artisan's Corner, Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-gray-500 hover:text-gray-900 text-sm">Privacy</Link>
                        <Link to="/terms" className="text-gray-500 hover:text-gray-900 text-sm">Terms</Link>
                        <Link to="/cookies" className="text-gray-500 hover:text-gray-900 text-sm">Cookies</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
