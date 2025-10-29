// Header.tsx - WITH LOCAL STATE MANAGEMENT
'use client';
import React, { useState, useEffect } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import CartSidebar from './CartSidebar';

// Temporary components (same as before)
const SearchInput = () => (
    <div className="relative w-full">
        <input 
            className="w-full p-2 pl-10 pr-4 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/80 backdrop-blur-sm placeholder:text-gray-500 text-sm md:text-base" 
            placeholder="প্রোডাক্ট সার্চ করুন..." 
            type="text" 
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
    </div>
);

const NotificationIcon = () => (
    <Link href="/notifications" className="text-gray-800 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative hover:bg-white/20 transition-colors">
        <i className="fas fa-bell text-lg md:text-xl"></i>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold hidden">0</span>
    </Link>
);

const Header = () => {
    const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
    const [isCartOpen, setIsCartOpen] = useState(false); // ✅ Local state for cart
    const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);
    const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const router = useRouter();
    const { cart, totalItems } = useCart();
    const { user, loginWithGmail, logout } = useAuth();

    // ✅ সরাসরি local state ব্যবহার করুন
    const handleCartButtonClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('🛒 Header: Opening cart with local state');
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        console.log('🛒 Header: Closing cart with local state');
        setIsCartOpen(false);
    };

    // Detect desktop device
    useEffect(() => {
        const checkDevice = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Close logout menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const logoutContainer = document.querySelector('.logout-container');
            if (logoutContainer && !logoutContainer.contains(event.target as Node)) {
                setIsLogoutMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubMenuItemClick = (category: string) => {
        router.push(`/?filter=${category}`);
        setIsMobileSubMenuOpen(false);
        closeSidebar();
    };

    const handleFocusMobileSearch = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMobileSearchBarOpen((prev) => !prev);
    };

    const handleToggleLogoutMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsLogoutMenuOpen((prev) => !prev);
    };

    const handleConfirmLogout = (event: React.MouseEvent) => {
        event.stopPropagation();
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
                    <button 
                        className="flex items-center space-x-2 focus:outline-none" 
                        onClick={handleToggleLogoutMenu}
                    >
                        {photoURL && !imgError ? (
                            <Image 
                                src={photoURL} 
                                className="w-6 h-6 md:w-8 md:h-8 rounded-full" 
                                alt="User Avatar" 
                                width={32} 
                                height={32}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {!isMobile && (
                            <span className="text-black font-semibold text-sm md:text-base hidden lg:block">
                                {displayName}
                            </span>
                        )}
                        {!isMobile && (
                            <i className={`fas fa-chevron-down ml-1 md:ml-2 transition-transform duration-300 text-sm ${isLogoutMenuOpen ? 'rotate-180' : ''}`}></i>
                        )}
                    </button>
                    {isLogoutMenuOpen && (
                        <div className="absolute right-0 mt-2 w-36 md:w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <button 
                                className="block w-full text-left px-3 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
                    className={`flex items-center ${isMobile ? 'w-full justify-center py-2' : ''} hover:text-gray-600 transition-colors`} 
                    onClick={(e) => {
                        e.stopPropagation();
                        loginWithGmail();
                    }}
                >
                    <i className="fas fa-user-circle mr-2 text-sm md:text-base"></i>
                    <span className="text-black text-sm md:text-base">লগইন</span>
                </button>
            );
        }
    };

    // Mobile sidebar close handler
    const handleMobileSidebarClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        closeSidebar();
    };

    // Mobile submenu toggle
    const handleMobileSubMenuToggle = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMobileSubMenuOpen(!isMobileSubMenuOpen);
    };

    return (
        <>
            {/* Main Header */}
            <header className="bg-brushstroke text-black py-2 px-3 sm:px-4 md:px-6 flex justify-between items-center fixed top-0 left-0 w-full z-50 h-16">
                {/* Left Section - Logo and Mobile Menu */}
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    {/* Mobile Menu Button */}
                    <button 
                        className="text-gray-800 w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center bg-transparent border-none lg:hidden" 
                        onClick={(e) => {
                            e.stopPropagation();
                            openSidebar();
                        }}
                    >
                        <i className="fas fa-bars text-lg md:text-xl"></i>
                    </button>

                    {/* Logo */}
                    <Link 
                        className="flex items-center text-white focus:outline-none focus:ring-0" 
                        href="/"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center space-x-2">
                            <Image 
                                alt="Any's Beauty Corner লোগো" 
                                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full flex-shrink-0" 
                                height={40} 
                                width={40} 
                                src="/img.jpg"
                                priority
                            />
                            <span className="text-sm sm:text-base md:text-lg font-bold whitespace-nowrap text-black hidden sm:block">
                                Any&apos;s Beauty Corner
                            </span>
                            <span className="text-sm font-bold whitespace-nowrap text-black sm:hidden">
                                Any&apos;s Beauty
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Center Section - Desktop Search */}
                <div className="hidden lg:block flex-1 max-w-2xl mx-4 xl:mx-8">
                    <SearchInput />
                </div>

                {/* Right Section - Icons and Desktop Menu */}
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
                    {/* Mobile Search Icon */}
                    <div 
                        className="lg:hidden cursor-pointer" 
                        onClick={handleFocusMobileSearch}
                    >
                        <i className="fas fa-search text-lg md:text-xl text-gray-800"></i>
                    </div>

                    {/* Notification Icon */}
                    <NotificationIcon />

                    {/* ✅ FIXED: Shopping Bag Icon with local state */}
                    <button 
                        className="text-gray-800 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative bg-transparent border-none hover:bg-white/20 transition-colors" 
                        onClick={handleCartButtonClick}
                    >
                        <i className="fas fa-shopping-bag text-lg md:text-xl"></i>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold">
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </button>

                    {/* Desktop Login */}
                    <div className="hidden lg:block">
                        {renderLoginButton(false)}
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                        <Link 
                            className="text-black hover:text-gray-600 transition-colors text-sm xl:text-base font-medium" 
                            href="/"
                            onClick={(e) => e.stopPropagation()}
                        >
                            হোম
                        </Link>
                        <div className="relative group">
                            <button 
                                className="text-black hover:text-gray-600 transition-colors text-sm xl:text-base font-medium flex items-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                পণ্য
                                <i className="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div 
                                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {['all', 'health', 'cosmetics', 'skincare', 'haircare', 'mehandi'].map((category) => (
                                    <Link
                                        key={category}
                                        href={`/?filter=${category}`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-lipstick transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {category === 'all' && 'সকল প্রোডাক্ট'}
                                        {category === 'health' && 'স্বাস্থ্য'}
                                        {category === 'cosmetics' && 'মেকআপ'}
                                        {category === 'skincare' && 'স্কিনকেয়ার'}
                                        {category === 'haircare' && 'হেয়ারকেয়ার'}
                                        {category === 'mehandi' && 'মেহেদী'}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link 
                            className="text-black hover:text-gray-600 transition-colors text-sm xl:text-base font-medium" 
                            href="/order-track"
                            onClick={(e) => e.stopPropagation()}
                        >
                            অর্ডার ট্র্যাক
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Mobile Search Bar */}
            <div 
                className={`fixed top-16 left-0 w-full bg-white shadow-lg z-40 transition-all duration-300 ${isMobileSearchBarOpen ? 'block' : 'hidden'} lg:hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-3">
                    <SearchInput />
                </div>
            </div>

            {/* ✅ FIXED: CartSidebar with props */}
            <CartSidebar isOpen={isCartOpen} onClose={handleCloseCart} />

            {/* Rest of your mobile sidebar code remains the same */}
            {/* ... */}
        </>
    );
};

export default Header;