// components/CartSummary.tsx - FINAL VERSION
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

const CartSummary: React.FC = () => {
    const { cart, totalItems, totalPrice } = useCart();
    const router = useRouter();

    if (totalItems === 0) {
        return null;
    }

    const handleViewCart = () => {
        // কার্ড পেজে নিয়ে যাবে - আপনি যেভাবে cart page implement করেছেন
        router.push('/cart'); // অথবা '/cart-page' যেটা আপনার route
    };

    const handleCheckout = () => {
        // অর্ডার ফর্মে নিয়ে যাবে
        router.push('/order-form');
    };

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
            <div className="container mx-auto px-3 py-2">
                {/* Cart items list - উপরে (ক্লিক করলে প্রোডাক্ট পেজে যাবে) */}
                <div className="mb-2">
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                        {cart.map((item) => (
                            <div 
                                key={item.id} 
                                className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1.5 min-w-max flex-shrink-0 cursor-pointer hover:bg-gray-200 transition-colors"
                                onClick={() => handleProductClick(item.id)}
                            >
                                <img 
                                    src={item.image || "https://via.placeholder.com/40?text=No+Image"} 
                                    alt={item.name}
                                    className="w-6 h-6 object-cover rounded"
                                />
                                <span className="text-sm font-medium text-gray-700 truncate max-w-[80px]">
                                    {item.name}
                                </span>
                                <span className="text-xs bg-lipstick text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                    {item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons - নিচে */}
                <div className="flex items-center justify-between">
                    {/* Left side - Cart info */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-lipstick text-white rounded-full w-7 h-7 flex items-center justify-center">
                            <span className="font-bold text-sm">{totalItems}</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                {totalPrice} টাকা
                            </p>
                        </div>
                    </div>

                    {/* Right side - Buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleViewCart}
                            className="px-4 py-1.5 border border-lipstick text-lipstick rounded text-sm font-semibold hover:bg-lipstick hover:text-white transition-colors whitespace-nowrap"
                        >
                            কার্ড দেখুন
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-4 py-1.5 bg-lipstick text-white rounded text-sm font-semibold hover:bg-lipstick-dark transition-colors whitespace-nowrap"
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