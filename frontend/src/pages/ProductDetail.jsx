import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

// Share mocks with Home to ensure direct navigation works during offline testing
const MOCK_PRODUCTS = [
    { _id: 'm1', title: 'Handcrafted Ceramic Vase', description: 'A beautiful, minimalist ceramic vase perfectly fired to complement modern dark aesthetics. Brought to you by the finest artisans with a passion for clay.', price: 65.00, images: ['https://placehold.co/800x800/1c1c1e/ffffff?text=Ceramic+Vase'], vendor: { _id: 'v1', name: 'Luna Ceramics', storeProfile: { storeName: 'Luna Ceramics' } }, category: 'Home Decor', stock: 12 },
    { _id: 'm2', title: 'Woven Cotton Throw', description: 'Cozy and stylish woven throw blanket made from 100% organic cotton. Perfect for accentuating dark furniture.', price: 120.00, images: ['https://placehold.co/800x800/1c1c1e/ffffff?text=Woven+Throw'], vendor: { _id: 'v2', name: 'Thread & Needle', storeProfile: { storeName: 'Thread & Needle' } }, category: 'Bedding', stock: 5 },
    { _id: 'm3', title: 'Minimalist Desk Lamp', description: 'Matte black minimalist desk lamp providing warm accent lighting. Built from premium aluminum.', price: 89.99, images: ['https://placehold.co/800x800/1c1c1e/ffffff?text=Desk+Lamp'], vendor: { _id: 'v3', name: 'Lumina', storeProfile: { storeName: 'Lumina Design' } }, category: 'Lighting', stock: 8 },
    { _id: 'm4', title: 'Artisan Coffee Set', description: 'Pour-over coffee set featuring a glass carafe and precise aesthetic dripper. Elevate your morning routine.', price: 55.00, images: ['https://placehold.co/800x800/1c1c1e/ffffff?text=Coffee+Set'], vendor: { _id: 'v4', name: 'Brew Masters', storeProfile: { storeName: 'Brew Masters' } }, category: 'Kitchen', stock: 20 },
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
                const mockMatch = MOCK_PRODUCTS.find(p => p._id === id);
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
            vendor: product.vendor._id || product.vendor,
        }));
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-black">
                <div className="animate-pulse h-12 w-12 bg-[#2c2c2e] rounded-full"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center mt-32 text-gray-400 bg-black min-h-screen">
                <h2 className="text-2xl font-semibold mb-4 text-white">Product Not Found</h2>
                <p className="mb-8">We couldn't locate the item you're looking for.</p>
                <Link to="/" className="text-[#0a84ff] hover:text-blue-400 transition-colors">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-[calc(100vh-64px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/" className="text-[#0a84ff] hover:text-blue-400 mb-8 inline-flex items-center font-medium transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to browsing
                </Link>

                <div className="bg-[#1c1c1e] rounded-[32px] overflow-hidden flex flex-col lg:flex-row border border-[#2c2c2e]/50 shadow-2xl">
                    <div className="lg:w-1/2 bg-[#000000]/30 p-4 lg:p-12 flex items-center justify-center">
                        <img
                            src={product.images[0]?.startsWith('http') ? product.images[0] : 'https://placehold.co/800x800/1c1c1e/ffffff'}
                            alt={product.title}
                            className="w-full h-auto object-cover rounded-2xl shadow-lg border border-[#2c2c2e]"
                        />
                    </div>

                    <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col">
                        <div className="mb-2">
                            <span className="text-xs font-bold text-[#0a84ff] uppercase tracking-wider">{product.category}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                            {product.title}
                        </h1>

                        <p className="text-3xl font-medium text-gray-200 mb-8">${product.price.toFixed(2)}</p>

                        <div className="prose prose-sm prose-invert text-gray-400 mb-10 max-w-none">
                            <p className="text-base leading-relaxed">{product.description}</p>
                        </div>

                        <div className="mt-auto border-t border-[#38383a] pt-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Artisan</p>
                                    <p className="text-base font-medium text-white">{product.vendor?.storeProfile?.storeName || product.vendor?.name || 'Unknown'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-500">Availability</p>
                                    <p className={`text-base font-medium ${product.stock > 0 ? 'text-[#32d74b]' : 'text-[#ff453a]'}`}>
                                        {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                    </p>
                                </div>
                            </div>

                            {product.stock > 0 && (
                                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                                    <div className="flex items-center h-14 bg-[#2c2c2e] rounded-2xl px-2 w-full sm:w-auto">
                                        <button
                                            onClick={() => setQty(Math.max(1, qty - 1))}
                                            className="w-10 h-10 flex text-gray-400 hover:text-white items-center justify-center rounded-xl hover:bg-[#38383a] transition-colors font-medium text-xl"
                                        >−</button>
                                        <span className="w-12 text-center text-white font-medium">{qty}</span>
                                        <button
                                            onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                            className="w-10 h-10 flex text-gray-400 hover:text-white items-center justify-center rounded-xl hover:bg-[#38383a] transition-colors font-medium text-xl"
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 h-14 bg-[#0a84ff] border border-transparent rounded-2xl shadow-lg shadow-blue-500/20 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1c1c1e] focus:ring-[#0a84ff] transition-all active:scale-[0.98]"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
