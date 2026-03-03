import React from 'react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => {
                const isSuccess = toast.type === 'success';
                const isError = toast.type === 'error';

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center p-4 min-w-[300px] rounded-2xl shadow-xl transform transition-all animate-fade-in border ${isSuccess ? 'bg-[#f4fdf4] border-[#d1f4d1]' :
                                isError ? 'bg-[#fff5f5] border-[#fde2e2]' :
                                    'bg-[#f0f9ff] border-[#e0f2fe]'
                            }`}
                        role="alert"
                    >
                        <div className="mr-4 flex-shrink-0">
                            {isSuccess && (
                                <div className="w-8 h-8 rounded-full bg-[#10b981]/15 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            {isError && (
                                <div className="w-8 h-8 rounded-full bg-[#ef4444]/15 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#ef4444]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            {!isSuccess && !isError && (
                                <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/15 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-sm font-semibold ${isSuccess ? 'text-[#065f46]' : isError ? 'text-[#991b1b]' : 'text-[#075985]'}`}>
                                {isSuccess ? 'Success' : isError ? 'Error' : 'Notification'}
                            </h3>
                            <div className={`mt-0.5 text-sm ${isSuccess ? 'text-[#047857]' : isError ? 'text-[#b91c1c]' : 'text-[#0369a1]'}`}>
                                {toast.message}
                            </div>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className={`ml-4 rounded-full p-1.5 transition-colors flex-shrink-0 ${isSuccess ? 'text-[#047857] hover:bg-[#10b981]/20' :
                                    isError ? 'text-[#b91c1c] hover:bg-[#ef4444]/20' :
                                        'text-[#0369a1] hover:bg-[#0ea5e9]/20'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Toast;
