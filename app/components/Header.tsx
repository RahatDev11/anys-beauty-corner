'use client';
import React, { useState } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { useCartSidebar } from '../hooks/useCartSidebar';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchInput from './SearchInput';
import NotificationIcon from './NotificationIcon';

const Header = () => {
    const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
    const { isOpen: isCartSidebarOpen, openCartSidebar, closeCartSidebar } = useCartSidebar();
    const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
    const [isDesktopSubMenuOpen, setIsDesktopSubMenuOpen] = useState(false);
    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);
    const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);

    const router = useRouter();
    const { totalItems, totalPrice, cart, updateQuantity, removeFromCart, checkout } = useCart();
    const { user, loginWithGmail, logout } = useAuth();

    const handleToggleMobileSubMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMobileSubMenuOpen((prev) => !prev);
    };

    const handleSubMenuItemClick = (category: string) => {
        router.push(`/?filter=${category}`);
        closeSidebar();
        setIsDesktopSubMenuOpen(false); // Close desktop submenu after selection
    };

    const handleToggleDesktopSubMenu = () => {
        setIsDesktopSubMenuOpen((prev) => !prev);
    };

    const handleFocusMobileSearch = () => {
        setIsMobileSearchBarOpen((prev) => !prev);
    };

    const handleOrderTrackClick = (event: React.MouseEvent) => {
        event.preventDefault();
        router.push('/order-track');
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
                        {photoURL ? (
                            <img src={photoURL} className="w-8 h-8 rounded-full border-2 border-gray-300" alt="User Avatar" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">{displayName.charAt(0).toUpperCase()}</div>
                        )}
                        <span className="text-black font-semibold">{displayName}</span>
                        <i className={`fas fa-chevron-down ml-2 transition-transform duration-300 ${isLogoutMenuOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                    {isLogoutMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 logout-menu">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleConfirmLogout}>লগআউট</a>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <button className={`flex items-center ${isMobile ? 'w-full' : ''}`} onClick={loginWithGmail}>
                    <i className="fas fa-user-circle mr-2"></i>
                    <span className="text-black">লগইন</span>
                </button>
            );
        }
    };

    return (
        <>
            <header className="bg-brushstroke text-black py-2 px-2 md:px-4 flex justify-between items-center fixed top-0 left-0 w-screen z-50">
                {/* লোগো */}
                <a className="flex items-center text-white" href="/">
                    <div className="flex items-center">
                        <img alt="Any's Beauty Corner লোগো" className="h-10 w-10 rounded-full mr-2 border-2 border-lipstick flex-shrink-0" height="40" src="/img.jpg" width="40" />
                        <span className="text-base md:text-lg font-bold whitespace-nowrap text-black">Any's Beauty Corner</span>
                    </div>
                </a>

                <div className="flex items-center space-x-2 md:space-x-2">
                    {/* ডেস্কটপ সার্চ বার */}
                    <div className="md:block p-2 md:flex-grow relative">
                        <SearchInput />
                    </div>

                    {/* মোবাইল সার্চ আইকন */}
                    <div id="mobileSearchIcon" className="md:hidden cursor-pointer" onClick={handleFocusMobileSearch}>
                        <i className="fas fa-search text-2xl text-gray-800"></i>
                    </div>

                    {/* Notification icon */}
                    <NotificationIcon />
                    {/* শপিং ব্যাগ আইকন */}
                    <button id="cartButton" className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center relative" onClick={openCartSidebar}>
                        <i className="fas fa-shopping-bag text-2xl"></i>
                        {totalItems > 0 && (
                            <span id="cartCount" className="absolute -top-1 -right-1 text-gray-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{totalItems}</span>
                        )}
                    </button>

                    {/* কার্ট সাইডবার */}
                    <div id="cartSidebar" className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isCartSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="p-4 h-full flex flex-col">
                            {/* কার্ট বন্ধ করার বাটন */}
                            <button onClick={closeCartSidebar} className="text-gray-600 hover:text-gray-900">
                                <i className="fas fa-times"></i>
                            </button>
                            {/* কার্ট হেডিং */}
                            <h2 className="text-xl text-black font-bold mb-4">কার্ট</h2>
                            {/* কার্ট আইটেমগুলি */}
                            <div id="cartItems" className="space-y-4 flex-1 overflow-y-auto">
                                {cart.length === 0 ? (
                                    <p className="text-center text-gray-500">আপনার কার্ট খালি।</p>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-2 border-b text-black">
                                            <div className="flex items-center">
                                                <img src={item.image ? item.image.split(',')[0].trim() : 'https://via.placeholder.com/40'} className="w-10 h-10 object-cover rounded mr-3" alt={item.name} />
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-sm truncate max-w-[10rem]">{item.name}</p>
                                                    <div className="flex items-center mr-3">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                                                        <span className="px-2 text-sm">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                                                        <p className="font-semibold text-sm ml-2">{item.price.toFixed(2)}৳</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-auto flex-shrink-0"><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* চেকআউট বাটন */}
                            <div className="cart-footer mt-4">
                                <p id="totalPrice" className="text-lg font-bold">মোট মূল্য: {totalPrice.toFixed(2)} টাকা</p>
                                <button onClick={checkout} className="w-full bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600">চেকআউট</button>
                            </div>
                        </div>
                    </div>

                    {/* টোস্ট নোটিফিকেশন */}
                    {/* Toast is now handled by ToastProvider */}

                    {/* মোবাইল মেনু বাটন */}
                    <button id="mobileMenuButton" className="text-gray-800 w-10 h-10 rounded md:hidden flex items-center justify-center" onClick={openSidebar}><i className="fas fa-bars text-2xl"></i></button>

                    {/* মোবাইল সাইডবার ওভারলে */}
                    <div className={`fixed inset-0 z-40 ${isSidebarOpen ? 'block' : 'hidden'}`} id="sidebarOverlay" onClick={closeSidebar}>
                        <div className={`fixed top-0 left-0 h-full w-4/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} id="sidebar" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 h-full flex flex-col">
                                <button id="closeSidebarButton" className="text-gray-600 hover:text-gray-900" onClick={closeSidebar}>
                                    <i className="fas fa-times"></i>
                                </button>
                                <ul className="mt-4 flex-1 overflow-y-auto">
                                    <li id="mobileLoginButton" className="py-3 border-b border-gray-200">
                                        {renderLoginButton(true)}
                                    </li>
                                    <li className="py-3 border-b border-gray-200">
                                        <a className="block text-gray-800" href="/" onClick={closeSidebar}>হোম</a>
                                    </li>

                                    <li className="py-3 border-b border-gray-200">
                                        <button className="flex items-center justify-between w-full text-left text-gray-800" onClick={handleToggleMobileSubMenu}>
                                            <span>পণ্য সমূহ</span>
                                            <i className={`fas fa-chevron-down ml-2 transition-transform duration-300 ${isMobileSubMenuOpen ? 'rotate-180' : ''}`} id="arrowIcon"></i>
                                        </button>
                                        <div className={`bg-white/5 backdrop-blur-sm rounded-lg mt-1 ml-4 ${isMobileSubMenuOpen ? 'block' : 'hidden'}`} id="subMenuMobile">
                                            <a className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="#all" onClick={() => handleSubMenuItemClick('all')}>সকল প্রোডাক্ট</a>
                                            <a className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="#health" onClick={() => handleSubMenuItemClick('health')}>স্বাস্থ্য</a>
                                            <a className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="#cosmetics" onClick={() => handleSubMenuItemClick('cosmetics')}>মেকআপ</a>
                                            <a className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="#skincare" onClick={() => handleSubMenuItemClick('skincare')}>স্কিনকেয়ার</a>
                                            <a className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="#haircare" onClick={() => handleSubMenuItemClick('haircare')}>হেয়ারকেয়ার</a>
                                            <a className="block px-4 py-2 text-gray-800" href="#mehandi" onClick={() => handleSubMenuItemClick('mehandi')}>মেহেদী</a>
                                        </div>
                                    </li>
                                    <li className="py-3 border-b border-gray-200">
                                        <a id="mobileOrderTrackButton" className="block text-gray-800" href="/order-track" onClick={handleOrderTrackClick}>অর্ডার ট্র্যাক</a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                        <div className="fixed top-0 right-0 h-full w-1/5" id="blankArea" onClick={closeSidebar}></div>
                    </div>

                    {/* ডেস্কটপ মেনু */}
                    <nav className="md:flex space-x-6 items-center text-white">
                        <div id="desktopLoginButton">
                            {renderLoginButton(false)}
                        </div>
                        <a className="text-black hover:text-gray-600" href="/">হোম</a>

                        <div className="relative">
                            <button className="text-black hover:text-gray-600" onClick={handleToggleDesktopSubMenu}>
                                পণ্য সমূহ
                                <i className={`fas fa-chevron-down ml-2 transition-transform duration-300 ${isDesktopSubMenuOpen ? 'rotate-180' : ''}`} id="desktopArrowIcon"></i>
                            </button>
                        </div>
                        <a id="desktopOrderTrackButton" className="text-black hover:text-gray-600" href="/order-track" onClick={handleOrderTrackClick}>অর্ডার ট্র্যাক</a>

                    </nav>
                </div>

                {/* ডেস্কটপ টপ বার (সাবমেনু) */}
                <div className={`hidden absolute top-full left-0 w-full bg-white shadow-lg z-60 ${isDesktopSubMenuOpen ? 'md:block' : ''}`} id="desktopSubMenuBar">
                    <div className="container mx-auto p-4">
                        <div className="grid grid-cols-4 gap-4">
                            <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200" href="#all" onClick={() => handleSubMenuItemClick('all')}>সকল প্রোডাক্ট</a>
                            <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200" href="#health" onClick={() => handleSubMenuItemClick('health')}>স্বাস্থ্য</a>
                            <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200" href="#cosmetics" onClick={() => handleSubMenuItemClick('cosmetics')}>মেকআপ</a>
                            <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200" href="#skincare" onClick={() => handleSubMenuItemClick('skincare')}>স্কিনকেয়ার</a>
                            <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200" href="#haircare" onClick={() => handleSubMenuItemClick('haircare')}>হেয়ারকেয়ার</a>
                            <a className="block p-2 text-gray-800 hover:bg-gray-100" href="#mehandi" onClick={() => handleSubMenuItemClick('mehandi')}>মেহেদী</a>
                        </div>
                    </div>
                </div>


            </header>

            {/* মোবাইল সার্চ বার */}
            <div id="mobileSearchBar" className={`fixed top-[56px] left-0 w-full bg-white shadow-lg p-2 z-40 ${isMobileSearchBarOpen ? 'block' : ''}`}>
                <div className="relative">
                    <input className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80" id="searchInput" onInput={() => { /* searchProductsMobile() */ }} placeholder="প্রোডাক্ট সার্চ করুন..." type="text" />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400/80"></i>
                </div>
                {/* সার্চ রেজাল্ট */}
                <div className="mt-2 max-h-60 overflow-y-auto bg-white/90 backdrop-blur-sm w-full shadow-lg rounded-lg z-50" id="searchResultsMobile"></div>
            </div>
        </>
    );
};

export default Header;

=======
// app/components/Header.tsx
'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Header() {
  useEffect(() => {
    // JavaScript functionality will be loaded from layout.tsx scripts
  }, []);

  return (
    <>
      {/* হেডার */}
      <header className="bg-brushstroke text-black py-2 px-2 md:px-4 flex justify-between items-center fixed top-0 left-0 w-screen z-50">
        {/* লোগো */}
        <Link className="flex items-center text-white" href="/">
          <div className="flex items-center">
            <img 
              alt="Any's Beauty Corner লোগো" 
              className="h-10 w-10 rounded-full mr-2 border-2 border-lipstick flex-shrink-0" 
              height="40" 
              src="/img.jpg" 
              width="40" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/40';
                target.alt = 'লোগো লোড হয়নি';
              }}
            />
            <span className="text-base md:text-lg font-bold whitespace-nowrap text-black">
              Any's Beauty Corner
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-2">
          {/* ডেস্কটপ সার্চ বার */}
          <div className="hidden md:block p-2 md:flex-grow relative">
            <div className="relative">
              <input 
                className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80" 
                id="searchInputDesktop" 
                placeholder="প্রোডাক্ট সার্চ করুন..." 
                type="text" 
              />
              <i className="fas fa-search text-2xl absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"></i>
            </div>
            {/* সার্চ রেজাল্ট */}
            <div className="mt-2 max-h-60 overflow-y-auto absolute bg-white/90 backdrop-blur-sm w-full shadow-lg rounded-lg z-50 hidden" id="searchResultsDesktop"></div>
          </div>

          {/* মোবাইল সার্চ আইকন */}
          <div id="mobileSearchIcon" className="md:hidden cursor-pointer">
            <i className="fas fa-search text-2xl text-gray-800"></i>
          </div>

          {/* Notification icon */}
          <Link href="/notifications" className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center relative">
            <i className="fas fa-bell text-2xl"></i>
            <span id="notificationCount" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
          </Link>

          {/* শপিং ব্যাগ আইকন */}
          <button id="cartButton" className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center relative">
            <i className="fas fa-shopping-bag text-2xl"></i>
            <span id="cartCount" className="absolute -top-1 -right-1 text-gray-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">0</span>
          </button>

          {/* মোবাইল মেনু বাটন */}
          <button id="mobileMenuButton" className="text-gray-800 w-10 h-10 rounded md:hidden flex items-center justify-center">
            <i className="fas fa-bars text-2xl"></i>
          </button>

          {/* ডেস্কটপ মেনু */}
          <nav className="hidden md:flex space-x-6 items-center text-white">
            <div id="desktopLoginButton">
              <button className="flex items-center hover:text-gray-600">
                <i className="fas fa-user-circle mr-2"></i>
                <span>লগইন</span>
              </button>
            </div>
            <Link className="text-black hover:text-gray-600" href="/">হোম</Link>

            <div className="relative">
              <button className="text-black hover:text-gray-600">
                পণ্য সমূহ
                <i className="fas fa-chevron-down ml-2 transition-transform duration-300" id="desktopArrowIcon"></i>
              </button>
            </div>
            <Link id="desktopOrderTrackButton" className="text-black hover:text-gray-600" href="/track-order">
              অর্ডার ট্র্যাক
            </Link>
          </nav>
        </div>

        {/* ডেস্কটপ টপ বার (সাবমেনু) */}
        <div className="hidden absolute top-full left-0 w-full bg-white shadow-lg z-60" id="desktopSubMenuBar">
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-4 gap-4">
              <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200 cursor-pointer">সকল প্রোডাক্ট</a>
              <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200 cursor-pointer">স্বাস্থ্য</a>
              <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200 cursor-pointer">মেকআপ</a>
              <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200 cursor-pointer">স্কিনকেয়ার</a>
              <a className="block p-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200 cursor-pointer">হেয়ারকেয়ার</a>
              <a className="block p-2 text-gray-800 hover:bg-gray-100 cursor-pointer">মেহেদী</a>
            </div>
          </div>
        </div>
      </header>

      {/* মোবাইল সার্চ বার */}
      <div id="mobileSearchBar" className="fixed top-[56px] left-0 w-full bg-white shadow-lg p-2 hidden z-40">
        <div className="relative">
          <input 
            className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80" 
            id="searchInput" 
            placeholder="প্রোডাক্ট সার্চ করুন..." 
            type="text" 
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400/80"></i>
        </div>
        {/* সার্চ রেজাল্ট */}
        <div className="mt-2 max-h-60 overflow-y-auto bg-white/90 backdrop-blur-sm w-full shadow-lg rounded-lg z-50 hidden" id="searchResultsMobile"></div>
      </div>

      {/* কার্ট সাইডবার */}
      <div id="cartSidebar" className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-50">
        <div className="p-4 h-full flex flex-col">
          {/* কার্ট বন্ধ করার বাটন */}
          <button className="text-gray-600 hover:text-gray-900">
            <i className="fas fa-times"></i>
          </button>
          {/* কার্ট হেডিং */}
          <h2 className="text-xl text-black font-bold mb-4">কার্ট</h2>
          {/* কার্ট আইটেমগুলি */}
          <div id="cartItems" className="space-y-4 flex-1 overflow-y-auto"></div>
          {/* চেকআউট বাটন */}
          <div className="cart-footer mt-4">
            <p id="totalPrice" className="text-lg font-bold">মোট মূল্য: 0 টাকা</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2 hover:bg-red-600">চেকআউট</button>
          </div>
        </div>
      </div>

      {/* মোবাইল সাইডবার ওভারলে */}
      <div className="fixed inset-0 z-40 hidden" id="sidebarOverlay">
        <div className="fixed top-0 left-0 h-full w-4/5 bg-white shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out" id="sidebar">
          <div className="p-4 h-full flex flex-col">
            <button id="closeSidebarButton" className="text-gray-600 hover:text-gray-900">
              <i className="fas fa-times"></i>
            </button>
            <ul className="mt-4 flex-1 overflow-y-auto">
              <li id="mobileLoginButton" className="py-3 border-b border-gray-200">
                <button className="flex items-center w-full text-gray-800">
                  <i className="fas fa-user-circle mr-2"></i>
                  <span>লগইন</span>
                </button>
              </li>
              <li className="py-3 border-b border-gray-200">
                <Link className="block text-gray-800" href="/">হোম</Link>
              </li>

              <li className="py-3 border-b border-gray-200">
                <button className="flex items-center justify-between w-full text-left text-gray-800">
                  <span>পণ্য সমূহ</span>
                  <i className="fas fa-chevron-down ml-2 transition-transform duration-300" id="arrowIcon"></i>
                </button>
                <div className="hidden bg-white/5 backdrop-blur-sm rounded-lg mt-1 ml-4" id="subMenuMobile">
                  <a className="block px-4 py-2 text-gray-800 border-b border-gray-200 cursor-pointer">সকল প্রোডাক্ট</a>
                  <a className="block px-4 py-2 text-gray-800 border-b border-gray-200 cursor-pointer">স্বাস্থ্য</a>
                  <a className="block px-4 py-2 text-gray-800 border-b border-gray-200 cursor-pointer">মেকআপ</a>
                  <a className="block px-4 py-2 text-gray-800 border-b border-gray-200 cursor-pointer">স্কিনকেয়ার</a>
                  <a className="block px-4 py-2 text-gray-800 border-b border-gray-200 cursor-pointer">হেয়ারকেয়ার</a>
                  <a className="block px-4 py-2 text-gray-800 cursor-pointer">মেহেদী</a>
                </div>
              </li>
              <li className="py-3 border-b border-gray-200">
                <Link id="mobileOrderTrackButton" className="block text-gray-800" href="/track-order">
                  অর্ডার ট্র্যাক
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="fixed top-0 right-0 h-full w-1/5" id="blankArea"></div>
      </div>

      {/* টোস্ট নোটিফিকেশন */}
      <div id="toast" className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hidden z-50"></div>
    </>
  );
      }
>>>>>>> dc7238c36ccdd300e771ad3ac675419deb6cf6b8
