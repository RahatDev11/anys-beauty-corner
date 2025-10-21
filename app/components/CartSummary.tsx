// components/CartSummary.tsx
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

const CartSummary: React.FC = () => {
    const { cart, totalItems, totalPrice, checkout } = useCart();
    const router = useRouter();

    if (totalItems === 0) {
        return null; // কার্ট খালি হলে কিছু show করবে না
    }

    const handleCheckout = () => {
        checkout();
    };

    const handleViewCart = () => {
        router.push('/cart'); // যদি আপনার cart page থাকে
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* বাম পাশে - কার্টের সামারি */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-lipstick text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="font-bold">{totalItems}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">
                                {totalItems}টি প্রোডাক্ট
                            </p>
                            <p className="text-sm text-gray-600">
                                মোট: {totalPrice} টাকা
                            </p>
                        </div>
                    </div>

                    {/* ডান পাশে - বাটনগুলো */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleViewCart}
                            className="px-4 py-2 border border-lipstick text-lipstick rounded-lg font-semibold hover:bg-lipstick hover:text-white transition-colors"
                        >
                            কার্ট দেখুন
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-6 py-2 bg-lipstick text-white rounded-lg font-semibold hover:bg-lipstick-dark transition-colors"
                        >
                            অর্ডার করুন
                        </button>
                    </div>
                </div>

                {/* কার্ট আইটেমের লিস্ট (ঐচ্ছিক) */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 min-w-max">
                                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                <span className="text-xs bg-lipstick text-white rounded-full w-5 h-5 flex items-center justify-center">
                                    {item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;