// components/CartSummary.tsx - SUPER SIMPLE VERSION
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

const CartSummary: React.FC = () => {
    const { totalItems, totalPrice } = useCart();
    const router = useRouter();

    if (totalItems === 0) {
        return null;
    }

    const handleViewCart = () => {
        router.push('/cart');
    };

    const handleCheckout = () => {
        router.push('/order-form');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
            <div className="container mx-auto px-3 py-2"> {/* খুব কম padding */}
                <div className="flex items-center justify-between">
                    {/* Left side - শুধু সংখ্যা */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-lipstick text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="font-bold text-sm">{totalItems}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                            {totalPrice}৳
                        </span>
                    </div>

                    {/* Right side - Buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleViewCart}
                            className="px-4 py-1.5 border border-lipstick text-lipstick rounded text-sm font-semibold hover:bg-lipstick hover:text-white transition-colors"
                        >
                            কার্ড
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-4 py-1.5 bg-lipstick text-white rounded text-sm font-semibold hover:bg-lipstick-dark transition-colors"
                        >
                            অর্ডার
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;