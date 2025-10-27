
// app/components/Toast.tsx
'use client';
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    };

    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                setToasts((prevToasts) => prevToasts.slice(1));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-lg shadow-lg text-white flex items-center
                            ${toast.type === 'success' ? 'bg-green-500' : ''}
                            ${toast.type === 'error' ? 'bg-red-500' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500' : ''}
                        `}
                    >
                        <i className={`mr-2 ${toast.type === 'success' ? 'fas fa-check-circle' : ''} ${toast.type === 'error' ? 'fas fa-exclamation-circle' : ''} ${toast.type === 'info' ? 'fas fa-info-circle' : ''}`}></i>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
