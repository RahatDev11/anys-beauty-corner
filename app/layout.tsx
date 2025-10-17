'use client';

// Removed 'type' from Metadata import as it's not being exported in this client component.
import { Inter } from "next/font/google";
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useEffect } from 'react';

// NOTE: Since this file is a Client Component ('use client'), Next.js Metadata
// export is ignored. The current approach of using <head> tags is correct here, 
// but in a real-world app, consider moving layout logic to a Server Component 
// and using the official exported 'metadata' object.
const pageMetadata = {
  title: "Any's Beauty Corner - Premium Beauty Products",
  description: 'Discover premium beauty products, cosmetics, skincare and haircare at Any\'s Beauty Corner',
};

const inter = Inter({ subsets: ['latin'] });

// --- OneSignal Custom Types ---
// Interface for the fully loaded OneSignal object
interface OneSignal {
  push: (callback: () => void) => void;
  init: (options: object) => void;
  // Add other methods/properties as needed
}

// Interface for the initial stub array (which only has a push method)
interface OneSignalArray extends Array<() => void> {
  // OneSignal's push method typically accepts a function (callback)
  push: (callback: () => void) => number; 
}

// Extend the global Window interface to include OneSignal
declare global {
  interface Window {
    // We allow OneSignal to be the fully loaded object, the stub array, or undefined
    OneSignal: OneSignal | OneSignalArray | undefined;
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // OneSignal initialization with the TypeScript fix
    if (typeof window !== 'undefined') {
      
      // FIX: Use 'any' to safely initialize the global OneSignal array stub.
      // This bypasses the Type Error (Conversion of type 'never[]' to 'OneSignalArray' may be a mistake).
      if (!(window as any).OneSignal) {
        (window as any).OneSignal = [];
      }

      // We can now safely cast the global variable to our desired OneSignal type for usage.
      const oneSignalInstance = (window as any).OneSignal as OneSignal;

      oneSignalInstance.push(function() {
        try {
          oneSignalInstance.init({
            // NOTE: You must replace the placeholders with your actual environment variables.
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
  
  // NOTE: The 'metadata' constant is still defined but unused here due to the 
  // 'use client' directive. For correct metadata handling in Next.js 13/14 App Router,
  // either remove 'use client' or define metadata in a parent server component.
  return (
    <html lang="en">
      <head>
        {/* Using local pageMetadata constant for title and meta tags */}
        <title>{pageMetadata.title}</title>
        <meta name="description" content={pageMetadata.description} />
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