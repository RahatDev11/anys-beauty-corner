// app/hooks/useCartSidebar.ts
import { create } from 'zustand';

interface CartSidebarState {
    isOpen: boolean;
    openCartSidebar: () => void;
    closeCartSidebar: () => void;
    toggleCartSidebar: () => void;
}

export const useCartSidebar = create<CartSidebarState>((set) => ({
    isOpen: false,
    openCartSidebar: () => {
        set({ isOpen: true });
        document.body.classList.add('overflow-hidden');
    },
    closeCartSidebar: () => {
        set({ isOpen: false });
        document.body.classList.remove('overflow-hidden');
    },
    toggleCartSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));