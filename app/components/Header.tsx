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

            {/* কার্ট সাইডবার */}
            <div className={`cart-sidebar ${isCartSidebarOpen ? 'open' : ''}`}>
                <div className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">আপনার কার্ট</h2>
                        <button 
                            onClick={closeCartSidebar}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <i className="fas fa-shopping-cart text-4xl mb-4"></i>
                                <p>আপনার কার্ট খালি</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center">
                                        <Image src={item.image || ''} alt={item.name} width={50} height={50} className="rounded" />
                                        <div className="ml-4">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-gray-600">{item.price} টাকা</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 text-lg font-bold">-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 text-lg font-bold">+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-lg font-bold">সর্বমোট</p>
                            <p className="text-lg font-bold">{totalPrice} টাকা</p>
                        </div>
                        <button
                            onClick={checkout}
                            className="w-full bg-lipstick text-white py-3 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors"
                        >
                            চেকআউট
                        </button>
                    </div>
                </div>
            </div>

            {/* কার্ট সাইডবার Overlay */}
            {isCartSidebarOpen && (
                <div 
                    className="cart-sidebar-overlay"
                    onClick={closeCartSidebar}
                />
            )}

            {/* মোবাইল সাইডবার */}
            <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
                    </nav>
                </div>
            </div>

            {/* মোবাইল সাইডবার Overlay */}
            {isSidebarOpen && (
                <div 
                    className="mobile-sidebar-overlay"
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