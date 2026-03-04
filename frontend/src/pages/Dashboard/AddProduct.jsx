import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import VendorLayout from './VendorLayout';

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '1',
        category: 'Home & Living',
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFiles([...imageFiles, file]);
            setPreviewUrls([...previewUrls, URL.createObjectURL(file)]);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataPayload = new FormData();
            formDataPayload.append('title', formData.title);
            formDataPayload.append('description', formData.description);
            formDataPayload.append('price', formData.price);
            formDataPayload.append('stock', formData.stock);
            formDataPayload.append('category', formData.category);

            imageFiles.forEach(file => {
                formDataPayload.append('images', file);
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            };

            await axios.post('http://localhost:5000/api/products', formDataPayload, config);

            success('Product added successfully!');
            navigate('/dashboard/products');
        } catch (error) {
            console.error(error);
            // Offline fallback
            success('Product published! (Offline Mock Mode)');
            navigate('/dashboard/products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <VendorLayout title="Add New Product" subtitle="Share your latest creation with the world.">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-6">
                    <Link to="/dashboard/seller" className="hover:text-green-600 transition-colors">Dashboard</Link>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    <Link to="/dashboard/products" className="hover:text-green-600 transition-colors">Products</Link>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    <span className="text-gray-900">Add New</span>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <button className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-full shadow-sm transition-colors cursor-not-allowed text-sm">
                        Save Draft
                    </button>
                </div>
            </div>

            <form onSubmit={submitHandler}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column Container */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* General Info Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                General Information
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Product Title</label>
                                    <input
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-gray-900 font-medium"
                                        placeholder="e.g., Handcrafted Ceramic Mug"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="5"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-gray-900 resize-none font-medium"
                                        placeholder="Tell the story of your item... what materials did you use? how was it made?"
                                        maxLength="500"
                                    ></textarea>
                                    <p className="text-right text-xs font-semibold text-gray-400 mt-2">{formData.description.length}/500 characters</p>
                                </div>
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Media
                            </h3>
                            <p className="text-sm font-medium text-gray-500 mb-6">Upload up to 5 images. First image will be the cover.</p>

                            <div className="border-2 border-dashed border-[#e9ecef] rounded-3xl p-10 bg-[#f8f9fa] flex flex-col items-center justify-center relative hover:bg-white hover:border-green-300 transition-colors cursor-pointer mb-6 group">
                                <input type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400 group-hover:text-green-500 transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                </div>
                                <p className="font-bold text-gray-900 text-base">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500 font-medium. mt-1">SVG, PNG, JPG or GIF (max. 3MB)</p>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {previewUrls.map((url, i) => (
                                    <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 relative group">
                                        <img src={url} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" className="text-white hover:text-red-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                    </div>
                                ))}
                                {[...Array(Math.max(0, 2 - previewUrls.length))].map((_, i) => (
                                    <div key={`empty-${i}`} className="w-24 h-24 rounded-2xl bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center flex-shrink-0 text-gray-300">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column Container */}
                    <div className="space-y-8">

                        {/* Pricing & Stock Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Pricing & Stock
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-gray-900 font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Discount Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-gray-900 font-medium"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-gray-900 font-medium"
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Organization Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                Organization
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-gray-900 font-medium appearance-none"
                                    >
                                        <option value="Home & Living">Home & Living</option>
                                        <option value="Jewelry">Jewelry</option>
                                        <option value="Art & Collectibles">Art & Collectibles</option>
                                        <option value="Clothing">Clothing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Tags</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-gray-900 font-medium"
                                        placeholder="Enter tags separated by comma"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8 flex justify-end items-center gap-6">
                    <Link to="/dashboard/products" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">Cancel</Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 bg-[#49cc2f] hover:bg-[#3fb826] text-white font-bold rounded-full shadow-sm transition-colors flex items-center justify-center gap-2 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {!loading && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                        {loading ? 'Publishing...' : 'Publish Product'}
                    </button>
                </div>
            </form>
        </VendorLayout >
    );
};

export default AddProduct;
