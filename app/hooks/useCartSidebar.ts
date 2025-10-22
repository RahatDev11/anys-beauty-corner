// hooks/useCartSidebar.ts - COMPLETELY NEW VERSION
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        console.log('🛒 Opening cart sidebar');
        setIsOpen(true);
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🛒 Closing cart sidebar');
        setIsOpen(false);
    }, []);

    // ESC key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeCartSidebar();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeCartSidebar]);

    return {
        isOpen,
        openCartSidebar,
        closeCartSidebar
    };
};