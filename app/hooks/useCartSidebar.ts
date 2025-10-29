// app/hooks/useCartSidebar.ts - FIXED VERSION
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isOpenRef = useRef(isOpen);

    // ✅ Sync ref with state
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Opening cart sidebar');
        setIsOpen(true);
        isOpenRef.current = true;
        document.body.style.overflow = 'hidden';
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Closing cart sidebar');
        setIsOpen(false);
        isOpenRef.current = false;
        document.body.style.overflow = 'unset';
    }, []);

    // ✅ Fixed outside click handler
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.querySelector('.cart-sidebar-overlay');
        
        // Check if click is specifically on the overlay
        if (overlay && event.target === overlay) {
            console.log('🎯 Overlay clicked, closing sidebar');
            closeCartSidebar();
            return;
        }

        // Check if click is outside both sidebar and overlay
        if (cartSidebar && !cartSidebar.contains(event.target as Node) && 
            overlay && !overlay.contains(event.target as Node)) {
            console.log('🎯 Outside click, closing sidebar');
            closeCartSidebar();
        }
    }, [closeCartSidebar]);

    // ✅ Handle escape key
    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpenRef.current) {
            console.log('🎯 ESC key pressed, closing sidebar');
            closeCartSidebar();
        }
    }, [closeCartSidebar]);

    // ✅ Event listeners
    useEffect(() => {
        if (isOpen) {
            console.log('🎯 Adding event listeners');
            // Use capture phase to catch events early
            document.addEventListener('mousedown', handleClickOutside, true);
            document.addEventListener('keydown', handleEscapeKey, true);
            
            return () => {
                console.log('🎯 Removing event listeners');
                document.removeEventListener('mousedown', handleClickOutside, true);
                document.removeEventListener('keydown', handleEscapeKey, true);
            };
        }
    }, [isOpen, handleClickOutside, handleEscapeKey]);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar
    };
};