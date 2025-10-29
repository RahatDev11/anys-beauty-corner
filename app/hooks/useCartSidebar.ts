// app/hooks/useCartSidebar.ts - FIXED VERSION
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Opening cart sidebar');
        setIsOpen(true);
        // ✅ শুধু body তে একটি class যোগ করুন, overflow hidden নয়
        document.body.classList.add('cart-sidebar-open');
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Closing cart sidebar');
        setIsOpen(false);
        // ✅ class রিমুভ করুন
        document.body.classList.remove('cart-sidebar-open');
    }, []);

    const toggleCartSidebar = useCallback(() => {
        if (isOpen) {
            closeCartSidebar();
        } else {
            openCartSidebar();
        }
    }, [isOpen, openCartSidebar, closeCartSidebar]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.classList.remove('cart-sidebar-open');
        };
    }, []);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};