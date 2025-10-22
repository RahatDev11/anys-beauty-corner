// app/hooks/useCartSidebar.ts - COMPLETE VERSION
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // ✅ Open cart sidebar with animation
    const openCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Opening cart sidebar');
        
        setIsAnimating(true);
        setIsOpen(true);
        
        // Body scroll lock
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = 'calc(100vw - 100%)'; // Prevent layout shift
        
        // Add backdrop filter to main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.classList.add('sidebar-open');
        }

        // Animation complete
        setTimeout(() => {
            setIsAnimating(false);
            console.log('✅ Cart sidebar animation complete');
        }, 300);
    }, []);

    // ✅ Close cart sidebar with animation
    const closeCartSidebar = useCallback(() => {
        console.log('🎯 useCartSidebar: Closing cart sidebar');
        
        setIsAnimating(true);
        
        // Remove backdrop filter from main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.classList.remove('sidebar-open');
        }

        // Animation complete
        setTimeout(() => {
            setIsOpen(false);
            setIsAnimating(false);
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            console.log('✅ Cart sidebar closed completely');
        }, 250);
    }, []);

    // ✅ Toggle cart sidebar
    const toggleCartSidebar = useCallback(() => {
        if (isOpen) {
            closeCartSidebar();
        } else {
            openCartSidebar();
        }
    }, [isOpen, openCartSidebar, closeCartSidebar]);

    // ✅ Handle click outside
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const sidebar = sidebarRef.current;
        const overlay = overlayRef.current;
        
        if (!sidebar || !overlay) return;

        // Check if click is on overlay (not sidebar)
        const isOverlayClick = overlay.contains(event.target as Node);
        const isSidebarClick = sidebar.contains(event.target as Node);
        
        if (isOverlayClick && !isSidebarClick && !isAnimating) {
            console.log('🖱️ Click outside detected, closing sidebar');
            closeCartSidebar();
        }
    }, [closeCartSidebar, isAnimating]);

    // ✅ Handle escape key
    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen && !isAnimating) {
            console.log('⌨️ Escape key pressed, closing sidebar');
            closeCartSidebar();
        }
    }, [isOpen, isAnimating, closeCartSidebar]);

    // ✅ Handle swipe to close on mobile
    const handleTouchStart = useCallback((event: TouchEvent) => {
        if (!isOpen) return;
        
        const touchStartX = event.touches[0].clientX;
        const sidebar = sidebarRef.current;
        
        if (!sidebar) return;

        const handleTouchMove = (moveEvent: TouchEvent) => {
            const touchCurrentX = moveEvent.touches[0].clientX;
            const diffX = touchCurrentX - touchStartX;
            
            // Swipe right to close
            if (diffX > 50) {
                closeCartSidebar();
                document.removeEventListener('touchmove', handleTouchMove);
            }
        };

        document.addEventListener('touchmove', handleTouchMove);
        
        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
        
        document.addEventListener('touchend', handleTouchEnd);
    }, [isOpen, closeCartSidebar]);

    // ✅ Event listeners setup
    useEffect(() => {
        if (isOpen) {
            console.log('🔔 Adding event listeners for cart sidebar');
            
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            document.addEventListener('touchstart', handleTouchStart);
            
            // Focus trap for accessibility
            const sidebar = sidebarRef.current;
            if (sidebar) {
                const focusableElements = sidebar.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    (focusableElements[0] as HTMLElement).focus();
                }
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('touchstart', handleTouchStart);
        };
    }, [isOpen, handleClickOutside, handleEscapeKey, handleTouchStart]);

    // ✅ Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('🧹 Cleaning up cart sidebar');
            
            // Restore body styles
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            // Remove main content classes
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.classList.remove('sidebar-open');
            }
            
            // Remove all event listeners
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('touchstart', handleTouchStart);
        };
    }, [handleClickOutside, handleEscapeKey, handleTouchStart]);

    // ✅ Responsive height management
    useEffect(() => {
        const updateHeights = () => {
            const sidebar = sidebarRef.current;
            const overlay = overlayRef.current;
            
            if (sidebar && overlay) {
                const viewportHeight = window.innerHeight;
                sidebar.style.height = `${viewportHeight}px`;
                overlay.style.height = `${viewportHeight}px`;
            }
        };

        if (isOpen) {
            updateHeights();
            window.addEventListener('resize', updateHeights);
            
            // Update on orientation change
            window.addEventListener('orientationchange', updateHeights);
        }

        return () => {
            window.removeEventListener('resize', updateHeights);
            window.removeEventListener('orientationchange', updateHeights);
        };
    }, [isOpen]);

    return { 
        isOpen,
        isAnimating,
        sidebarRef,
        overlayRef,
        openCartSidebar, 
        closeCartSidebar,
        toggleCartSidebar 
    };
};