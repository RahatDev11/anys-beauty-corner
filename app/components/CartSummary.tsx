// components/CartSummary.tsx - FIXED VERSION
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { useCartSidebar } from '@/app/hooks/useCartSidebar';

const CartSummary: React.FC = () => {
    const { totalItems, totalPrice } = useCart();
    const router = useRouter();
    const { openCartSidebar } = useCartSidebar();

    if (totalItems === 0) {
        return null;
    }

    const handleViewCart = () => {
        console.log('🔄 CartSummary: কার্ড দেখুন বাটনে ক্লিক হয়েছে');
        
        // ✅ Error handling সহ
        if (openCartSidebar && typeof openCartSidebar === 'function') {
            console.log('✅ openCartSidebar ফাংশন call করা হচ্ছে...');
            openCartSidebar();
            
            // ✅ Fallback: যদি hook কাজ না করে তাহলে direct DOM manipulation
            setTimeout(() => {
                const cartSidebar = document.querySelector('.cart-sidebar');
                const overlay = document.querySelector('.cart-sidebar-overlay');
                
                if (cartSidebar && !cartSidebar.classList.contains('open')) {
                    console.log('🔄 Fallback: Direct DOM manipulation...');
                    cartSidebar.classList.add('open');
                }
                if (overlay && !overlay.classList.contains('active')) {
                    overlay.classList.add('active');
                }
                document.body.classList.add('overflow-hidden');
            }, 100);
        } else {
            console.error('❌ openCartSidebar ফাংশন available নেই');
            // ✅ Emergency fallback
            const cartSidebar = document.querySelector('.cart-sidebar');
            const overlay = document.querySelector('.cart-sidebar-overlay');
            
            if (cartSidebar) cartSidebar.classList.add('open');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('overflow-hidden');
        }
    };

    const handleCheckout = () => {
        router.push('/order-form');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
            <div className="container mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-lipstick text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="font-bold text-lg">{totalItems}</span>
                        </div>
                        <span className="text-md font-semibold text-gray-800">
                            {totalPrice} টাকা
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleViewCart}
                            className="px-4 py-2 border border-lipstick text-lipstick rounded font-semibold hover:bg-lipstick hover:text-white transition-colors text-sm"
                        >
                            কার্ড দেখুন
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-4 py-2 bg-lipstick text-white rounded font-semibold hover:bg-lipstick-dark transition-colors text-sm"
                        >
                            অর্ডার করুন
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;