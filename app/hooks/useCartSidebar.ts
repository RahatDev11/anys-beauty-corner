// app/hooks/useCartSidebar.ts - Simple version
'use client';

import { useState, useCallback } from 'react';

export const useCartSidebar = () => {
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

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};