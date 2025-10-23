// components/CartSummary.tsx - COMPACT VERSION
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';

const CartSummary: React.FC = () => {
    const { totalItems, totalPrice, buyNow, openCartSidebar } = useCart();

    if (totalItems === 0) {
        return null;
    }

    const handleViewCart = () => {
        console.log('🔄 CartSummary: কার্ড দেখুন বাটনে ক্লিক হয়েছে');
        openCartSidebar();
    };

    const handleCheckout = () => {
        buyNow();
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-30">
            <div className="container mx-auto px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="bg-lipstick text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="font-bold text-sm">{totalItems}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                            {totalPrice.toFixed(2)} টাকা
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleViewCart}
                            className="px-3 py-1.5 border border-lipstick text-lipstick rounded font-semibold hover:bg-lipstick hover:text-white transition-colors text-xs"
                        >
                            কার্ড দেখুন
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-3 py-1.5 bg-lipstick text-white rounded font-semibold hover:bg-lipstick-dark transition-colors text-xs"
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