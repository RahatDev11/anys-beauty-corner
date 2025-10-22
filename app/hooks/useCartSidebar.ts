// hooks/useCartSidebar.ts - WORKING VERSION
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        console.log('🛒 Opening cart sidebar');
        setIsOpen(true);
        // Body scroll lock
        document.body.style.overflow = 'hidden';
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🛒 Closing cart sidebar');
        setIsOpen(false);
        // Restore scroll
        document.body.style.overflow = 'unset';
    }, []);

    // ✅ Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const cartOverlay = document.querySelector('.cart-sidebar-overlay');
            if (cartOverlay && cartOverlay.contains(event.target as Node)) {
                console.log('🎯 Clicked outside - closing cart');
                closeCartSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, closeCartSidebar]);

    // ✅ Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                closeCartSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, closeCartSidebar]);

    return {
        isOpen,
        openCartSidebar,
        closeCartSidebar
    };
};