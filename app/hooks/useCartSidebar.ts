// hooks/useCartSidebar.ts - WORKING VERSION
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: openCartSidebar called');
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: closeCartSidebar called');
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    }, []);

    // ESC key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
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