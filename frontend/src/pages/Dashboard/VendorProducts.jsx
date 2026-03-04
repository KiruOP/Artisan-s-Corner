import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLayout from './VendorLayout';

const VendorProducts = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('https://artisans-backend-9zxt.onrender.com/api/products/vendor/me', config);
                setProducts(res.data);
            } catch (error) {
                console.error('Failed to fetch vendor products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token]);

    const activeCount = products.filter(p => p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    const filteredProducts = products.filter(p => {
        if (filter === 'active') return p.stock > 0;
        if (filter === 'outOfStock') return p.stock === 0;
        if (filter === 'drafts') return false; // Not implemented yet
        return true; // 'all'
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f8f9fa]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <VendorLayout title="My Products" subtitle="Manage your inventory, pricing, and stock levels.">

            <div className="max-w-7xl mx-auto pt-4">

                <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
                    <div>
                        {/* Title and subtitle are now handled by VendorLayout */}
                    </div>
                    <Link to="/dashboard/products/new" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#49cc2f] hover:bg-[#3fb826] text-white font-bold rounded-full shadow-sm transition-colors w-full sm:w-auto">
                        <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Add New Product
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-6 bg-white border border-gray-100 rounded-full px-2 py-1.5 shadow-sm text-sm font-semibold text-gray-500 overflow-x-auto w-full lg:w-auto">
                        <button onClick={() => setFilter('all')} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#dcfce7] text-green-800' : 'hover:bg-gray-50'}`}>
                            All Products <span className={`${filter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'} text-[10px] px-2 py-0.5 rounded-full`}>{products.length}</span>
                        </button>
                        <button onClick={() => setFilter('active')} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === 'active' ? 'bg-[#dcfce7] text-green-800' : 'hover:bg-gray-50'}`}>
                            Active <span className={`${filter === 'active' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'} text-[10px] px-2 py-0.5 rounded-full`}>{activeCount}</span>
                        </button>
                        <button onClick={() => setFilter('drafts')} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === 'drafts' ? 'bg-[#dcfce7] text-green-800' : 'hover:bg-gray-50'}`}>
                            Drafts <span className={`${filter === 'drafts' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'} text-[10px] px-2 py-0.5 rounded-full`}>0</span>
                        </button>
                        <button onClick={() => setFilter('outOfStock')} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filter === 'outOfStock' ? 'bg-red-100 text-red-800' : 'hover:bg-gray-50 text-red-500'}`}>
                            Out of Stock <span className={`${filter === 'outOfStock' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-600'} text-[10px] px-2 py-0.5 rounded-full`}>{outOfStockCount}</span>
                        </button>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filter
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                            Sort
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest pl-8">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Inventory</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((p, idx) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img src={p.images?.[0] || 'https://placehold.co/100'} alt={p.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm mb-0.5">{p.title}</div>
                                                    <div className="text-xs text-gray-400 font-medium">SKU: ART-{idx + 1}0 • {p.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{p.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${p.stock > 0 ? 'text-gray-900' : 'text-red-500'}`}>{p.stock}</span>
                                            <span className={`text-sm ml-1 ${p.stock > 0 ? 'text-green-600' : 'text-gray-400'}`}>in stock</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.stock > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fbf4] border border-[#dcfce7] text-[#2ecc71] text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71]"></span> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 pr-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-gray-400 hover:text-green-600 p-2 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        <div className="border-t border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm font-medium text-green-600">
                                Showing <span className="font-bold text-gray-900">1-{filteredProducts.length}</span> of <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4ede35] text-white font-bold text-sm">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 font-bold hover:bg-gray-50 text-sm">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 font-bold hover:bg-gray-50 text-sm">3</button>
                                <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </VendorLayout>
    );
};

export default VendorProducts;

