'use client';

import { Inter } from "next/font/google";
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const pageMetadata = {
  title: "Any's Beauty Corner - Premium Beauty Products",
  description: 'Discover premium beauty products, cosmetics, skincare and haircare at Any\'s Beauty Corner',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{pageMetadata.title}</title>
        <meta name="description" content={pageMetadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* ✅ Font Awesome CDN যোগ করুন */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <Header />
                <main className="min-h-screen pt-16"> {/* ✅ Header height জন্য padding */}
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