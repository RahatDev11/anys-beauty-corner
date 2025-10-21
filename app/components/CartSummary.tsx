// components/CartSummary.tsx - FINAL VERSION
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
        // সাইডবার কার্ড ওপেন করার লজিক এখানে যোগ করুন
        // যেমন: cart sidebar toggle function call
        console.log('কার্ড সাইডবার ওপেন করুন');
        // অথবা যদি আপনার cart sidebar component থাকে
        // setIsCartOpen(true) ইত্যাদি
    };

    const handleCheckout = () => {
        router.push('/order-form');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
            <div className="container mx-auto px-4 py-3"> {/* padding বাড়ানো */}
                <div className="flex items-center justify-between">
                    {/* Left side - সংখ্যা এবং price */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-lipstick text-white rounded-full w-12 h-12 flex items-center justify-center"> {/* আরও বড় */}
                            <span className="font-bold text-xl">{totalItems}</span> {/* বড় font */}
                        </div>
                        <span className="text-lg font-bold text-gray-800"> {/* বড় font */}
                            {totalPrice} টাকা
                        </span>
                    </div>

                    {/* Right side - Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleViewCart}
                            className="px-6 py-3 bg-lipstick text-white rounded-lg font-semibold hover:bg-lipstick-dark transition-colors whitespace-nowrap text-base" /* বড় বাটন */
                        >
                            কার্ড দেখুন
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;