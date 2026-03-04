import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [activeTab, setActiveTab] = useState('Description');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`https://artisans-backend-9zxt.onrender.com/api/products/${id}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
            } catch (error) {
                console.error("Backend unavailable. Unable to fetch product detail.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        dispatch(addToCart({
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: qty,
            image: product.images[0],
            vendor: product.vendor?._id || product.vendor?.name || 'mock_vendor',
        }));
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center h-[calc(100vh-64px)] bg-[var(--color-background-soft)]">
                <div className="animate-pulse h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="text-gray-500 font-medium">Loading product...</div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="bg-[var(--color-background-soft)] min-h-screen pb-20">
            {/* Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 bg-white">
                <nav className="flex text-sm text-gray-500 space-x-2">
                    <Link to="/" className="hover:text-gray-900">Home</Link>
                    <span>/</span>
                    <Link to="/" className="hover:text-gray-900">{product.category}</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate">{product.title}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
                <div className="flex flex-col lg:flex-row gap-12 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">

                    {/* Left: Images */}
                    <div className="lg:w-1/2 flex flex-col gap-4">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/5] cursor-zoom-in">
                            {product.oldPrice && (
                                <span className="absolute top-4 left-4 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10">BEST SELLER</span>
                            )}
                            <button className="absolute bottom-4 right-4 bg-white/80 p-2.5 rounded-full z-10 hover:bg-white shadow">
                                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                            </button>
                            <img
                                src={mainImage?.startsWith('http') ? mainImage : 'https://placehold.co/800x800/f3f4f6/a1a1aa'}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[...product.images, ...Array(Math.max(0, 4 - (product.images?.length || 0))).fill('https://placehold.co/200x200/f3f4f6/a1a1aa')].slice(0, 4).map((img, i) => (
                                <div key={i} onClick={() => setMainImage(img)} className={`rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-colors ${mainImage === img ? 'border-[var(--color-brand)]' : 'border-transparent'}`}>
                                    <img src={img?.startsWith('http') ? img : 'https://placehold.co/200x200/f3f4f6/a1a1aa'} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="lg:w-1/2 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-[var(--color-brand)] flex items-center gap-1">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fillOpacity="0" /><path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l6 4.5v9H6v-9l6-4.5z" /></svg>
                                    {product.vendor?.storeProfile?.storeName || product.vendor?.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {'★★★★★'.split('').map((s, i) => <span key={i} className={`text-sm ${i < Math.floor(product.ratingsAverage || product.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}>{s}</span>)}
                                <span className="text-xs text-gray-500 ml-1">({product.reviews?.length || 0} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                            {(product.description || "").split('\n')[0]}
                        </p>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-4xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">₹{product.oldPrice.toFixed(2)}</span>
                                    <span className="text-sm font-bold text-[var(--color-brand)] bg-[#bcf0a3]/30 px-2 py-0.5 rounded">SAVE {Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
                                </>
                            )}
                        </div>

                        {product.stock > 0 && (
                            <div className="mb-8">
                                <p className="text-sm font-medium text-[var(--color-brand)] flex items-center gap-1.5 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand)]"></span> In Stock - Ships within 24 hours
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center h-12 bg-white border border-gray-200 rounded-full px-2 w-full sm:w-32 justify-between">
                                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 text-xl font-light">−</button>
                                        <span className="font-medium text-gray-900">{qty}</span>
                                        <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 text-xl font-light">+</button>
                                    </div>
                                    <button onClick={handleAddToCart} className="flex-1 h-12 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-semibold rounded-full shadow-sm transition-colors tracking-wide">
                                        Add to Cart
                                    </button>
                                    <button className="h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                    </button>
                                </div>
                                <button className="w-full h-12 mt-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full shadow-sm transition-colors tracking-wide">
                                    Buy Now
                                </button>
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-6 mt-2 space-y-4">
                            <button className="w-full flex justify-between items-center text-left hover:text-[var(--color-brand)] transition-colors">
                                <span className="flex items-center gap-3 font-medium text-gray-900"><svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> Shipping & Delivery</span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <button className="w-full flex justify-between items-center text-left hover:text-[var(--color-brand)] transition-colors">
                                <span className="flex items-center gap-3 font-medium text-gray-900"><svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3M16 15v1a4 4 0 01-4 4H8" /></svg> Returns & Exchanges</span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <button className="w-full flex justify-between items-center text-left hover:text-[var(--color-brand)] transition-colors">
                                <span className="flex items-center gap-3 font-medium text-gray-900"><svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> Materials & Care</span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lower Section Tabs */}
                <div className="mt-8 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {['Description', 'Reviews', 'About the Artisan'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                    ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab} {tab === 'Reviews' && <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{product.reviews?.length || 0}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="py-8">
                    {activeTab === 'Description' && (
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-2/3">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Product Specifications</h3>
                                <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                                    {product.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                                        <div className="p-2 bg-[#f4fdf4] rounded-lg text-[var(--color-brand)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Category</h4>
                                            <p className="text-sm text-gray-500">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                                        <div className="p-2 bg-[#f4fdf4] rounded-lg text-[var(--color-brand)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Availability</h4>
                                            <p className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                                        <div className="p-2 bg-[#f4fdf4] rounded-lg text-[var(--color-brand)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Listed On</h4>
                                            <p className="text-sm text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                                        <div className="p-2 bg-[#f4fdf4] rounded-lg text-[var(--color-brand)]">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Artisan</h4>
                                            <p className="text-sm text-gray-500">{product.vendor?.storeProfile?.storeName || product.vendor?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/3">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Summary</h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-5xl font-black text-gray-900">{product.ratingsAverage ? product.ratingsAverage.toFixed(1) : (product.rating || 0).toFixed(1)}</span>
                                        <div>
                                            <div className="flex text-yellow-400 mb-1 text-sm">
                                                {'★★★★★'.split('').map((s, i) => <span key={i} className={`text-sm ${i < Math.floor(product.ratingsAverage || product.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}>{s}</span>)}
                                            </div>
                                            <span className="text-xs text-gray-500">Based on {product.reviews?.length || 0} reviews</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-6 text-sm">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = product.reviews?.filter(r => Math.floor(r.rating) === star).length || 0;
                                            const total = product.reviews?.length || 1;
                                            const percent = product.reviews?.length > 0 ? Math.round((count / total) * 100) : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-3">
                                                    <span className="w-2 font-medium text-gray-600">{star}</span>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                    <span className="w-8 text-right text-gray-500 text-xs">{percent}%</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <button className="w-full py-2.5 border-2 border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:border-gray-900 transition-colors">Write a Review</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Reviews' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                            <div className="space-y-8 max-w-4xl">
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map((review, idx) => (
                                        <div key={idx} className="border-b border-gray-100 pb-8">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Customer'}</h4>
                                                        <div className="flex text-yellow-400 text-xs">
                                                            {'★★★★★'.split('').map((s, i) => <span key={i} className={`text-sm ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>{s}</span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-3">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                        <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'About the Artisan' && (
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <img src={product.vendor?.storeProfile?.logo?.startsWith('http') ? product.vendor.storeProfile.logo : "https://ui-avatars.com/api/?name=" + (product.vendor?.storeProfile?.storeName || product.vendor?.name) + "&background=random"} alt="Artisan" className="w-32 h-32 rounded-full object-cover shadow-sm border border-gray-100" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.vendor?.storeProfile?.storeName || product.vendor?.name || 'Earth & Fire Studio'}</h3>
                                <p className="text-sm font-medium text-[var(--color-brand)] mb-3">Independent Creator</p>
                                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                                    {product.vendor?.storeProfile?.description || "This artisan has not added a bio yet. They prefer to let their beautiful handcrafted work speak for itself."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

