// components/CartSummary.tsx - FINAL SIMPLE VERSION
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
        // কার্ড পেজে নিয়ে যাবে
        router.push('/cart');
    };

    const handleCheckout = () => {
        // অর্ডার ফর্মে নিয়ে যাবে
        router.push('/order-form');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
            <div className="container mx-auto px-4 py-3"> {/* padding বাড়ানো */}
                <div className="flex items-center justify-between">
                    {/* Left side - শুধু মোট প্রোডাক্ট সংখ্যা এবং price */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-lipstick text-white rounded-full w-10 h-10 flex items-center justify-center"> {/* বড় সাইজ */}
                            <span className="font-bold text-lg">{totalItems}</span> {/* বড় font */}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-800"> {/* বড় font */}
                                মোট: {totalPrice} টাকা
                            </p>
                            <p className="text-sm text-gray-600">
                                {totalItems}টি প্রোডাক্ট
                            </p>
                        </div>
                    </div>

                    {/* Right side - Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleViewCart}
                            className="px-6 py-2.5 border border-lipstick text-lipstick rounded-lg font-semibold hover:bg-lipstick hover:text-white transition-colors whitespace-nowrap text-base" /* বড় বাটন */
                        >
                            কার্ড দেখুন
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-6 py-2.5 bg-lipstick text-white rounded-lg font-semibold hover:bg-lipstick-dark transition-colors whitespace-nowrap text-base" /* বড় বাটন */
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