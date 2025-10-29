// app/hooks/useCartSidebar.ts - SIMPLE AND WORKING VERSION
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Opening cart sidebar - STATE WILL UPDATE');
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Closing cart sidebar - STATE WILL UPDATE');
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    }, []);

    const toggleCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Toggling cart sidebar');
        setIsOpen(prev => !prev);
    }, []);

    // Simple and effective - no complex event listeners
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeCartSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, closeCartSidebar]);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};