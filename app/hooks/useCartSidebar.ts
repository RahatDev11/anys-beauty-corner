// app/hooks/useCartSidebar.ts - UPDATED VERSION WITH CLICK OUTSIDE & RESPONSIVE
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: openCartSidebar called');

        setIsOpen(true);
        document.body.classList.add('overflow-hidden');

        // ✅ DOM manipulation যোগ করুন
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.cart-sidebar-overlay');

        console.log('🔍 DOM Elements - Sidebar:', cartSidebar, 'Overlay:', overlay);

        if (cartSidebar) {
            cartSidebar.classList.add('open');
            console.log('✅ Added "open" class to cart-sidebar');
        } else {
            console.error('❌ cart-sidebar element not found');
        }

        if (overlay) {
            overlay.classList.add('active');
            console.log('✅ Added "active" class to overlay');
        } else {
            console.error('❌ cart-sidebar-overlay element not found');
        }
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: closeCartSidebar called');

        setIsOpen(false);
        document.body.classList.remove('overflow-hidden');

        // ✅ DOM manipulation যোগ করুন
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.cart-sidebar-overlay');

        if (cartSidebar) {
            cartSidebar.classList.remove('open');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }, []);

    const toggleCartSidebar = useCallback(() => {
        setIsOpen(prev => {
            const newState = !prev;
            const cartSidebar = document.querySelector('.cart-sidebar');
            const overlay = document.querySelector('.cart-sidebar-overlay');

            if (newState) {
                document.body.classList.add('overflow-hidden');
                if (cartSidebar) cartSidebar.classList.add('open');
                if (overlay) overlay.classList.add('active');
            } else {
                document.body.classList.remove('overflow-hidden');
                if (cartSidebar) cartSidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
            }
            return newState;
        });
    }, []);

    // ✅ বাইরে ক্লিক করলে বন্ধ হওয়ার ফাংশন
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.cart-sidebar-overlay');
        
        if (cartSidebar && 
            overlay && 
            !cartSidebar.contains(event.target as Node) && 
            overlay.contains(event.target as Node)) {
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
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, handleClickOutside, handleEscapeKey]);

    // ✅ Responsive height management
    useEffect(() => {
        const updateSidebarHeight = () => {
            const cartSidebar = document.querySelector('.cart-sidebar') as HTMLElement;
            const overlay = document.querySelector('.cart-sidebar-overlay') as HTMLElement;
            
            if (cartSidebar && overlay) {
                // Viewport height অনুযায়ী সাইডবারের height সেট করুন
                const viewportHeight = window.innerHeight;
                cartSidebar.style.height = `${viewportHeight}px`;
                overlay.style.height = `${viewportHeight}px`;
            }
        };

        if (isOpen) {
            // প্রথমবার এবং resize এ update করুন
            updateSidebarHeight();
            window.addEventListener('resize', updateSidebarHeight);
        }

        return () => {
            window.removeEventListener('resize', updateSidebarHeight);
        };
    }, [isOpen]);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};