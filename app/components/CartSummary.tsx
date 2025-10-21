// components/CartSummary.tsx - COMPACT VERSION
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

const CartSummary: React.FC = () => {
    const { cart, totalItems, totalPrice, checkout } = useCart();
    const router = useRouter();

    // কার্ট খালি হলে কিছু show করবে না
    if (totalItems === 0) {
        return null;
    }

    const handleCheckout = () => {
        checkout();
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="container mx-auto px-3 py-2"> {/* কম padding */}
                {/* Main row - সবকিছু এক লাইনে */}
                <div className="flex items-center justify-between">
                    {/* বাম পাশে - কার্ট info */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-lipstick text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <span className="font-bold text-xs">{totalItems}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-800">
                                {totalPrice} টাকা
                            </span>
                        </div>
                    </div>

                    {/* ডান পাশে - অর্ডার বাটন */}
                    <div className="flex items-center">
                        <button
                            onClick={handleCheckout}
                            className="px-4 py-1.5 bg-lipstick text-white rounded-lg font-semibold text-sm hover:bg-lipstick-dark transition-colors"
                        >
                            অর্ডার করুন
                        </button>
                    </div>
                </div>

                {/* কার্ট আইটেমের লিস্ট - এক লাইনে compact */}
                <div className="mt-1.5 flex space-x-1 overflow-x-auto">
                    {cart.slice(0, 5).map((item) => ( // শুধু প্রথম ৫টি আইটেম show
                        <div 
                            key={item.id} 
                            className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-1 min-w-max flex-shrink-0"
                        >
                            <span className="text-xs text-gray-700 truncate max-w-[80px]">
                                {item.name}
                            </span>
                            <span className="text-xs bg-lipstick text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                                {item.quantity}
                            </span>
                        </div>
                    ))}
                    {cart.length > 5 && (
                        <div className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-1 min-w-max flex-shrink-0">
                            <span className="text-xs text-gray-700">
                                +{cart.length - 5} more
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartSummary;