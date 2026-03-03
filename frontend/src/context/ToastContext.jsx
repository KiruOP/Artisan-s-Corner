import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
    const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
    const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, info, toasts }}>
            {children}
        </ToastContext.Provider>
    );
};
