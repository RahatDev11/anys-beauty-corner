'use client';
import React, { useState, useEffect } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { useCartSidebar } from '../hooks/useCartSidebar';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// ... (keep all your temporary components and imports the same)

const Header = () => {
    // ... (keep all your useState, useEffect, and functions the same)

    return (
        <>
            <header className="bg-brushstroke text-black py-2 px-2 md:px-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
                {/* লোগো */}
                <Link className="flex items-center text-white" href="/">
                    <div className="flex items-center">
                        <Image 
                            alt="Any's Beauty Corner লোগো" 
                            className="h-10 w-10 rounded-full mr-2 border-2 border-lipstick flex-shrink-0" 
                            height={40} 
                            width={40} 
                            src="/img.jpg"
                            priority
                        />
                        <span className="text-base md:text-lg font-bold whitespace-nowrap text-black">
                            Any&apos;s Beauty Corner
                        </span>
                    </div>
                </Link>

                <div className="flex items-center space-x-[10px] md:space-x-[50px]">
                    {/* Login Button for Desktop */}
                    <div className="hidden md:block">
                        {renderLoginButton(false)}
                    </div>
                    {/* ডেস্কটপ সার্চ বার */}
                    <div className="hidden md:block p-2 md:flex-grow relative">
                        <SearchInput />
                    </div>

                    {/* মোবাইল সার্চ আইকন */}
                    <div className="md:hidden cursor-pointer" onClick={handleFocusMobileSearch}>
                        <i className="fas fa-search text-2xl text-gray-800"></i>
                    </div>

                    {/* Notification icon */}
                    <NotificationIcon />

                    {/* শপিং ব্যাগ আইকন */}
                    <button 
                        className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center relative bg-transparent border-none" 
                        onClick={openCartSidebar}
                    >
                        <i className="fas fa-shopping-bag text-2xl"></i>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* মোবাইল মেনু বাটন */}
                    <button 
                        className="text-gray-800 w-10 h-10 rounded md:hidden flex items-center justify-center bg-transparent border-none" 
                        onClick={openSidebar}
                    >
                        <i className="fas fa-bars text-2xl"></i>
                    </button>

                    {/* ডেস্কটপ মেনু */}
                    <nav className="hidden md:flex space-x-6 items-center text-white">
                        {/* Login button is now part of the main header icons for unified access */}
                        <Link className="text-black hover:text-gray-600 transition-colors focus:outline-none focus:ring-0" href="/">
                            হোম
                        </Link>
                        {['all', 'health', 'cosmetics', 'skincare', 'haircare', 'mehandi'].map((category) => (
                            <Link
                                key={category}
                                href={`/?filter=${category}`}
                                className="text-black hover:text-gray-600 transition-colors focus:outline-none focus:ring-0"
                            >
                                {category === 'all' && 'সকল প্রোডাক্ট'}
                                {category === 'health' && 'স্বাস্থ্য'}
                                {category === 'cosmetics' && 'মেকআপ'}
                                {category === 'skincare' && 'স্কিনকেয়ার'}
                                {category === 'haircare' && 'হেয়ারকেয়ার'}
                                {category === 'mehandi' && 'মেহেদী'}
                            </Link>
                        ))}

                        <Link
                            className="text-black hover:text-gray-600 transition-colors focus:outline-none focus:ring-0"
                            href="/order-track"
                        >
                            অর্ডার ট্র্যাক
                        </Link>
                        <Link
                            className="text-black hover:text-gray-600 transition-colors focus:outline-none focus:ring-0"
                            href="/about"
                        >
                            আমাদের সম্পর্কে
                        </Link>
                        <Link
                            className="text-black hover:text-gray-600 transition-colors focus:outline-none focus:ring-0"
                            href="/contact"
                        >
                            যোগাযোগ
                        </Link>
                        <Link
                            className="text-black hover:text-gray-600 transition-colors focus:outline-none focus:ring-0"
                            href="/faq"
                        >
                            FAQ
                        </Link>
                    </nav>
                </div>
            </header> {/* ✅ FIXED: Added missing closing header tag */}

            {/* কার্ট সাইডবার Overlay */}
            {isCartSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={closeCartSidebar}
                />
            )}

            {/* মোবাইল সাইডবার */}
            <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''} fixed top-0 left-0 w-full md:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50`}>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">মেনু</h2>
                        <button 
                            onClick={closeSidebar}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div className="mb-4">
                        {renderLoginButton(true)}
                    </div>

                    <nav className="space-y-2">
                        <Link href="/" className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded" onClick={closeSidebar}>
                            হোম
                        </Link>

                        <button 
                            className="w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-100 rounded flex justify-between items-center"
                            onClick={() => setIsMobileSubMenuOpen(!isMobileSubMenuOpen)}
                        >
                            পণ্য সমূহ
                            <i className={`fas fa-chevron-down transition-transform ${isMobileSubMenuOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {isMobileSubMenuOpen && (
                            <div className="ml-4 space-y-1">
                                {['all', 'health', 'cosmetics', 'skincare', 'haircare', 'mehandi'].map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleSubMenuItemClick(category)}
                                        className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-50 rounded text-sm"
                                    >
                                        {category === 'all' && 'সকল প্রোডাক্ট'}
                                        {category === 'health' && 'স্বাস্থ্য'}
                                        {category === 'cosmetics' && 'মেকআপ'}
                                        {category === 'skincare' && 'স্কিনকেয়ার'}
                                        {category === 'haircare' && 'হেয়ারকেয়ার'}
                                        {category === 'mehandi' && 'মেহেদী'}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Link href="/order-track" className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded" onClick={closeSidebar}>
                            অর্ডার ট্র্যাক
                        </Link>
                        <Link href="/about" className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded" onClick={closeSidebar}>
                            আমাদের সম্পর্কে
                        </Link>
                        <Link href="/contact" className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded" onClick={closeSidebar}>
                            যোগাযোগ
                        </Link>
                        <Link href="/faq" className="block py-2 px-4 text-gray-800 hover:bg-gray-100 rounded" onClick={closeSidebar}>
                            FAQ
                        </Link>
                    </nav>
                </div>
            </div>

            {/* মোবাইল সাইডবার Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* মোবাইল সার্চ বার */}
            <div className={`fixed top-[56px] left-0 w-full bg-white shadow-lg p-2 z-40 ${isMobileSearchBarOpen ? 'block' : 'hidden'}`}>
                <div className="relative">
                    <input 
                        className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80" 
                        placeholder="প্রোডাক্ট সার্চ করুন..." 
                        type="text" 
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400/80"></i>
                </div>
            </div>
        </>
    );
};

export default Header;