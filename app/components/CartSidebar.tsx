// CartSidebar.tsx - কারেক্টেড ভার্সন
'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useCartSidebar } from '../hooks/useCartSidebar';

const CartSidebar = () => {
    const { isOpen, closeCartSidebar } = useCartSidebar();
    const { cart, totalPrice, updateQuantity, removeFromCart, checkout } = useCart();

    // ✅ Overlay ক্লিক হ্যান্ডলার
    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            closeCartSidebar();
        }
    };

    // ✅ কার্ট আইটেম হ্যান্ডলার - event propagation বন্ধ করুন
    const handleQuantityDecrease = (event: React.MouseEvent, itemId: string) => {
        event.stopPropagation();
        updateQuantity(itemId, -1);
    };

    const handleQuantityIncrease = (event: React.MouseEvent, itemId: string) => {
        event.stopPropagation();
        updateQuantity(itemId, 1);
    };

    const handleRemoveItem = (event: React.MouseEvent, itemId: string) => {
        event.stopPropagation();
        removeFromCart(itemId);
    };

    return (
        <>
            {/* ✅ Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 cart-sidebar-overlay"
                    onClick={handleOverlayClick}
                />
            )}
            
            {/* ✅ Cart Sidebar */}
            <div 
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 cart-sidebar ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4 h-full flex flex-col">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h2 className="text-xl text-black font-bold">কার্ট</h2>
                        <button 
                            onClick={closeCartSidebar} 
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Items Section */}
                    <div className="flex-1 overflow-y-auto min-h-0 mb-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-center text-gray-500">আপনার কার্ট খালি।</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-2 border-b text-black">
                                        <div className="flex items-center">
                                            {item.image && item.image.includes("via.placeholder.com") ? (
                                                <img src={item.image} className="w-10 h-10 object-cover rounded mr-3" alt={item.name} width={40} height={40} />
                                            ) : (
                                                <Image 
                                                    src={item.image || 'https://via.placeholder.com/40'} 
                                                    className="w-10 h-10 object-cover rounded mr-3" 
                                                    alt={item.name} 
                                                    width={40} 
                                                    height={40} 
                                                />
                                            )}
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm truncate max-w-[10rem]">{item.name}</p>
                                                <div className="flex items-center">
                                                    <button 
                                                        onClick={(e) => handleQuantityDecrease(e, item.id)} 
                                                        className="px-2 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                                        </svg>
                                                    </button>
                                                    <span className="px-2 text-sm">{item.quantity}</span>
                                                    <button 
                                                        onClick={(e) => handleQuantityIncrease(e, item.id)} 
                                                        className="px-2 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                                        </svg>
                                                    </button>
                                                    <p className="font-semibold text-sm ml-2">{item.price.toFixed(2)}৳</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => handleRemoveItem(e, item.id)} 
                                            className="text-red-500 hover:text-red-700 ml-auto flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Section */}
                    {cart.length > 0 && (
                        <div className="mt-auto pt-4 border-t border-gray-200 flex-shrink-0">
                            {/* ... rest of your footer code (same as before) */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;