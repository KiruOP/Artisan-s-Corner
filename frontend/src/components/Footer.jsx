import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span>Made with</span>
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        <span>by <strong>Kiran Biradar</strong></span>
                    </div>

                    <div className="text-xs text-gray-400 flex items-center gap-4">
                        <span>&copy; {currentYear} Artisan's Corner</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <Link to="/" className="hover:text-[var(--color-brand)] transition-colors">Privacy Policy</Link>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <Link to="/" className="hover:text-[var(--color-brand)] transition-colors">Terms of Service</Link>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
