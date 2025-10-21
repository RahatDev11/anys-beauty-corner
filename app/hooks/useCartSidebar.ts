// app/hooks/useCartSidebar.ts - FIXED VERSION
'use client';

import { useState, useCallback } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

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

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar, 
        toggleCartSidebar 
    };
};