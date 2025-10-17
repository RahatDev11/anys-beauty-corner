// app/layout.tsx
'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useEffect } from 'react';

// Move metadata to a separate constant or use head.js approach
const metadata = {
  title: "Any's Beauty Corner - Premium Beauty Products",
  description: 'Discover premium beauty products, cosmetics, skincare and haircare at Any\'s Beauty Corner',
};

const inter = Inter({ subsets: ['latin'] });

// Declare OneSignal type for TypeScript
interface OneSignal {
  push: (callback: () => void) => void;
  init: (options: object) => void;
  // Add other methods/properties as needed
}

interface OneSignalArray extends Array<() => void> {
  push: (callback: () => void) => number;
}

declare global {
  interface Window {
    OneSignal: OneSignal | OneSignalArray | undefined;
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // OneSignal initialization with error handling
          if (typeof window !== 'undefined') {
            if (!window.OneSignal) {
              window.OneSignal = [] as OneSignalArray;
            }
    
            const oneSignalInstance = window.OneSignal as OneSignal;
    
            oneSignalInstance.push(function() {
              try {
                oneSignalInstance.init({
                  appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "YOUR_ONESIGNAL_APP_ID",
                  safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_ID || "YOUR_SAFARI_WEB_ID",
                  allowLocalhostAsSecureOrigin: true,
                  serviceWorkerParam: { scope: '/onesignal/' },
                  serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
                });
    
                console.log('OneSignal initialized successfully');
              } catch (error) {
                console.error('OneSignal initialization failed:', error);
              }
            });
          }
          }, []);
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* OneSignal SDK */}
        <script 
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" 
          async 
          defer
          crossOrigin="anonymous"
        ></script>
        
        {/* Preconnect to OneSignal for better performance */}
        <link rel="preconnect" href="https://cdn.onesignal.com" />
        <link rel="dns-prefetch" href="https://cdn.onesignal.com" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}