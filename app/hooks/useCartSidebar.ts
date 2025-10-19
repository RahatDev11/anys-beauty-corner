// app/hooks/useCartSidebar.ts - Context API version
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartSidebarContextType {
    isOpen: boolean;
    openCartSidebar: () => void;
    closeCartSidebar: () => void;
    toggleCartSidebar: () => void;
}

const CartSidebarContext = createContext<CartSidebarContextType | undefined>(undefined);

export const CartSidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        setIsOpen(true);
        document.body.classList.add('overflow-hidden');
    }, []);

    const closeCartSidebar = useCallback(() => {
        setIsOpen(false);
        document.body.classList.remove('overflow-hidden');
    }, []);

    const toggleCartSidebar = useCallback(() => {
        setIsOpen(prev => !prev);
        document.body.classList.toggle('overflow-hidden');
    }, []);

    return (
        <CartSidebarContext.Provider value={{ 
            isOpen, 
            openCartSidebar, 
            closeCartSidebar, 
            toggleCartSidebar 
        }}>
            {children}
        </CartSidebarContext.Provider>
    );
};

export const useCartSidebar = () => {
    const context = useContext(CartSidebarContext);
    if (!context) {
        throw new Error('useCartSidebar must be used within a CartSidebarProvider');
    }
    return context;
};