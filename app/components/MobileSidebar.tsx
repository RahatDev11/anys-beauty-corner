'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSidebar } from '../hooks/useSidebar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const MobileSidebar = () => {
    const { isOpen, closeSidebar } = useSidebar();
    const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
    const { user, loginWithGmail, logout } = useAuth();
    const router = useRouter();

    const handleToggleMobileSubMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMobileSubMenuOpen((prev) => !prev);
    };

    const handleSubMenuItemClick = (category: string) => {
        router.push(`/?filter=${category}`);
        closeSidebar();
    };

    const handleConfirmLogout = () => {
        if (window.confirm("আপনি কি লগআউট করতে চান?")) {
            logout();
        }
    };

    const renderLoginButton = () => {
        if (user) {
            const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
            return (
                <div className="relative">
                    <button className="flex items-center space-x-2 focus:outline-none" onClick={handleConfirmLogout}>
                        <span className="text-black font-semibold">{displayName}</span>
                        <svg className={`w-4 h-4 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            );
        } else {
            return (
                <button className={`flex items-center w-full`} onClick={loginWithGmail}>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="text-black">লগইন</span>
                </button>
            );
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`} id="sidebarOverlay" onClick={closeSidebar}>
                <div className={`fixed top-0 left-0 h-full w-4/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} id="sidebar" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 h-full flex flex-col">
                        <button id="closeSidebarButton" className="text-gray-600 hover:text-gray-900" onClick={closeSidebar}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <ul className="mt-4 flex-1 overflow-y-auto">
                            <li id="mobileLoginButton" className="py-3 border-b border-gray-200">
                                {renderLoginButton()}
                            </li>
                            <li className="py-3 border-b border-gray-200">
                                <Link className="block text-gray-800" href="/" onClick={closeSidebar}>হোম</Link>
                            </li>
                            <li className="py-3 border-b border-gray-200">
                                <button className="flex items-center justify-between w-full text-left text-gray-800" onClick={handleToggleMobileSubMenu}>
                                    <span>পণ্য সমূহ</span>
                                    <svg className={`w-4 h-4 ml-2 transition-transform duration-300 ${isMobileSubMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                <div className={`bg-white/5 backdrop-blur-sm rounded-lg mt-1 ml-4 ${isMobileSubMenuOpen ? 'block' : 'hidden'}`} id="subMenuMobile">
                                    <Link className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="/?filter=all" onClick={() => handleSubMenuItemClick('all')}>সকল প্রোডাক্ট</Link>
                                    <Link className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="/?filter=health" onClick={() => handleSubMenuItemClick('health')}>স্বাস্থ্য</Link>
                                    <Link className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="/?filter=cosmetics" onClick={() => handleSubMenuItemClick('cosmetics')}>মেকআপ</Link>
                                    <Link className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="/?filter=skincare" onClick={() => handleSubMenuItemClick('skincare')}>স্কিনকেয়ার</Link>
                                    <Link className="block px-4 py-2 text-gray-800 border-b border-gray-200" href="/?filter=haircare" onClick={() => handleSubMenuItemClick('haircare')}>হেয়ারকেয়ার</Link>
                                    <Link className="block px-4 py-2 text-gray-800" href="/?filter=mehandi" onClick={() => handleSubMenuItemClick('mehandi')}>মেহেদী</Link>
                                </div>
                            </li>
                            <li className="py-3 border-b border-gray-200">
                                <Link id="mobileOrderTrackButton" className="block text-gray-800" href="/order-track">অর্ডার ট্র্যাক</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="fixed top-0 right-0 h-full w-1/5" id="blankArea" onClick={closeSidebar}></div>
            </div>
        </>
    );
};

export default MobileSidebar;
