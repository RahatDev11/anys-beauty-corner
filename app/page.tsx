'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProductList from './components/ProductList';
import ProductSlider from './components/ProductSlider';
import EventSlider from './components/EventSlider';
import { database, ref, onValue } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import ProductManagement from './components/admin/ProductManagement';
import SliderManagement from './components/admin/SliderManagement';
import EventManagement from './components/admin/EventManagement';

interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stockStatus: string;
    image: string;
    tags: string[];
    description: string;
    isInSlider?: boolean;
    sliderOrder?: number;
    quantity?: number;
}

function HomePageContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [firebaseError, setFirebaseError] = useState(false);
    const router = useRouter();
    const { cart, addToCart, buyNow } = useCart();
    const { isAdmin } = useAuth();

    const searchParams = useSearchParams();
    const categoryFilter = searchParams.get('filter');

    // Remove the problematic useEffect that causes infinite loop
    // useEffect(() => {
    //     console.log('🔄 Products state updated:', products?.length || 0, 'products');
    //     if (products && products.length > 0) {
    //         products.forEach((product, index) => {
    //             console.log(`📦 Product ${index + 1}:`, {
    //                 name: product?.name || 'Unknown',
    //                 price: product?.price || 'N/A',
    //                 hasImage: !!product?.image,
    //                 imageUrl: product?.image || 'NO IMAGE',
    //                 stockStatus: product?.stockStatus || 'unknown'
    //             });
    //         });
    //     }
    // }, [products]);

    const filteredProducts = products?.filter(product => {
        if (!categoryFilter || categoryFilter === 'all') {
            return true;
        }
        return product?.category === categoryFilter;
    }) || [];

    useEffect(() => {
        console.log('🚀 Fetching products from Firebase...');

        let productsUnsubscribe: any = null;
        let eventsUnsubscribe: any = null;
        let timeoutId: NodeJS.Timeout;

        try {
            const productsRef = ref(database, "products/");
            productsUnsubscribe = onValue(productsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const productsData = Object.keys(snapshot.val()).map(key => ({ 
                        id: key, 
                        ...snapshot.val()[key] 
                    }));
                    console.log('✅ Firebase products data received:', productsData.length);
                    setProducts(productsData);
                } else {
                    console.log('❌ No products found in Firebase');
                    setProducts([]);
                }
                setLoading(false);
                setFirebaseError(false);
            }, (error) => {
                console.error('🔥 Firebase error:', error);
                setFirebaseError(true);
                setLoading(false);
            });

            const eventsRef = ref(database, "events/");
            eventsUnsubscribe = onValue(eventsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const eventsData = Object.keys(snapshot.val()).map(key => ({ 
                        id: key, 
                        ...snapshot.val()[key] 
                    }));
                    setEvents(eventsData);
                } else {
                    setEvents([]);
                }
            });

            // Fallback timeout if Firebase doesn't respond
            timeoutId = setTimeout(() => {
                if (loading) {
                    console.log('⏰ Firebase timeout - setting default state');
                    setLoading(false);
                    setFirebaseError(true);
                }
            }, 10000);

        } catch (error) {
            console.error('🔥 Firebase initialization error:', error);
            setFirebaseError(true);
            setLoading(false);
        }

        return () => {
            if (productsUnsubscribe) productsUnsubscribe();
            if (eventsUnsubscribe) eventsUnsubscribe();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    const showProductDetail = (id: string) => {
        router.push(`/product/${id}`);
    };

    const sliderProducts = products?.filter(p => p.isInSlider)
        .sort((a, b) => (a.sliderOrder || 99) - (b.sliderOrder || 99)) || [];

    if (loading) {
        return (
            <main className="pt-0">
                <div className="container mx-auto">
                    <div className="flex justify-center items-center min-h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lipstick mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading products...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (firebaseError) {
        return (
            <main className="pt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12 bg-red-50 rounded-lg">
                        <div className="text-6xl text-red-300 mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-red-600 mb-2">Connection Error</h3>
                        <p className="text-red-500 mb-4">Unable to load products. Please check your connection.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-lipstick text-white px-6 py-2 rounded-lg hover:bg-lipstick-dark"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-24">
            <div className="container mx-auto">
                {isAdmin && (
                    <section className="mb-6 p-4 bg-white rounded-lg shadow-lg space-y-4">
                        <h2 className="text-2xl font-bold text-center text-lipstick-dark">Admin Panel</h2>
                        <ProductManagement />
                        <SliderManagement />
                        <EventManagement />
                    </section>
                )}

                {/* ফিচার প্রোডাক্ট উপরে - Featured Products on top (হেডার ছাড়া) */}
                {sliderProducts.length > 0 && (
                    <section className="mb-8">
                        <ProductSlider 
                            products={sliderProducts} 
                            showProductDetail={showProductDetail} 
                        />
                    </section>
                )}

                {/* আওয়ার ইভেন্টস নিচে - Our Events below */}
                {events?.filter(event => event.isActive).length > 0 && (
                    <section className="mb-12 px-4">
                        <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">Our Events</h2>
                        <EventSlider events={events.filter(event => event.isActive)} />
                    </section>
                )}

                <section className="px-4">
                    <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">
                        {categoryFilter && categoryFilter !== 'all' ? `Products in ${categoryFilter}` : 'All Products'}
                    </h2>

                    {filteredProducts.length > 0 ? (
                        <ProductList
                            products={filteredProducts}
                            cartItems={cart}
                            addToCart={addToCart}
                            buyNow={buyNow}
                        />
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <div className="text-6xl text-gray-300 mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                            <p className="text-gray-500">Check back later for new products!</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default function HomePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center pt-0">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lipstick mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading page...</p>
                </div>
            </div>
        }>
            <HomePageContent />
        </Suspense>
    );
}