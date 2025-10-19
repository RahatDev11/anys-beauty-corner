'use client';

import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductSlider from './components/ProductSlider';
import EventSlider from './components/EventSlider';
import { database, ref, onValue, off } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
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
    images: string[];
    tags: string[];
    description: string;
    isInSlider?: boolean;
    sliderOrder?: number;
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { cart, addToCart, buyNow } = useCart(); // ✅ updateQuantity remove
    const { isAdmin } = useAuth();

    useEffect(() => {
        // Fetch products from Firebase
        const productsRef = ref(database, "products/");
        const productsUnsubscribe = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ 
                    id: key, 
                    ...snapshot.val()[key] 
                }));
                setProducts(productsData);
            } else {
                setProducts([]);
            }
            setLoading(false);
        });

        // Fetch events from Firebase
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

        // ✅ Cleanup function
        return () => {
            productsUnsubscribe();
            eventsUnsubscribe();
        };
    }, []);

    const showProductDetail = (id: string) => {
        router.push(`/product/${id}`); // ✅ Corrected route
    };

    const sliderProducts = products
        .filter(p => p.isInSlider)
        .sort((a, b) => (a.sliderOrder || 99) - (b.sliderOrder || 99));

    // ✅ Loading state
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
                {isAdmin && (
                    <section className="mb-8 p-4 bg-white rounded-lg shadow-lg space-y-4">
                        <h2 className="text-2xl font-bold text-center text-lipstick-dark">Admin Panel</h2>
                        <ProductManagement />
                        <SliderManagement />
                        <EventManagement />
                    </section>
                )}

                {/* Events Section */}
                {events.filter(event => event.isActive).length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">Our Events</h2>
                        <EventSlider events={events.filter(event => event.isActive)} />
                    </section>
                )}

                {/* Featured Products Slider */}
                {sliderProducts.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">Featured Products</h2>
                        <ProductSlider 
                            products={sliderProducts} 
                            showProductDetail={showProductDetail} 
                        />
                    </section>
                )}

                {/* All Products Grid */}
                <section>
                    <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">
                        {products.length > 0 ? 'All Products' : 'No Products Available'}
                    </h2>
                    
                    {products.length > 0 ? (
                        <ProductList
                            products={products}
                            cartItems={cart}
                            addToCart={addToCart}
                            buyNow={buyNow}
                        />
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                            <p className="text-gray-500">Check back later for new products!</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}