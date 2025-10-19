'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    const [importantLinksOpen, setImportantLinksOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [policiesOpen, setPoliciesOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    const toggleMenu = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(prev => !prev);
    };

    return (
        <footer style={{ backgroundColor: '#F4A7B9' }} className="text-gray-700 py-4">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Top Row: Brand Info & Social Links */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2 mb-2 pb-2 border-b border-gray-300">
                    <div className="text-center md:text-left md:max-w-sm">
                        <Link href="/" className="inline-flex items-center space-x-3 group mb-4" aria-label="Any&#39;s Beauty Corner Home">
                            <Image alt="Any&#39;s Beauty Corner লোগো" className="h-10 w-10 rounded-full border-2 border-gray-800/20 group-hover:opacity-90 transition-opacity" src="/img.jpg" width={40} height={40} />
                            <span className="text-lg font-semibold text-gray-800 transition-colors">Any&#39;s Beauty Corner</span>
                        </Link>
                        <p className="text-xs leading-relaxed text-gray-700">আপনার সৌন্দর্য চর্চার বিশ্বস্ত সঙ্গী।</p>
                    </div>
                    <div className="flex space-x-3 mt-4 md:mt-0">
                        <a href="https://www.facebook.com/Anysbeautycorner" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="social-icon-link bg-gray-800/10 hover:bg-gray-800/20 text-gray-800 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"><i className="fab fa-facebook-f text-sm"></i></a>
                        <a href="https://www.instagram.com/anysbeautycorner" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="social-icon-link bg-gray-800/10 hover:bg-gray-800/20 text-gray-800 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"><i className="fab fa-instagram text-sm"></i></a>
                        <a href="https://wa.me/8801931866636" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="social-icon-link bg-gray-800/10 hover:bg-gray-800/20 text-gray-800 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"><i className="fab fa-whatsapp text-sm"></i></a>
                        <a href="https://www.youtube.com/anysbeautycorner" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className="social-icon-link bg-gray-800/10 hover:bg-gray-800/20 text-gray-800 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"><i className="fab fa-youtube text-sm"></i></a>
                        <a href="https://www.tiktok.com/@anysbeautycorner" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok" className="social-icon-link bg-gray-800/10 hover:bg-gray-800/20 text-gray-800 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"><i className="fab fa-tiktok text-sm"></i></a>
                    </div>
                </div>

                {/* Middle Row: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4 cursor-pointer flex justify-between items-center" onClick={() => toggleMenu(setImportantLinksOpen)}>
                            <span>দরকারি লিংক</span>
                            <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${importantLinksOpen ? 'rotate-180' : ''}`}></i>
                        </h4>
                        <ul id="importantLinksMenu" className={`space-y-2 ${importantLinksOpen ? 'block' : 'hidden'}`}>
                            <li><Link href="/" className="text-sm text-gray-700 hover:text-gray-900">হোম</Link></li>
                            <li><Link href="/order-track" className="text-sm text-gray-700 hover:text-gray-900">অর্ডার ট্র্যাক</Link></li>
                            <li><Link href="/order-list" className="text-sm text-gray-700 hover:text-gray-900">আমার অর্ডার</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4 cursor-pointer flex justify-between items-center" onClick={() => toggleMenu(setCategoriesOpen)}>
                            <span>ক্যাটাগরি</span>
                            <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`}></i>
                        </h4>
                        <ul id="categoriesMenu" className={`space-y-2 ${categoriesOpen ? 'block' : 'hidden'}`}>
                            <li><Link href="/?filter=all" className="text-sm text-gray-700 hover:text-gray-900">সকল প্রোডাক্ট</Link></li>
                            <li><Link href="/?filter=makeup" className="text-sm text-gray-700 hover:text-gray-900">মেকআপ</Link></li>
                            <li><Link href="/?filter=skincare" className="text-sm text-gray-700 hover:text-gray-900">স্কিনকেয়ার</Link></li>
                            <li><Link href="/?filter=haircare" className="text-sm text-gray-700 hover:text-gray-900">হেয়ারকেয়ার</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4 cursor-pointer flex justify-between items-center" onClick={() => toggleMenu(setPoliciesOpen)}>
                            <span>নীতিমালা</span>
                            <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${policiesOpen ? 'rotate-180' : ''}`}></i>
                        </h4>
                        <ul id="policiesMenu" className={`space-y-2 ${policiesOpen ? 'block' : 'hidden'}`}>
                            <li><a onClick={(e) => e.preventDefault()} className="text-sm text-gray-700 hover:text-gray-900">প্রাইভেসি পলিসি</a></li>
                            <li><a onClick={(e) => e.preventDefault()} className="text-sm text-gray-700 hover:text-gray-900">শর্তাবলী</a></li>
                            <li><a onClick={(e) => e.preventDefault()} className="text-sm text-gray-700 hover:text-gray-900">রিটার্ন পলিসি</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4 cursor-pointer flex justify-between items-center" onClick={() => toggleMenu(setContactOpen)}>
                            <span>যোগাযোগ</span>
                            <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${contactOpen ? 'rotate-180' : ''}`}></i>
                        </h4>
                        <ul id="contactMenu" className={`space-y-3 text-sm ${contactOpen ? 'block' : 'hidden'}`}>
                            <li className="flex items-start text-gray-700"><i className="fas fa-map-marker-alt mt-1 mr-2 w-3 text-center"></i><span>মিরপুর ১০, ঢাকা</span></li>
                            <li className="flex items-center text-gray-700"><i className="fas fa-phone-alt mr-2 w-3 text-center"></i><a href="tel:+8801931866636" className="hover:text-gray-900">+880 1931-866636</a></li>
                            <li className="flex items-center text-gray-700"><i className="fas fa-envelope mr-2 w-3 text-center"></i><a href="mailto:info@anysbeautycorner.com" className="hover:text-gray-900 break-all">info@anysbeautycorner.com</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Row: Copyright */}
                <div className="border-t border-gray-300 pt-6 mt-6 text-sm text-center text-gray-600">
                    <p>© <span id="currentYear"></span> Any&#39;s Beauty Corner. সর্বস্বত্ব সংরক্ষিত।</p>
                    <p className="mt-1">ডেভেলপ করেছে: <a href="https://devxhub.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 font-medium">Nahid</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

