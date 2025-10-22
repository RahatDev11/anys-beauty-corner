// components/CartSidebar.tsx - FIXED VERSION
'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useCartSidebar } from '../hooks/useCartSidebar';
import { SlimProductCard } from './ProductCard';

const CartSidebar = () => {
    const { isOpen, closeCartSidebar } = useCartSidebar();
    const { cart, totalPrice, updateQuantity, removeFromCart, checkout, addToCart } = useCart();

    // CartContext থেকে প্রয়োজনীয় ফাংশনগুলো
    const cartItemProps = {
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateCartQuantity: updateQuantity,
        buyNow: () => {},
        buyNowSingle: () => {},
    };

    const hasItems = cart.length > 0;

    // ✅ Handle checkout
    const handleCheckout = () => {
        checkout();
        closeCartSidebar();
    };

    return (
        <>
            {/* Overlay - বাইরে ক্লিক করলে ক্লোজ হবে */}
            {isOpen && (
                <div 
                    id="cartOverlay"
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300"
                    onClick={closeCartSidebar}
                    style={{
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)'
                    }}
                />
            )}
            
            {/* Cart Sidebar */}
            <div 
                id="cartSidebar"
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                        <h2 className="text-xl font-bold text-gray-900">আপনার কার্ট</h2>
                        <button 
                            onClick={closeCartSidebar}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Cart Items - Scrollable area */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {!hasItems ? (
                            <div className="text-center py-12">
                                <div className="text-gray-300 mb-6">
                                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h7.5"></path>
                                    </svg>
                                </div>
                                <p className="text-gray-500 mb-6">আপনার কার্ট খালি</p>
                                <button 
                                    onClick={closeCartSidebar}
                                    className="bg-lipstick text-white px-6 py-3 rounded-lg hover:bg-lipstick-dark transition-colors"
                                >
                                    শপিং চালিয়ে যান
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <SlimProductCard 
                                        key={item.id}
                                        product={item}
                                        cartItemQuantity={item.quantity}
                                        {...cartItemProps}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {hasItems && (
                        <div className="border-t border-gray-200 bg-white p-4 space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold text-gray-800">মোট মূল্য:</span>
                                <span className="font-bold text-lipstick">{totalPrice.toFixed(2)} টাকা</span>
                            </div>
                            
                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-lipstick-dark text-white py-3 rounded-lg hover:bg-lipstick transition-colors font-semibold"
                            >
                                চেকআউট করুন
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;