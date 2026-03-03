import React from 'react';
import { Link } from 'react-router-dom';

const ServerError = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-[var(--color-background-soft)] flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-red-50 text-red-500 p-4 rounded-full mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight">500</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Internal Server Error</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Something went critically wrong on our end. Our developers have been notified. Please try again later.
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Try Again
            </Link>
        </div>
    );
};

export default ServerError;
