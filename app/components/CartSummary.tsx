// components/CartSummary.tsx - FIXED VERSION
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';

const CartSummary: React.FC = () => {
    const { totalItems, totalPrice, buyNow, openCartSidebar } = useCart();

    // Debug
    React.useEffect(() => {
        console.log('🔍 CartSummary: openCartSidebar available?', !!openCartSidebar);
    }, [openCartSidebar]);

    if (totalItems === 0) {
        return null;
    }

    const handleViewCart = () => {
        console.log('🔄 CartSummary: কার্ড দেখুন বাটনে ক্লিক হয়েছে');
        console.log('🔍 openCartSidebar function:', openCartSidebar);
        
        if (openCartSidebar && typeof openCartSidebar === 'function') {
            openCartSidebar();
        } else {
            console.error('❌ openCartSidebar unavailable, using direct method');
            // Direct fallback
            const event = new CustomEvent('openCartSidebar');
            window.dispatchEvent(event);
        }
    };

    const handleCheckout = () => {
        buyNow();
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-30">
            <div className="container mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-lipstick text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="font-bold text-lg">{totalItems}</span>
                        </div>
                        <span className="text-md font-semibold text-gray-800">
                            {totalPrice.toFixed(2)} টাকা
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
                            অর্ডার করুন ({totalItems})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;