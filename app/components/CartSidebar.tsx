'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useCartSidebar } from '../hooks/useCartSidebar';
import { SlimProductCard } from '../components/ProductCard'; // নতুন SlimProductCard ইম্পোর্ট

const CartSidebar = () => {
    const { isOpen, closeCartSidebar } = useCartSidebar();
    const { cart, totalPrice, updateQuantity, removeFromCart, checkout, addToCart } = useCart();

    // CartContext থেকে প্রয়োজনীয় ফাংশনগুলো পাস করার জন্য
    const cartItemProps = {
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateCartQuantity: updateQuantity,
        buyNow: () => {}, // ডামি ফাংশন - সাইডবারে প্রয়োজন নেই
        buyNowSingle: () => {}, // ডামি ফাংশন - সাইডবারে প্রয়োজন নেই
    };

    return (
        <div id="cartSidebar" className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 h-full flex flex-col">
                <button onClick={closeCartSidebar} className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 self-end">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-xl text-black font-bold mb-4">কার্ট</h2>
                <div id="cartItems" className="space-y-2 flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500">আপনার কার্ট খালি।</p>
                    ) : (
                        cart.map(item => (
                            <SlimProductCard 
                                key={item.id}
                                product={item}
                                cartItemQuantity={item.quantity}
                                {...cartItemProps}
                            />
                        ))
                    )}
                </div>
                <div className="cart-footer mt-4 pt-4 border-t border-gray-200">
                    <p id="totalPrice" className="text-lg font-bold text-black">মোট মূল্য: {totalPrice.toFixed(2)} টাকা</p>
                    <button 
                        onClick={checkout} 
                        className="w-full bg-lipstick-dark text-white px-4 py-3 rounded mt-2 hover:bg-lipstick transition-colors duration-300 font-semibold"
                    >
                        চেকআউট
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;