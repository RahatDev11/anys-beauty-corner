'use client';
import React, { useState, useEffect } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { useCartSidebar } from '../hooks/useCartSidebar';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSession, signOut, signIn } from 'next-auth/react';
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
    <Link href="/notifications" className="text-gray-800 w-8 h-8 rounded-full flex items-center justify-center relative">
        <i className="fas fa-bell text-xl"></i>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center hidden">0</span>
    </Link>
);

const Header = () => {
    const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
    const { isOpen: isCartSidebarOpen, openCartSidebar, closeCartSidebar } = useCartSidebar();
    const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);
    const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
    const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const router = useRouter();
    const { cart, totalItems, totalPrice, updateQuantity, checkout } = useCart();
    const { user, loginWithGmail, logout } = useAuth();

    // ✅ NextAuth Session
    const { data: session, status } = useSession();

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as Element).closest('.logout-container')) {
                setIsLogoutMenuOpen(false);
            }
            if (!(event.target as Element).closest('.products-menu-container')) {
                setIsProductsMenuOpen(false);
            }
            // Close mobile search bar if clicking outside and it's open
            if (isMobileSearchBarOpen && !(event.target as Element).closest('.mobile-search-bar-container')) {
                setIsMobileSearchBarOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileSearchBarOpen]); // Add isMobileSearchBarOpen to dependencies

    const handleSubMenuItemClick = (category: string) => {
        router.push(`/?filter=${category}`);
        setIsMobileSubMenuOpen(false);
        setIsProductsMenuOpen(false);
        closeSidebar();
    };

    const handleToggleMobileSearchBar = () => {
        setIsMobileSearchBarOpen((prev) => !prev);
    };

    const handleToggleLogoutMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsLogoutMenuOpen((prev) => !prev);
    };

    const handleToggleProductsMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsProductsMenuOpen((prev) => !prev);
    };

    const handleConfirmLogout = () => {
        if (window.confirm("আপনি কি লগআউট করতে চান?")) {
            logout();
            signOut({ callbackUrl: '/' });
            setIsLogoutMenuOpen(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signIn('google', { 
                callbackUrl: '/',
                redirect: true 
            });
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    // ✅ Combined User Data
    const currentUser = session?.user || user;
    const displayName = currentUser?.name || currentUser?.displayName || 
                       (currentUser?.email ? currentUser.email.split('@')[0] : 'User');
    const photoURL = currentUser?.image || currentUser?.photoURL;

    // ✅ FIXED: Multiple images handling function
    const getCartItemImage = (imageString: string | undefined) => {
        if (!imageString) return "https://via.placeholder.com/50?text=No+Image";

        if (typeof imageString === 'string' && imageString.includes(',')) {
            const urls = imageString.split(',').map(url => url.trim());
            const firstValidUrl = urls.find(url => url.startsWith('http'));
            return firstValidUrl || "https://via.placeholder.com/50?text=Invalid+URL";
        }

        if (typeof imageString === 'string' && imageString.startsWith('http')) {
            return imageString;
        }

        return "https://via.placeholder.com/50?text=Invalid+URL";
    };

    // ✅ UPDATED: ডেস্কটপের জন্য লগইন/প্রোফাইল বাটন
    const renderDesktopLoginButton = () => {
        if (currentUser) {
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
                        <span className="text-black font-semibold text-sm lg:text-base">{displayName}</span>
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
                    className="flex items-center hover:text-gray-600 transition-colors text-sm lg:text-base" 
                    onClick={handleGoogleLogin}
                >
                    <i className="fas fa-user-circle mr-2"></i>
                    <span className="text-black">লগইন</span>
                </button>
            );
        }
    };

    // ✅ UPDATED: মোবাইল সাইডবারের জন্য লগইন/প্রোফাইল সেকশন
    const renderMobileLoginSection = () => {
        if (currentUser) {
            return (
                <div className="flex items-center space-x-3 py-2 px-4 border-b pb-4">
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
                    <div>
                        <p className="font-semibold text-gray-800">{displayName}</p>
                        <button 
                            className="text-sm text-red-600 hover:text-red-800"
                            onClick={handleConfirmLogout}
                        >
                            লগআউট
                        </button>
                    </div>
                </div>
            );
        } else {
            return (
                <button 
                    className="w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-100 rounded flex items-center"
                    onClick={handleGoogleLogin}
                >
                    <i className="fas fa-user-circle mr-2"></i>
                    লগইন
                </button>
            );
        }
    };

    return (
        <>
            <header className="bg-brushstroke text-black py-2 px-3 sm:px-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
                {/* লোগো - মোবাইলে ছোট */}
                <Link className="flex items-center text-white" href="/">
                    <div className="flex items-center">
                        <Image 
                            alt="Any's Beauty Corner লোগো" 
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full mr-2 border-2 border-lipstick flex-shrink-0" 
                            height={32} 
                            width={32} 
                            src="/img.jpg"
                            priority
                        />
                        <span className="text-sm sm:text-base md:text-lg font-bold whitespace-nowrap text-black">
                            Any&apos;s Beauty Corner
                        </span>
                    </div>
                </Link>

                {/* ✅ ADDED: ডেস্কটপ সার্চ বার - মধ্যেভাগে দেখা যাবে */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-80 lg:w-96">
                    <SearchInput />
                </div>

                {/* ✅ FIXED: মোবাইল আইকনগুলো ও ডেস্কটপ নেভিগেশন */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* মোবাইল সার্চ আইকন - শুধু মোবাইলে */}
                    <div className="md:hidden cursor-pointer flex-shrink-0">
                        <i className="fas fa-search text-xl sm:text-2xl text-gray-800" onClick={handleToggleMobileSearchBar}></i>
                    </div>

                    {/* Notification icon - ছোট সাইজ */}
                    <div className="flex-shrink-0">
                        <NotificationIcon />
                    </div>

                    {/* শপিং ব্যাগ আইকন - ছোট সাইজ */}
                    <button 
                        className="text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center relative bg-transparent border-none flex-shrink-0" 
                        onClick={openCartSidebar}
                    >
                        <i className="fas fa-shopping-bag text-xl sm:text-2xl"></i>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* মোবাইল মেনু বাটন - ছোট সাইজ */}
                    <button 
                        className="text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded md:hidden flex items-center justify-center bg-transparent border-none flex-shrink-0 ml-1" 
                        onClick={openSidebar}
                    >
                        <i className="fas fa-bars text-xl sm:text-2xl"></i>
                    </button>

                    {/* ✅ FIXED: ডেস্কটপ মেনু - শুধু ডেস্কটপে দেখাবে, সম্পূর্ণ hidden মোবাইলে */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 ml-4 lg:ml-8">
                        {/* ✅ FIXED: ডেস্কটপে লগইন বাটন থাকবে */}
                        {renderDesktopLoginButton()}
                        
                        <Link className="hover:text-gray-600 transition-colors text-sm lg:text-base" href="/">
                            হোম
                        </Link>
                        
                        {/* ✅ FIXED: পণ্য সমূহ ড্রপডাউন মেনু */}
                        <div className="relative products-menu-container">
                            <button 
                                className="flex items-center focus:outline-none hover:text-gray-600 transition-colors text-sm lg:text-base"
                                onClick={handleToggleProductsMenu}
                            >
                                পণ্য সমূহ
                                <i className={`fas fa-chevron-down ml-1 lg:ml-2 transition-transform duration-300 ${isProductsMenuOpen ? 'rotate-180' : ''}`}></i>
                            </button>
                            
                            {isProductsMenuOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                                    {['all', 'health', 'cosmetics', 'skincare', 'haircare', 'mehandi'].map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => handleSubMenuItemClick(category)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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
                        </div>

                        <Link className="hover:text-gray-600 transition-colors text-sm lg:text-base" href="/order-track">
                            অর্ডার ট্র্যাক
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ✅ FIXED: কার্ট সাইডবার */}
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
                            cart.map(item => {
                                const cartItemImage = getCartItemImage(item.image);

                                return (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b">
                                        <div className="flex items-center">
                                            <Image 
                                                src={cartItemImage} 
                                                alt={item.name} 
                                                width={50} 
                                                height={50} 
                                                className="rounded object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://via.placeholder.com/50?text=Error";
                                                }}
                                            />
                                            <div className="ml-4">
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-gray-600 text-sm">{item.price} টাকা</p>
                                                <p className="text-xs text-gray-500">পরিমাণ: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)} 
                                                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-semibold w-6 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)} 
                                                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
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

            {/* ✅ FIXED: কার্ট সাইдবার Overlay */}
            {isCartSidebarOpen && (
                <div 
                    className="cart-sidebar-overlay"
                    onClick={closeCartSidebar}
                />
            )}

              {/* ✅ FIXED: মোবাইল সাইডবার - সব মেনু আইটেম এখানে থাকবে */}
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

                    <nav className="space-y-2">
                        {/* ✅ FIXED: লগইন অপশন মোবাইল সাইডবারে */}
                        {renderMobileLoginSection()}

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

            {/* ✅ FIXED: মোবাইল সার্চ বার */}
            <div className={`mobile-search-bar-container fixed top-[52px] sm:top-[56px] left-0 w-full bg-white shadow-lg p-2 z-40 ${isMobileSearchBarOpen ? 'block' : 'hidden'}`}>
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