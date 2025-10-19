// app/hooks/useCartSidebar.ts - Simple version
'use client';

import { useState, useCallback } from 'react';

// ✅ Named export যোগ করুন
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

    // ✅ আপনার সঠিক লজিক
    const toggleCartSidebar = useCallback(() => {
        setIsOpen(prev => {
            const newState = !prev;
            if (newState) {
                document.body.classList.add('overflow-hidden');
            } else {
                document.body.classList.remove('overflow-hidden');
            }
            return newState;
        });
    }, []);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};

// ❌ এটা থাকলে মুছে দিন
// export default useCartSidebar;