// components/CartSummary.tsx - FINAL VERSION
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { useCartSidebar } from '@/app/hooks/useCartSidebar'; // ✅ সঠিক hook import

const CartSummary: React.FC = () => {
    const { totalItems, totalPrice } = useCart();
    const router = useRouter();
    const { openCartSidebar } = useCartSidebar(); // ✅ hook use করুন

    if (totalItems === 0) {
        return null;
    }

    const handleViewCart = () => {
        openCartSidebar(); // ✅ এই ফাংশন কার্ট সাইডবার ওপেন করবে
    };

    const handleCheckout = () => {
        router.push('/order-form');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
            <div className="container mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between">
                    {/* Left side - সংখ্যা এবং price */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-lipstick text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="font-bold text-lg">{totalItems}</span>
                        </div>
                        <span className="text-md font-semibold text-gray-800">
                            {totalPrice} টাকা
                        </span>
                    </div>

                    {/* Right side - Buttons */}
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