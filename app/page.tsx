'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    images: string[];
    tags: string[];
    description: string;
    isInSlider?: boolean;
    sliderOrder?: number;
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cart, addToCart, updateQuantity, buyNow } = useCart();
    const { isAdmin } = useAuth();

    useEffect(() => {
        // Fetch products from Firebase
        const productsRef = ref(database, "products/");
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setProducts(productsData);
            } else {
                setProducts([]);
            }
        });

        // Fetch events from Firebase
        const eventsRef = ref(database, "events/");
        onValue(eventsRef, (snapshot) => {
            if (snapshot.exists()) {
                const eventsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setEvents(eventsData);
            } else {
                setEvents([]);
            }
        });
    }, []);

    const showProductDetail = (id: string) => {
        router.push(`/product-detail/${id}`);
    };

    const sliderProducts = products.filter(p => p.isInSlider).sort((a, b) => (a.sliderOrder || 99) - (b.sliderOrder || 99));

    const filteredProducts = useMemo(() => {
        const filterCategory = searchParams.get('filter');
        if (filterCategory && filterCategory !== 'all') {
            return products.filter(p => p.category === filterCategory);
        }
        return products;
    }, [products, searchParams]);

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

                <section className="mb-8">
                    <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">Our Events</h2>
                    <EventSlider events={events} />
                </section>

                <section className="mb-8">
                    <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">New Products</h2>
                    <ProductSlider products={sliderProducts} showProductDetail={showProductDetail} />
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-lipstick-dark text-center mb-8">All Products</h2>
                    <ProductList
                        products={filteredProducts}
                        cartItems={cart}
                        addToCart={(product) => addToCart(product)}
                        updateQuantity={updateQuantity}
                        buyNow={(product) => buyNow(product)}
                    />
                </section>
            </div>
        </main>
    );
}
