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
const SearchInput = () => (
    <div className="relative">
        <input 
            className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80" 
            placeholder="প্রোডাক্ট সার্চ করুন..." 
            type="text" 
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"></i>
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

    // ✅ Body scroll management
    useEffect(() => {
        if (isCartSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartSidebarOpen]);

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

    // ✅ FIXED: Multiple images handling function
    const getCartItemImage = (imageString: string | undefined) => {
        if (!imageString) return "https://via.placeholder.com/50?text=No+Image";

        if (typeof imageString === 'string' && imageString.includes(',')) {
            const urls = imageString
                .split(',')
                .map(url => url.trim())
                .filter(url => url !== '' && (url.startsWith('http') || url.startsWith('https')));

            return urls[0] || "https://via.placeholder.com/50?text=Invalid+URL";
        }

        if (typeof imageString === 'string' && imageString.startsWith('http')) {
            return imageString;
        }

        return "https://via.placeholder.com/50?text=Invalid+URL";
    };

    // ✅ Handle checkout with sidebar close
    const handleCheckout = () => {
        checkout();
        closeCartSidebar();
    };

    // ✅ Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeCartSidebar();
        }
    };

    const renderLoginButton = (isMobile: boolean) => {
        if (user) {
            const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
            const photoURL = user.photoURL;
            return (
                <div className="relative logout-container">
                    <button className="flex items-center space-x-2 focus:outline-none" onClick={handleToggleLogoutMenu}>
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
                        <i className={`fas fa-chevron-down ml-2 transition-transform duration-300 ${isLogoutMenuOpen ? 'rotate-180' : ''}`}></i>
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
                        <div className="desktop-login-button">
                            {renderLoginButton(false)}
                        </div>
                        <Link className="text-black hover:text-gray-600 transition-colors" href="/">
                            হোম
                        </Link>
                        {['all', 'health', 'cosmetics', 'skincare', 'haircare', 'mehandi'].map((category) => (
                            <Link
                                key={category}
                                href={`/?filter=${category}`}
                                className="text-black hover:text-gray-600 transition-colors"
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
                            className="text-black hover:text-gray-600 transition-colors"
                            href="/order-track"
                        >
                            অর্ডার ট্র্যাক
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ✅ FIXED: কার্ট সাইডবার - CSS Conflict Solved */}
            {isCartSidebarOpen && (
                <>
                    {/* Overlay with proper blur */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                        onClick={handleOverlayClick}
                    />
                    
                    {/* Cart Sidebar */}
                    <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-gray-900">আপনার কার্ট ({cart.length})</h2>
                            <button 
                                onClick={closeCartSidebar}
                                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items - Scrollable Area */}
                        <div className="flex-1 overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <div className="text-gray-300 mb-4">
                                        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h7.5"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">কার্ট খালি</h3>
                                    <p className="text-gray-500 mb-6">আপনার কার্টে কোনো প্রোডাক্ট নেই</p>
                                    <button 
                                        onClick={closeCartSidebar}
                                        className="bg-lipstick text-white px-6 py-3 rounded-lg hover:bg-lipstick-dark transition-colors"
                                    >
                                        শপিং চালিয়ে যান
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                                            <Image
                                                src={getCartItemImage(item.image)}
                                                alt={item.name}
                                                width={60}
                                                height={60}
                                                className="rounded-lg object-cover flex-shrink-0"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://via.placeholder.com/60?text=Error";
                                                }}
                                                unoptimized={true}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-800 truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-lipstick font-bold text-sm">
                                                    ৳{item.price}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-semibold text-sm w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Only show when cart has items */}
                        {cart.length > 0 && (
                            <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-lg font-semibold text-gray-800">মোট মূল্য:</span>
                                    <span className="text-xl font-bold text-lipstick">৳{totalPrice.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-lipstick-dark text-white py-3 rounded-lg font-semibold hover:bg-lipstick transition-colors duration-300"
                                >
                                    চেকআউট করুন
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

                {/* মোবাইল সাইডবার */}
            {isSidebarOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={closeSidebar}
                    />
                    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">মেনু</h2>
                                <button onClick={closeSidebar}>
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
                            </nav>
                        </div>
                    </div>
                </>
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