<<<<<<< HEAD
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

export default function HomePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
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
=======
// app/page.tsx
'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // JavaScript functionality will be loaded from layout.tsx scripts
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-500 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Any's Beauty Corner
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Premium Beauty Products & Cosmetics
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-rose-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-rose-600 transition-all">
              View Products
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover our exclusive collection of premium beauty products
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-rose-100 to-pink-200 rounded-t-2xl flex items-center justify-center">
                <div className="text-6xl">💄</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Luxury Lipstick</h3>
                <p className="text-gray-600 mb-4">Premium matte finish with long-lasting color</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-rose-600">৳ 1,200</span>
                  <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-t-2xl flex items-center justify-center">
                <div className="text-6xl">🧴</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Face Cream</h3>
                <p className="text-gray-600 mb-4">Hydrating cream for glowing skin</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-rose-600">৳ 2,500</span>
                  <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-200 rounded-t-2xl flex items-center justify-center">
                <div className="text-6xl">🌟</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Highlighter</h3>
                <p className="text-gray-600 mb-4">Radiant glow for special occasions</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-rose-600">৳ 1,800</span>
                  <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-purple-100 to-violet-200 rounded-t-2xl flex items-center justify-center">
                <div className="text-6xl">🎨</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Eye Shadow</h3>
                <p className="text-gray-600 mb-4">Vibrant colors palette</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-rose-600">৳ 2,200</span>
                  <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 text-center mb-12">Find your perfect beauty products</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Makeup', icon: '💄', count: '45 Products' },
              { name: 'Skincare', icon: '🧴', count: '32 Products' },
              { name: 'Haircare', icon: '💇', count: '28 Products' },
              { name: 'Fragrance', icon: '🌸', count: '15 Products' }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'Free shipping on orders over ৳ 2,000' },
              { icon: '💎', title: 'Premium Quality', desc: '100% authentic and high-quality products' },
              { icon: '💝', title: 'Special Offers', desc: 'Regular discounts and loyalty rewards' }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { name: 'Fatima Ahmed', comment: 'Best quality products with amazing customer service!', rating: '★★★★★' },
              { name: 'Ayesha Rahman', comment: 'Fast delivery and genuine products. Highly recommended!', rating: '★★★★★' },
              { name: 'Maria Khan', comment: 'Love the lipstick collection. Colors are just perfect!', rating: '★★★★☆' }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-yellow-400 text-lg mb-3">{testimonial.rating}</div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="text-gray-800 font-bold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 opacity-90">Get exclusive offers and beauty tips</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-rose-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <p>📞 +880 1XXX-XXXXXX</p>
              <p>✉️ info@anysbeauty.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Store Hours</h3>
              <p>Open 9:00 AM - 10:00 PM</p>
              <p>Everyday</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex justify-center gap-4">
                <span className="cursor-pointer hover:text-rose-300">📘 Facebook</span>
                <span className="cursor-pointer hover:text-rose-300">📷 Instagram</span>
                <span className="cursor-pointer hover:text-rose-300">🐦 Twitter</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
>>>>>>> dc7238c36ccdd300e771ad3ac675419deb6cf6b8
}