// components/CartSidebar.tsx - COMPLETE VERSION
'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useCartSidebar } from '../hooks/useCartSidebar';
import { SlimProductCard } from './ProductCard';

const CartSidebar = () => {
    const { 
        isOpen, 
        isAnimating,
        sidebarRef,
        overlayRef,
        closeCartSidebar 
    } = useCartSidebar();
    
    const { 
        cart, 
        totalPrice, 
        updateQuantity, 
        removeFromCart, 
        checkout, 
        addToCart,
        clearCart 
    } = useCart();

    // CartContext থেকে প্রয়োজনীয় ফাংশনগুলো
    const cartItemProps = {
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateCartQuantity: updateQuantity,
        buyNow: () => {},
        buyNowSingle: () => {},
    };

    const hasItems = cart.length > 0;

    // ✅ Handle checkout with sidebar close
    const handleCheckout = () => {
        checkout();
        closeCartSidebar();
    };

    // ✅ Handle clear cart
    const handleClearCart = () => {
        if (confirm('আপনি কি নিশ্চিত যে আপনি কার্ট খালি করতে চান?')) {
            clearCart();
        }
    };

    return (
        <>
            {/* Overlay with backdrop filter */}
            {isOpen && (
                <div 
                    ref={overlayRef}
                    className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                        isAnimating ? 'opacity-0' : 'opacity-50'
                    }`}
                    onClick={closeCartSidebar}
                    aria-hidden="true"
                />
            )}
            
            {/* Cart Sidebar */}
            <div 
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } ${isAnimating ? 'transition-transform' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
                aria-labelledby="cart-title"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                        <h2 id="cart-title" className="text-xl font-bold text-gray-900">
                            আপনার কার্ট ({cart.length})
                        </h2>
                        <div className="flex items-center gap-2">
                            {hasItems && (
                                <button
                                    onClick={handleClearCart}
                                    className="text-sm text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                                    title="কার্ট খালি করুন"
                                >
                                    খালি করুন
                                </button>
                            )}
                            <button 
                                onClick={closeCartSidebar}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="কার্ট বন্ধ করুন"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
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
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">কার্ট খালি</h3>
                                <p className="text-gray-500 mb-6">আপনার কার্টে কোনো প্রোডাক্ট নেই</p>
                                <button 
                                    onClick={closeCartSidebar}
                                    className="bg-lipstick text-white px-8 py-3 rounded-lg hover:bg-lipstick-dark transition-colors font-medium"
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

                    {/* Footer - শুধু কার্টে আইটেম থাকলে দেখাবে */}
                    {hasItems && (
                        <div className="border-t border-gray-200 bg-white p-4 space-y-4">
                            {/* Total Price */}
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold text-gray-800">মোট মূল্য:</span>
                                <span className="font-bold text-lipstick text-xl">{totalPrice.toFixed(2)} টাকা</span>
                            </div>
                            
                            {/* Delivery Info */}
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span>ডেলিভারি চার্জ:</span>
                                    <span>৳70 (ঢাকার ভিতরে)</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    * অর্ডার কনফার্ম করার পর ডেলিভারি সময় জানানো হবে
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-lipstick-dark text-white py-4 rounded-lg hover:bg-lipstick transition-colors duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
                                disabled={!hasItems}
                            >
                                সেফ চেকআউট - ৳{totalPrice.toFixed(2)}
                            </button>
                            
                            {/* Security Badge */}
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    ১০০% সুরক্ষিত পেমেন্ট
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Global styles for sidebar open state */}
            <style jsx global>{`
                main.sidebar-open {
                    filter: blur(2px);
                    transition: filter 0.3s ease;
                }
                
                @media (max-width: 640px) {
                    .cart-sidebar {
                        width: 100vw !important;
                        max-width: 100vw !important;
                    }
                }
            `}</style>
        </>
    );
};

export default CartSidebar;