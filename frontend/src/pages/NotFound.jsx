import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-[var(--color-background-soft)] flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-[#f0f9ff] text-[#0ea5e9] p-4 rounded-full mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Oops! The page you're looking for doesn't exist. It might have been moved or removed.
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Return Home
            </Link>
        </div>
    );
};

export default NotFound;
