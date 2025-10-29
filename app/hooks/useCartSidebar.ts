// app/hooks/useCartSidebar.ts - COMPLETELY REWRITTEN
'use client';

import { useState, useCallback, useEffect } from 'react';

// ✅ Global variable to track state across components
let globalIsOpen = false;
let listeners: ((isOpen: boolean) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalIsOpen));
};

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(globalIsOpen);

    // ✅ Sync local state with global state
    useEffect(() => {
        const listener = (newIsOpen: boolean) => {
            setIsOpen(newIsOpen);
        };
        
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Opening cart sidebar - GLOBAL STATE');
        globalIsOpen = true;
        notifyListeners();
        document.body.style.overflow = 'hidden';
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Closing cart sidebar - GLOBAL STATE');
        globalIsOpen = false;
        notifyListeners();
        document.body.style.overflow = 'unset';
    }, []);

    const toggleCartSidebar = useCallback(() => {
        if (globalIsOpen) {
            closeCartSidebar();
        } else {
            openCartSidebar();
        }
    }, [openCartSidebar, closeCartSidebar]);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};