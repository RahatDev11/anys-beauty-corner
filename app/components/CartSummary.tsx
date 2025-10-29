// components/CartSummary.tsx - COMPLETELY FIXED VERSION
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

    const handleViewCart = (event: React.MouseEvent) => {
        event.stopPropagation(); // ✅ Important: Prevent event bubbling
        console.log('🔄 CartSummary: কার্ড দেখুন বাটনে ক্লিক হয়েছে');

        try {
            // ✅ সরাসরি openCartSidebar কল করুন
            if (openCartSidebar) {
                console.log('✅ openCartSidebar ফাংশন call করা হচ্ছে...');
                openCartSidebar();
            } else {
                console.error('❌ openCartSidebar ফাংশন available নেই');
                // ✅ Emergency fallback - direct DOM manipulation
                const cartSidebar = document.getElementById('cartSidebar');
                const overlay = document.querySelector('.cart-sidebar-overlay');
                
                if (cartSidebar) {
                    cartSidebar.classList.add('translate-x-0');
                    cartSidebar.classList.remove('translate-x-full');
                }
                if (overlay) {
                    overlay.classList.remove('hidden');
                }
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('❌ CartSummary error:', error);
            // ✅ Final fallback
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                cartSidebar.style.transform = 'translateX(0)';
            }
        }
    };

    const handleCheckout = (event: React.MouseEvent) => {
        event.stopPropagation();
        router.push('/order-form');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-40">
            <div className="container mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-lipstick text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="font-bold text-lg">{totalItems}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600">মোট মূল্য</span>
                            <span className="text-md font-semibold text-gray-800">
                                {totalPrice.toFixed(2)} টাকা
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleViewCart}
                            className="px-4 py-2 border border-lipstick text-lipstick rounded-lg font-semibold hover:bg-lipstick hover:text-white transition-colors duration-200 text-sm"
                        >
                            কার্ট দেখুন
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-4 py-2 bg-lipstick text-white rounded-lg font-semibold hover:bg-lipstick-dark transition-colors duration-200 text-sm"
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