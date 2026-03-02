import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const MOCK_PRODUCTS = [
    { _id: 'm1', title: 'Handcrafted Ceramic Vase', description: 'A beautiful, minimalist ceramic vase perfectly fired to complement modern dark aesthetics.', price: 65.00, images: ['https://placehold.co/600x600/1c1c1e/ffffff?text=Ceramic+Vase'], vendor: { name: 'Luna Ceramics', storeProfile: { storeName: 'Luna Ceramics' } }, category: 'Home Decor', stock: 12 },
    { _id: 'm2', title: 'Woven Cotton Throw', description: 'Cozy and stylish woven throw blanket made from 100% organic cotton.', price: 120.00, images: ['https://placehold.co/600x600/1c1c1e/ffffff?text=Woven+Throw'], vendor: { name: 'Thread & Needle', storeProfile: { storeName: 'Thread & Needle' } }, category: 'Bedding', stock: 5 },
    { _id: 'm3', title: 'Minimalist Desk Lamp', description: 'Matte black minimalist desk lamp providing warm accent lighting.', price: 89.99, images: ['https://placehold.co/600x600/1c1c1e/ffffff?text=Desk+Lamp'], vendor: { name: 'Lumina', storeProfile: { storeName: 'Lumina Design' } }, category: 'Lighting', stock: 8 },
    { _id: 'm4', title: 'Artisan Coffee Set', description: 'Pour-over coffee set featuring a glass carafe and precise aesthetic dripper.', price: 55.00, images: ['https://placehold.co/600x600/1c1c1e/ffffff?text=Coffee+Set'], vendor: { name: 'Brew Masters', storeProfile: { storeName: 'Brew Masters' } }, category: 'Kitchen', stock: 20 },
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
                setProducts(data);
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
        e.preventDefault(); // Prevent link trigger
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
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-[#2c2c2e] rounded-full mb-4"></div>
                    <div className="text-gray-500 font-medium">Loading collection...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-black min-h-screen">

            {errorMsg && (
                <div className="mb-8 p-4 bg-orange-900/20 border border-orange-500/30 rounded-2xl flex items-center justify-center">
                    <svg className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-orange-400 text-sm font-medium">{errorMsg}</span>
                </div>
            )}

            <div className="text-center mb-20 mt-10">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
                    Discover Unique. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a84ff] to-[#5efc82]">Support Artisans.</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light">
                    Curated marketplace featuring independent creators. Find products that tell a story.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className="group block">
                        <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden transition-all duration-300 hover:bg-[#2c2c2e] hover:shadow-2xl hover:-translate-y-1 hover:shadow-blue-500/10 border border-[#2c2c2e]/50">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-[#2c2c2e]">
                                <img
                                    src={product.images[0]?.startsWith('http') ? product.images[0] : 'https://placehold.co/400x400/2c2c2e/ffffff'}
                                    alt={product.title}
                                    className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-white truncate tracking-tight">
                                    {product.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-400 line-clamp-1">{product.category}</p>

                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-xl font-medium text-white tracking-tight">${product.price.toFixed(2)}</span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="flex justify-center items-center w-10 h-10 bg-[#38383a] group-hover:bg-[#0a84ff] text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#0a84ff]"
                                        aria-label="Add to cart"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
