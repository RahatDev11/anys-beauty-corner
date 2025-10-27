
// app/hooks/useSidebar.ts
import { useState, useCallback } from 'react';

export const useSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openSidebar = useCallback(() => {
        setIsOpen(true);
        // Potentially add logic to hide social media icons if needed
        // document.getElementById('socialIcons')?.classList.add('hidden');
    }, []);

    const closeSidebar = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return { isOpen, openSidebar, closeSidebar, toggleSidebar };
};
