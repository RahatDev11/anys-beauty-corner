// components/CartSidebar.tsx - COMPLETELY REWRITTEN
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useCartSidebar } from '../hooks/useCartSidebar';

const CartSidebar = () => {
    const { isOpen, closeCartSidebar } = useCartSidebar();
    const { cart, totalPrice, updateQuantity, removeFromCart, checkout } = useCart();

    console.log('🔍 CartSidebar RENDER:', { isOpen, cartLength: cart.length });

    // ✅ Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeCartSidebar();
        }
    };

    // ✅ Handle button clicks with proper event prevention
    const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };

    // ✅ Direct DOM manipulation as backup
    useEffect(() => {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.querySelector('.cart-sidebar-overlay');
        
        if (isOpen) {
            console.log('✅ Applying open styles to sidebar');
            if (cartSidebar) {
                cartSidebar.style.transform = 'translateX(0)';
            }
            if (overlay) {
                (overlay as HTMLElement).style.display = 'block';
            }
        } else {
            console.log('✅ Applying close styles to sidebar');
            if (cartSidebar) {
                cartSidebar.style.transform = 'translateX(100%)';
            }
            if (overlay) {
                (overlay as HTMLElement).style.display = 'none';
            }
        }
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 cart-sidebar-overlay"
                style={{ display: isOpen ? 'block' : 'none' }}
                onClick={handleOverlayClick}
            />
            
            {/* Cart Sidebar */}
            <div 
                id="cartSidebar"
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50"
                style={{ 
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease-in-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            আপনার কার্ট
                        </h2>
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
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-lg">আপনার কার্ট খালি</p>
                                <p className="text-gray-400 text-sm mt-2">কিছু পণ্য যোগ করুন</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                                        <div className="flex-shrink-0">
                                            {item.image ? (
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    width={60}
                                                    height={60}
                                                    className="w-15 h-15 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-15 h-15 bg-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.name}</h3>
                                            <p className="text-lipstick font-bold text-sm">{item.price}৳</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button 
                                                    onClick={(e) => handleButtonClick(e, () => updateQuantity(item.id, -1))}
                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={(e) => handleButtonClick(e, () => updateQuantity(item.id, 1))}
                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => handleButtonClick(e, () => removeFromCart(item.id))}
                                            className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
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