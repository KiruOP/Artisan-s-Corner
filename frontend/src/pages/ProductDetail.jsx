import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const MOCK_PRODUCTS = [
    { _id: 'm1', title: 'Azure Mist Ceramic Vase', description: 'Hand-thrown stoneware vase featuring our signature Azure Mist glaze. Each piece is unique, showcasing subtle variations in color and texture that tell the story of its creation. Perfect for dried arrangements or fresh blooms.\n\nThe Azure Mist Ceramic Vase is a testament to the beauty of imperfection. Hand-thrown on a potter\'s wheel, this vase undergoes a unique double-glazing process. First, a deep cobalt base is applied, followed by a lighter, milky overglaze that reacts in the kiln to create the misty, ethereal effect.', price: 85.00, oldPrice: 110.00, images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800'], vendor: { _id: 'v1', name: 'Earth & Fire Studio', storeProfile: { storeName: 'Earth & Fire Studio' } }, category: 'Ceramics', rating: 4.8, reviewCount: 128, stock: 12 },
    // ... other mocks can be mapped accordingly
];

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.warn("Backend unavailable. Searching local mocks.");
                const mockMatch = MOCK_PRODUCTS.find(p => p._id === id) || MOCK_PRODUCTS[0];
                if (mockMatch) {
                    setProduct(mockMatch);
                }
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
                    <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-gray-900">{product.category}</Link>
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
                                src={product.images[0]?.startsWith('http') ? product.images[0] : 'https://placehold.co/800x800/f3f4f6/a1a1aa'}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`rounded-xl overflow-hidden aspect-square cursor-pointer border-2 ${i === 1 ? 'border-[var(--color-brand)]' : 'border-transparent'}`}>
                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
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
                                {'★★★★★'.split('').map((s, i) => <span key={i} className={`text-sm ${i < Math.floor(product.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}>{s}</span>)}
                                <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 18} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                            {(product.description || "").split('\n')[0]}
                        </p>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
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
            </div>
        </div>
    );
};

export default ProductDetail;
