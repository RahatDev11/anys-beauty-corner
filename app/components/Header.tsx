'use client';
import React, { useState, useEffect } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { useCartSidebar } from '../hooks/useCartSidebar';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// Temporary components
const SearchSuggestion = () => (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg mt-1 z-50 border border-t-0">
        <div className="p-3 hover:bg-gray-100 cursor-pointer flex items-center">
            <i className="fas fa-search text-sm mr-2 text-gray-500"></i>
            <span className="text-sm text-gray-700">Suggestion 1</span>
        </div>
        <div className="p-3 hover:bg-gray-100 cursor-pointer flex items-center">
            <i className="fas fa-search text-sm mr-2 text-gray-500"></i>
            <span className="text-sm text-gray-700">Suggestion 2</span>
        </div>
        <div className="p-3 hover:bg-gray-100 cursor-pointer flex items-center">
            <i className="fas fa-search text-sm mr-2 text-gray-500"></i>
            <span className="text-sm text-gray-700">Suggestion 3</span>
        </div>
    </div>
);

const SearchInput = () => (
    <div className="relative">
        <input 
            className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80" 
            placeholder="প্রোডাক্ট সার্চ করুন..." 
            type="text" 
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"></i>
        {/* Placeholder for Search Suggestions */}
        <SearchSuggestion />
    </div>
);

const NotificationIcon = () => (
    <Link href="/notifications" className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center relative">
        <i className="fas fa-bell text-2xl"></i>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
    </Link>
);

const Header = () => {
    const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
    const { isOpen: isCartSidebarOpen, openCartSidebar, closeCartSidebar } = useCartSidebar();
    const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);
    const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const router = useRouter();
    const { cart, totalItems, totalPrice, updateQuantity, checkout } = useCart();
    const { user, loginWithGmail, logout } = useAuth();

    // Close logout menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsLogoutMenuOpen(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSubMenuItemClick = (category: string) => {
        router.push(`/?filter=${category}`);
        setIsMobileSubMenuOpen(false);
        closeSidebar();
    };

    const handleFocusMobileSearch = () => {
        setIsMobileSearchBarOpen((prev) => !prev);
    };

    const handleToggleLogoutMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsLogoutMenuOpen((prev) => !prev);
    };

    const handleConfirmLogout = () => {
        if (window.confirm("আপনি কি লগআউট করতে চান?")) {
            logout();
            setIsLogoutMenuOpen(false);
        }
    };

    // ✅ FIXED: Multiple images handling function - SAME AS PRODUCT DETAIL PAGE
    const getCartItemImage = (imageString: string | undefined) => {
        if (!imageString) return "https://via.placeholder.com/50?text=No+Image";

        // Handle comma separated multiple images (YOUR MAIN CASE)
        if (typeof imageString === 'string' && imageString.includes(',')) {
            const urls = imageString
                .split(',')
                .map(url => url.trim())
                .filter(url => url !== '' && (url.startsWith('http') || url.startsWith('https')));

            // Return the first valid URL
            return urls[0] || "https://via.placeholder.com/50?text=Invalid+URL";
        }

        // Handle single image
        if (typeof imageString === 'string' && imageString.startsWith('http')) {
            return imageString;
        }

        return "https://via.placeholder.com/50?text=Invalid+URL";
    };

    const renderLoginButton = (isMobile: boolean) => {
        if (user) {
            const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
            const photoURL = user.photoURL;
            return (
                <div className="relative logout-container" onClick={handleToggleLogoutMenu}>
                    <button className="flex items-center space-x-2 focus:outline-none">
                        {photoURL && !imgError ? (
                            <Image 
                                src={photoURL} 
                                className="w-8 h-8 rounded-full" 
                                alt="User Avatar" 
                                width={32} 
                                height={32}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-black font-semibold">{displayName}</span>
                        <i className={`fas fa-chevron-down ml-2 transition-transform ${isLogoutMenuOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                    {isLogoutMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <button 
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={handleConfirmLogout}
                            >
                                লগআউট
                            </button>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <button 
                    className={`flex items-center ${isMobile ? 'w-full' : ''} hover:text-gray-600`} 
                    onClick={loginWithGmail}
                >
                    <i className="fas fa-user-circle mr-2"></i>
                    <span className="text-black">লগইন</span>
                </button>
            );
        }
    };

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
            </header>

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