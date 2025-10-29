// app/hooks/useCartSidebar.ts - FIXED VERSION
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Opening cart sidebar');
        setIsOpen(true);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Closing cart sidebar');
        setIsOpen(false);
        // Restore body scroll
        document.body.style.overflow = 'unset';
    }, []);

    const toggleCartSidebar = useCallback(() => {
        if (isOpen) {
            closeCartSidebar();
        } else {
            openCartSidebar();
        }
    }, [isOpen, openCartSidebar, closeCartSidebar]);

    // ✅ বাইরে ক্লিক করলে বন্ধ হওয়ার ফাংশন (Fixed)
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.cart-sidebar-overlay');

        // শুধু overlay এ ক্লিক করলে বন্ধ করুন
        if (overlay && overlay.contains(event.target as Node)) {
            closeCartSidebar();
        }
    }, [closeCartSidebar]);

    // ✅ ESC key press করলে বন্ধ হওয়ার ফাংশন
    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
            closeCartSidebar();
        }
    }, [isOpen, closeCartSidebar]);

    // ✅ Event listeners যোগ করুন
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            
            // Responsive height management
            const updateSidebarHeight = () => {
                const cartSidebar = document.querySelector('.cart-sidebar') as HTMLElement;
                const overlay = document.querySelector('.cart-sidebar-overlay') as HTMLElement;

                if (cartSidebar) {
                    cartSidebar.style.height = `${window.innerHeight}px`;
                }
                if (overlay) {
                    overlay.style.height = `${window.innerHeight}px`;
                }
            };

            // প্রথমবার এবং resize এ update করুন
            updateSidebarHeight();
            window.addEventListener('resize', updateSidebarHeight);

            return () => {
                window.removeEventListener('resize', updateSidebarHeight);
            };
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }, [isOpen, handleClickOutside, handleEscapeKey]);

    // ✅ Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [handleClickOutside, handleEscapeKey]);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};