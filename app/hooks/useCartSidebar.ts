
// app/hooks/useCartSidebar.ts
import { useState, useCallback } from 'react';

export const useCartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const getScrollbarWidth = () => {
        // This function is for calculating scrollbar width, often used to prevent layout shift
        // when body overflow is hidden. In a modern React app, this might be handled differently
        // or by a CSS framework. For now, a simplified version.
        return 0; // Placeholder
    };

    const openCartSidebar = useCallback(() => {
        setIsOpen(true);
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add('overflow-hidden');
        // Hide social media button if it exists on the page
        // const socialMediaButton = document.getElementById('socialShareButton');
        // if (socialMediaButton) {
        //     socialMediaButton.classList.add('hidden');
        // }
    }, []);

    const closeCartSidebar = useCallback(() => {
        setIsOpen(false);
        document.body.style.paddingRight = '';
        document.body.classList.remove('overflow-hidden');
        // Show social media button if it exists on the page
        // const socialMediaButton = document.getElementById('socialShareButton');
        // if (socialMediaButton) {
        //     socialMediaButton.classList.remove('hidden');
        // }
    }, []);

    return { isOpen, openCartSidebar, closeCartSidebar };
};
