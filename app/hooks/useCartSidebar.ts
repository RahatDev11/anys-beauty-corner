// app/hooks/useCartSidebar.ts - SIMPLIFIED WORKING VERSION
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const openCartSidebar = useCallback(() => {
        console.log('🔄 Opening cart sidebar');
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeCartSidebar = useCallback(() => {
        console.log('🔄 Closing cart sidebar');
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    }, []);

    // ✅ বাইরে ক্লিক করলে বন্ধ হওয়ার ফাংশন
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        console.log('🖱️ Click detected:', {
            target: event.target,
            sidebar: sidebar,
            overlay: overlay,
            isOverlayClick: overlay?.contains(event.target as Node),
            isSidebarClick: sidebar?.contains(event.target as Node)
        });

        // শুধু overlay এ ক্লিক করলে ক্লোজ করুন
        if (overlay && overlay.contains(event.target as Node)) {
            console.log('✅ Overlay clicked, closing sidebar');
            closeCartSidebar();
        }
    }, [closeCartSidebar]);

    // ✅ ESC key প্রেস করলে বন্ধ হওয়ার ফাংশন
    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
            console.log('⌨️ Escape key pressed, closing sidebar');
            closeCartSidebar();
        }
    }, [isOpen, closeCartSidebar]);

    // ✅ Event listeners যোগ করুন
    useEffect(() => {
        if (isOpen) {
            console.log('🎯 Adding event listeners');
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            console.log('🎯 Removing event listeners');
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, handleClickOutside, handleEscapeKey]);

    // ✅ Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return { 
        isOpen, 
        openCartSidebar, 
        closeCartSidebar 
    };
};