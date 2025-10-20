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
    image: string; // ✅ CORRECT - আপনার database field
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
    const router = useRouter();
    const { cart, addToCart, buyNow } = useCart();
    const { isAdmin } = useAuth();

    const searchParams = useSearchParams();
    const categoryFilter = searchParams.get('filter');

    // ✅ FIXED DEBUGGING: Products data check
    useEffect(() => {
        console.log('🔄 Products state updated:', products.length, 'products');
        if (products.length > 0) {
            products.forEach((product, index) => {
                console.log(`📦 Product ${index + 1}:`, {
                    name: product.name,
                    price: product.price,
                    hasImage: !!product.image, // ✅ FIX: product.image
                    imageUrl: product.image || 'NO IMAGE', // ✅ FIX: product.image
                    stockStatus: product.stockStatus
                });
            });
        }
    }, [products]);

    const filteredProducts = products.filter(product => {
        if (!categoryFilter || categoryFilter === 'all') {
            return true;
        }
        return product.category === categoryFilter;
    });

    useEffect(() => {
        console.log('🚀 Fetching products from Firebase...');

        const productsRef = ref(database, "products/");
        const productsUnsubscribe = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ 
                    id: key, 
                    ...snapshot.val()[key] 
                }));
                console.log('✅ Firebase products data:', productsData);
                setProducts(productsData);
            } else {
                console.log('❌ No products found in Firebase');
                setProducts([]);
            }
            setLoading(false);
        });

        const eventsRef = ref(database, "events/");
        const eventsUnsubscribe = onValue(eventsRef, (snapshot) => {
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

        return () => {
            productsUnsubscribe();
            eventsUnsubscribe();
        };
    }, []);

    const showProductDetail = (id: string) => {
        router.push(`/product/${id}`);
    };

    const sliderProducts = products
        .filter(p => p.isInSlider)
        .sort((a, b) => (a.sliderOrder || 99) - (b.sliderOrder || 99));

    if (loading) {
        return (
            <main className="p-4 pt-24">
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

    return (
        <main className="p-4 pt-24">
            <div className="container mx-auto">
                {/* ✅ FIXED debug info */}
                <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Debug Info:</strong> {products.length} products loaded | 
                        Images found: {products.filter(p => p.image).length} {/* ✅ FIX: p.image */}
                    </p>
                </div>

                {isAdmin && (
                    <section className="mb-8 p-4 bg-white rounded-lg shadow-lg space-y-4">
                        <h2 className="text-2xl font-bold text-center text-lipstick-dark">Admin Panel</h2>
                        <ProductManagement />
                        <SliderManagement />
                        <EventManagement />
                    </section>
                )}

                {events.filter(event => event.isActive).length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">Our Events</h2>
                        <EventSlider events={events.filter(event => event.isActive)} />
                    </section>
                )}

                {sliderProducts.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">Featured Products</h2>
                        <ProductSlider 
                            products={sliderProducts} 
                            showProductDetail={showProductDetail} 
                        />
                    </section>
                )}

                <section>
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
            <div className="min-h-screen flex items-center justify-center pt-24">
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