@tailwind base;
@tailwind components;
@tailwind utilities;

/* Font Faces */
@font-face {
  font-family: 'SolaimanLipi';
  src: url('/fonts/SolaimanLipi.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Base Styles */
:root {
  --lipstick: #E8547C;
  --lipstick-dark: #C91E63;
  --lipstick-light: #F5A9C1;
  --background: #FFF5F7;
  --highlight: #FFD700;
  --rose-gold: #B76E79;
  --blush: #FFB6C1;
  --coral: #FF7F50;
  --peach: #FFDAB9;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: 'SolaimanLipi', 'Helvetica Neue', Arial, sans-serif;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

body {
  color: #1f2937;
  background: var(--background);
  padding-top: 0 !important;
  margin: 0 !important;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Custom Colors */
.bg-brushstroke { 
  background-color: var(--lipstick-light) !important; 
}

.text-lipstick { 
  color: var(--lipstick) !important; 
}

.bg-lipstick { 
  background-color: var(--lipstick) !important; 
}

.border-lipstick { 
  border-color: var(--lipstick) !important; 
}

.hover\:bg-lipstick-dark:hover { 
  background-color: var(--lipstick-dark) !important; 
}

.bg-highlight { 
  background-color: var(--highlight) !important; 
}

.text-highlight { 
  color: black !important; 
}

.bg-background { 
  background-color: var(--background) !important; 
}

.text-orange-600 { 
  color: #ea580c !important; 
}

/* ✅ FIXED: Header Styles */
header.bg-brushstroke {
  min-height: 64px !important;
  display: flex !important;
  align-items: center !important;
}

/* Logo Size */
header .flex.items-center img {
  height: 36px !important;
  width: 36px !important;
}

/* Logo Text Size */
header .text-sm.sm\:text-base.md\:text-lg {
  font-size: 1rem !important;
}

/* Icon Buttons Size */
header .text-gray-800.w-8.h-8.md\:w-10.md\:h-10 {
  width: 40px !important;
  height: 40px !important;
}

/* Icon Size */
header .text-lg.md\:text-xl {
  font-size: 1.3rem !important;
}

/* ✅ FIXED: Cart Sidebar Styles - Partial width on both mobile and desktop */
.cart-sidebar {
  position: fixed !important;
  top: 0 !important;
  right: -100% !important;
  height: 100vh !important;
  background: white !important;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15) !important;
  z-index: 10000 !important;
  transition: right 0.3s ease-in-out !important;
  overflow-y: auto !important;
}

/* Mobile Cart - Partial width on mobile */
.cart-sidebar.mobile-cart {
  width: 85% !important;
  max-width: 320px !important;
}

/* Desktop Cart - Fixed width on desktop */
.cart-sidebar.desktop-cart {
  width: 400px !important;
  max-width: 400px !important;
}

.cart-sidebar.open {
  right: 0 !important;
}

/* Cart Sidebar Overlay */
.cart-sidebar-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  z-index: 9999 !important;
  cursor: pointer !important;
}

/* ✅ FIXED: Mobile Sidebar Styles */
.mobile-sidebar {
  position: fixed !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  max-width: 300px !important;
  height: 100vh !important;
  background: white !important;
  box-shadow: 5px 0 25px rgba(0, 0, 0, 0.15) !important;
  z-index: 9998 !important;
  transition: left 0.3s ease-in-out !important;
  overflow-y: auto !important;
}

.mobile-sidebar.open {
  left: 0 !important;
}

/* Mobile Sidebar Overlay */
.mobile-sidebar-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  z-index: 9997 !important;
  cursor: pointer !important;
}

/* ✅ FIXED: Mobile Submenu Styles */
.mobile-sidebar .ml-6.space-y-1 .block {
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #374151 !important;
  border-radius: 0.5rem !important;
  transition: all 0.3s ease !important;
  font-family: 'SolaimanLipi', sans-serif !important;
  margin: 0.125rem 0 !important;
}

.mobile-sidebar .ml-6.space-y-1 .block:hover {
  background-color: #f8fafc !important;
  color: var(--lipstick) !important;
  transform: translateX(4px) !important;
}

/* Mobile Specific Adjustments */
@media (max-width: 768px) {
  header .flex.items-center img {
    height: 32px !important;
    width: 32px !important;
  }

  header .text-gray-800.w-8.h-8.md\:w-10.md\:h-10 {
    width: 36px !important;
    height: 36px !important;
  }

  header .text-lg.md\:text-xl {
    font-size: 1.2rem !important;
  }
  
  /* Mobile Cart Responsive */
  .cart-sidebar.mobile-cart {
    width: 90% !important;
    max-width: 300px !important;
  }
}

/* Desktop Specific Adjustments */
@media (min-width: 769px) {
  header .flex.items-center img {
    height: 40px !important;
    width: 40px !important;
  }

  header .text-gray-800.w-8.h-8.md\:w-10.md\:h-10 {
    width: 44px !important;
    height: 44px !important;
  }

  header .text-lg.md\:text-xl {
    font-size: 1.4rem !important;
  }
}

/* Very Small Mobile Devices */
@media (max-width: 480px) {
  .cart-sidebar.mobile-cart {
    width: 92% !important;
    max-width: 280px !important;
  }
}

@media (max-width: 360px) {
  .cart-sidebar.mobile-cart {
    width: 95% !important;
    max-width: 260px !important;
  }
}

/* Loading Screen Styles */
#loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
}

#loading-screen.hidden {
  opacity: 0;
  pointer-events: none;
}

.loading-spinner {
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid var(--lipstick-dark);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: var(--lipstick-dark);
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease;
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
}

/* Form Styles */
.form-group { 
  margin-bottom: 1.5rem; 
}

.form-group label { 
  display: block; 
  font-size: 0.95rem; 
  font-weight: 500; 
  color: #4a5568; 
  margin-bottom: 0.5rem; 
}

.form-group input, 
.form-group textarea, 
.form-group select {
  width: 100%; 
  padding: 0.75rem; 
  border: 1px solid #e2e8f0; 
  border-radius: 0.5rem; 
  font-size: 1rem; 
  color: #333; 
  background: #fafafa; 
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: 'SolaimanLipi', sans-serif;
}

.form-group input:focus, 
.form-group textarea:focus, 
.form-group select:focus {
  border-color: var(--lipstick) !important; 
  box-shadow: 0 0 0 3px rgba(232, 84, 124, 0.1) !important; 
  outline: none;
}

/* Radio Button Styles */
.radio-group { 
  display: flex; 
  gap: 1rem; 
  flex-wrap: nowrap;
  justify-content: space-between;
}

.radio-custom {
  border: 2px solid var(--lipstick);
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: block;
  width: 100%;
  text-align: center;
  background-color: white;
  color: var(--lipstick);
  font-size: 0.9rem;
}

.radio-custom:hover {
  background-color: var(--lipstick) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 84, 124, 0.2);
}

.radio-group input[type="radio"]:checked + .radio-custom {
  background-color: var(--lipstick) !important;
  color: white !important;
  border-color: var(--lipstick);
}

/* Payment Notice */
.payment-notice { 
  background: #fef2f2; 
  padding: 1rem; 
  border-radius: 0.5rem; 
  font-size: 0.9rem; 
  color: var(--lipstick); 
  margin-bottom: 1.5rem; 
  border: 1px solid #e0b2b2;
  line-height: 1.5;
}

/* Cart Styles */
.cart-scroll-container {
  max-height: 280px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.cart-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.cart-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.cart-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

/* Checkout Items */
.checkout-item { 
  display: flex; 
  align-items: center; 
  padding: 0.75rem; 
  border-bottom: 1px solid #e2e8f0; 
  margin-bottom: 0.625rem; 
  transition: background-color 0.3s ease;
  border-radius: 0.375rem;
}

.checkout-item:hover {
  background-color: #f8fafc;
}

.checkout-item img { 
  width: 60px; 
  height: 60px; 
  object-fit: cover; 
  border-radius: 5px; 
  background-color: #eee;
  flex-shrink: 0;
}

/* Price Summary */
.price-summary { 
  background: #f9fafb; 
  padding: 1.25rem; 
  border-radius: 0.5rem; 
  margin-bottom: 1.5rem; 
  border: 1px solid #e5e7eb; 
}

.price-summary p.total-row { 
  font-weight: 700; 
  color: #1f2937; 
  border-top: 1px solid #e2e8f0; 
  padding-top: 0.75rem; 
  margin-top: 0.5rem; 
  margin-bottom: 0; 
  font-size: 1.1rem; 
}

.price-summary p.total-row span:last-child { 
  font-weight: 700; 
  color: var(--lipstick) !important; 
  font-size: 1.2rem;
}

/* Buttons */
.submit-btn {
  width: 100%; 
  padding: 1rem; 
  background: var(--lipstick) !important; 
  color: white !important; 
  border: none; 
  border-radius: 0.5rem; 
  font-size: 1.1rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  font-family: 'SolaimanLipi', sans-serif;
}

.submit-btn:hover:not(:disabled) { 
  background: var(--lipstick-dark) !important; 
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201, 30, 99, 0.3);
}

.submit-btn:disabled { 
  background: #9ca3af !important; 
  cursor: not-allowed; 
  opacity: 0.7; 
}

/* Messages */
.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #bbf7d0;
  margin-bottom: 1rem;
  text-align: center;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  margin-bottom: 1rem;
  text-align: center;
}

/* Order List Link */
.order-list-link { 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  text-align: center; 
  margin-top: 1.25rem; 
  color: var(--lipstick) !important; 
  text-decoration: none; 
  font-size: 0.95rem; 
  font-weight: 500; 
  transition: all 0.3s ease; 
  width: 100%; 
  padding: 0.75rem; 
  border: 1px solid #e0b2b2; 
  border-radius: 0.5rem; 
  background-color: #fff5f7; 
  font-family: 'SolaimanLipi', sans-serif;
} 

.order-list-link:hover { 
  color: var(--lipstick-dark) !important; 
  background-color: #f5e0e0; 
  border-color: #d4a3a3; 
  text-decoration: none;
  transform: translateY(-1px);
}

/* Modal Styles */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 2rem;
  border: none;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

/* Utility Classes */
.hidden {
  display: none !important;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.rotate-180 {
  transform: rotate(180deg);
}

.no-scrollbar::-webkit-scrollbar { 
  display: none; 
}

.no-scrollbar { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

/* Loading Spinner */
.fa-spinner {
  animation: spin 1s linear infinite;
}

/* ✅ FIXED: Desktop Menu Visibility */
.desktop-menu {
  display: flex !important;
  align-items: center !important;
  gap: 1.5rem !important;
}

.desktop-menu-item {
  color: black !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  font-family: 'SolaimanLipi', sans-serif !important;
  white-space: nowrap !important;
  transition: color 0.3s ease !important;
}

.desktop-menu-item:hover {
  color: #4b5563 !important;
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none !important;
  }
}

/* ✅ FIXED: Mobile Header Layout */
@media (max-width: 768px) {
  .header-container {
    padding: 0.25rem 0.5rem !important;
  }

  .mobile-header-icons {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex-shrink: 0 !important;
  }

  .mobile-icon {
    width: 32px !important;
    height: 32px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
  }

  .desktop-menu {
    display: none !important;
  }

  header.bg-brushstroke {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}

/* ✅ FIXED: Mobile Search Bar Positioning */
.mobile-search-bar-container {
  position: fixed !important;
  top: 64px !important;
  left: 0 !important;
  width: 100% !important;
  z-index: 40 !important;
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

/* ✅ FIXED: Prevent horizontal scrolling */
@media (max-width: 768px) {
  body {
    overflow-x: hidden !important;
    position: relative !important;
  }

  html {
    overflow-x: hidden !important;
  }
}

/* ✅ FIXED: Cart Badge */
.cart-badge {
  position: absolute !important;
  top: -2px !important;
  right: -2px !important;
  background: #ef4444 !important;
  color: white !important;
  border-radius: 50% !important;
  width: 16px !important;
  height: 16px !important;
  font-size: 0.7rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
}

/* Enhanced Button Styles */
.btn-primary {
  background: linear-gradient(135deg, #E8547C 0%, #C91E63 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(201, 30, 99, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(201, 30, 99, 0.3);
}

/* Card Styles */
.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(201, 30, 99, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(201, 30, 99, 0.15);
  transform: translateY(-4px);
}

/* Focus Styles for Accessibility */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #C91E63;
  outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .checkout-item img { 
    width: 50px; 
    height: 50px; 
  }

  .radio-group { 
    flex-direction: row;
    gap: 0.75rem; 
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .price-summary {
    padding: 1rem;
  }

  .submit-btn {
    padding: 0.875rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .checkout-item { 
    padding: 0.6rem; 
  }

  .checkout-item img { 
    width: 45px; 
    height: 45px; 
  }

  .submit-btn { 
    font-size: 0.95rem; 
    padding: 0.75rem; 
  }

  .cart-scroll-container {
    max-height: 220px;
  }

  .radio-custom {
    padding: 0.6rem 0.4rem;
    font-size: 0.85rem;
  }
}

/* Additional Tailwind-like Utilities */
.flex-1 { flex: 1 1 0%; }
.text-center { text-align: center; }
.block { display: block; }
.cursor-pointer { cursor: pointer; }
.transition-all { transition: all 0.3s ease; }
.duration-300 { transition-duration: 300ms; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.rounded-lg { border-radius: 0.5rem; }
.p-6 { padding: 1.5rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-6 { margin-bottom: 1.5rem; }
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.bg-white { background-color: #ffffff; }
.text-gray-600 { color: #6b7280; }
.text-gray-700 { color: #374151; }
.text-gray-800 { color: #1f2937; }

/* ✅ FIXED: Performance optimization */
@media (prefers-reduced-motion: reduce) {
  .cart-sidebar-overlay,
  .mobile-sidebar-overlay {
    backdrop-filter: blur(2px) !important;
    -webkit-backdrop-filter: blur(2px) !important;
  }
  
  .cart-sidebar,
  .mobile-sidebar {
    transition: none !important;
  }
}

/* ✅ FIXED: Safari specific fixes */
@supports (-webkit-touch-callout: none) {
  .cart-sidebar-overlay,
  .mobile-sidebar-overlay {
    backdrop-filter: blur(6px) !important;
    -webkit-backdrop-filter: blur(6px) !important;
  }
}

/* ✅ NEW: Body scroll prevention when sidebars are open */
body.sidebar-open {
  overflow: hidden !important;
}

/* ✅ FIXED: Smooth transitions for all interactive elements */
button, a, input, select, textarea {
  transition: all 0.2s ease-in-out;
}

/* ✅ FIXED: Hover effects for better UX */
header .text-gray-800.w-8.h-8.md\:w-10.md\:h-10:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.05) !important;
}

/* Logo Hover Effect */
header a:hover img {
  transform: scale(1.05) !important;
}

/* ✅ FIXED: Remove extra space below header */
main {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.container {
  margin-top: 0 !important;
}

header {
  margin-bottom: 0 !important;
}

/* ✅ FIXED: Desktop-specific styles */
@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }

  .desktop-only {
    display: flex !important;
  }
}

/* ✅ FIXED: Search Input Responsive */
.search-input-container {
  position: relative !important;
}

@media (max-width: 768px) {
  .search-input-container {
    width: 100% !important;
    max-width: 100% !important;
  }
}

/* ✅ FIXED: Mobile menu button specific styling */
.mobile-menu-button {
  background: transparent !important;
  border: none !important;
  padding: 4px !important;
  margin: 0 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 32px !important;
  height: 32px !important;
}

/* ✅ FIXED: Notification icon sizing */
.notification-icon {
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* ✅ FIXED: Cart icon container */
.cart-icon-container {
  position: relative !important;
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* ✅ FIXED: Search icon container */
.search-icon-container {
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
}

/* Text Utilities */
.text-justify {
  text-align: justify;
}

.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Spacing Utilities */
.gap-responsive {
  gap: 1rem;
}

@media (max-width: 640px) {
  .gap-responsive {
    gap: 0.5rem;
  }
}

/* Utility Classes */
.shadow-soft {
  box-shadow: 0 4px 15px rgba(201, 30, 99, 0.1);
}

.shadow-medium {
  box-shadow: 0 8px 25px rgba(201, 30, 99, 0.15);
}

.shadow-strong {
  box-shadow: 0 12px 35px rgba(201, 30, 99, 0.2);
}

.transition-smooth {
  transition: all 0.3s ease-in-out;
}

.rounded-2xl {
  border-radius: 1.5rem;
}

/* Product Skeleton Animation */
.product-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  .submit-btn,
  .order-list-link {
    display: none !important;
  }
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}