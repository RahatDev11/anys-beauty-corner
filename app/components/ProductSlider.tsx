// app/components/CartSidebar.tsx - FINAL VERSION

'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useCartSidebar } from '../hooks/useCartSidebar';

const CartSidebar = () => {
    const { isOpen, closeCartSidebar } = useCartSidebar();
    const { cart, totalPrice, updateQuantity, removeFromCart, buyNowCart } = useCart(); // ✅ buyNowCart ব্যবহার করুন

    return (
        <div id="cartSidebar" className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 h-full flex flex-col">
                <button onClick={closeCartSidebar} className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 self-end">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-xl text-black font-bold mb-4">কার্ট</h2>
                <div id="cartItems" className="space-y-4 flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500">আপনার কার্ট খালি।</p>
                    ) : (
                        cart.map(item => (
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
                                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                                </svg>
                                            </button>
                                            <span className="px-2 text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                                </svg>
                                            </button>
                                            <p className="font-semibold text-sm ml-2">{item.price.toFixed(2)}৳</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-auto flex-shrink-0 p-2 rounded-full hover:bg-gray-100">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="cart-footer mt-4">
                    <p id="totalPrice" className="text-lg font-bold">মোট মূল্য: {totalPrice.toFixed(2)} টাকা</p>
                    {/* ✅ buyNowCart ব্যবহার করুন */}
                    <button onClick={buyNowCart} className="w-full bg-lipstick-dark text-white px-4 py-2 rounded mt-2 hover:bg-lipstick transition-colors duration-300">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;