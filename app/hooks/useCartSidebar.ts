// app/hooks/useCartSidebar.ts - OPTIMIZED VERSION
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Opening cart sidebar');
        setIsOpen(true);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '0px'; // Scrollbar compensation
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Closing cart sidebar');
        setIsOpen(false);
        // Restore body scroll
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = '0px';
    }, []);

    const toggleCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Toggling cart sidebar');
        setIsOpen(prev => !prev);
    }, []);

    // ✅ Handle outside click
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.querySelector('.cart-sidebar-overlay');
        
        // Check if click is on overlay or outside sidebar
        if (overlay && overlay.contains(event.target as Node)) {
            closeCartSidebar();
        }
        
        // Additional check for clicks outside the sidebar
        if (cartSidebar && !cartSidebar.contains(event.target as Node) && 
            !(event.target as Element).closest('.cart-trigger')) {
            closeCartSidebar();
        }
    }, [closeCartSidebar]);

    // ✅ Handle escape key
    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
            closeCartSidebar();
        }
    }, [isOpen, closeCartSidebar]);

    // ✅ Handle body scroll and event listeners
    useEffect(() => {
        if (isOpen) {
            // Add event listeners
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            
            // Update heights for mobile
            const updateHeights = () => {
                const cartSidebar = document.getElementById('cartSidebar');
                const overlay = document.querySelector('.cart-sidebar-overlay') as HTMLElement;
                
                if (cartSidebar) {
                    cartSidebar.style.height = `${window.innerHeight}px`;
                }
                if (overlay) {
                    overlay.style.height = `${window.innerHeight}px`;
                }
            };
            
            updateHeights();
            window.addEventListener('resize', updateHeights);
            
            return () => {
                window.removeEventListener('resize', updateHeights);
            };
        } else {
            // Remove event listeners when closed
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }, [isOpen, handleClickOutside, handleEscapeKey]);

    // ✅ Global cleanup
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
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