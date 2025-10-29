// components/CartSidebar.tsx - FIXED VERSION
'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useCartSidebar } from '../hooks/useCartSidebar';

const CartSidebar = () => {
    const { isOpen, closeCartSidebar } = useCartSidebar();
    const { cart, totalPrice, updateQuantity, removeFromCart, checkout } = useCart();

    console.log('🔍 CartSidebar rendering, isOpen:', isOpen);

    // ✅ Stop all event propagation inside sidebar
    const handleSidebarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('🔍 Sidebar clicked, stopping propagation');
    };

    // ✅ Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            console.log('🔍 Overlay clicked, closing sidebar');
            closeCartSidebar();
        }
    };

    // ✅ Prevent all button clicks from bubbling
    const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔍 Button clicked, preventing propagation');
        action();
    };

    return (
        <>
            {/* Overlay - only show when open */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 cart-sidebar-overlay"
                    onClick={handleOverlayClick}
                />
            )}
            
            {/* Cart Sidebar */}
            <div 
                id="cartSidebar"
                onClick={handleSidebarClick}
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">আপনার কার্ট</h2>
                        <button 
                            onClick={(e) => handleButtonClick(e, closeCartSidebar)}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <p className="text-gray-500 text-lg">আপনার কার্ট খালি</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                                        <Image 
                                            src={item.image || '/placeholder-image.jpg'} 
                                            alt={item.name}
                                            width={60}
                                            height={60}
                                            className="w-15 h-15 object-cover rounded"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                                            <p className="text-lipstick font-bold text-sm">{item.price}৳</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button 
                                                    onClick={(e) => handleButtonClick(e, () => updateQuantity(item.id, -1))}
                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={(e) => handleButtonClick(e, () => updateQuantity(item.id, 1))}
                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => handleButtonClick(e, () => removeFromCart(item.id))}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t pt-4 space-y-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>মোট:</span>
                                <span>{totalPrice.toFixed(2)}৳</span>
                            </div>
                            <button 
                                onClick={(e) => handleButtonClick(e, () => {
                                    checkout();
                                    closeCartSidebar();
                                })}
                                className="w-full bg-lipstick text-white py-3 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors"
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