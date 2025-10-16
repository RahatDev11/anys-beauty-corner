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