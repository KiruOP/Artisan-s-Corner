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
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product", error);
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

    if (loading) return <div className="text-center mt-20">Loading product details...</div>;
    if (!product) return <div className="text-center mt-20 text-red-500">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-medium">
                &larr; Back to Results
            </Link>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                    <img
                        src={product.images[0]?.startsWith('http') ? product.images[0] : 'https://placehold.co/600x600?text=Product'}
                        alt={product.title}
                        className="w-full h-auto object-cover rounded-xl shadow-md"
                    />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{product.title}</h1>
                                <p className="mt-2 text-sm text-gray-500 uppercase tracking-widest font-semibold">{product.category}</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900">Description</h3>
                            <div className="mt-4 prose prose-sm text-gray-500">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Vendor</p>
                                <p className="text-sm text-gray-500">{product.vendor?.storeProfile?.storeName || product.vendor?.name || 'Unknown'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Stock Status</p>
                                <p className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {product.stock > 0 && (
                        <div className="mt-10">
                            <div className="flex items-center mt-4">
                                <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-4">Quantity</label>
                                <select
                                    id="quantity"
                                    className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                >
                                    {[...Array(product.stock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="mt-6 w-full bg-blue-600 border border-transparent rounded-xl shadow-sm py-4 px-8 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
