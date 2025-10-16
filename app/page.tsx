// app/page.tsx
'use client';

import { useEffect } from 'react';
import Header from './components/Header';

export default function HomePage() {
  useEffect(() => {
    // JavaScript functionality will be loaded from layout.tsx scripts
  }, []);

  return (
    <div>
      <div id="website-content">
        <Header />

        {/* মূল কন্টেন্ট */}
        <main className="p-4 pt-24 pb-24">
          <section id="new-arrivals">
            <div className="swiper new-product-slider rounded-lg shadow-md">
              <div className="swiper-wrapper" id="new-product-slider-wrapper"></div>
              <div className="swiper-pagination"></div>
            </div>
          </section>

          <section id="products" className="mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center mt-2 mb-2 text-lipstick-dark">Upcoming Events</h2>
              <div className="swiper event-slider rounded-lg">
                <div className="swiper-wrapper" id="event-slider-wrapper"></div>
                <div className="swiper-pagination !bottom-2"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mt-4 mb-4 text-lipstick-dark">All Products</h2>
            <div id="productList" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
          </section>

          {/* ======================= অ্যাডমিন সেকশন ======================= */}

          {/* প্রোডাক্ট ম্যানেজমেন্ট */}
          <section id="product-management" className="hidden p-4 bg-white rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold text-center mb-4 text-lipstick-dark">প্রোডাক্ট ম্যানেজমেন্ট</h2>

            {/* প্রোডাক্ট যোগ/এডিট করার ফর্ম */}
            <form id="productForm" className="mb-6 border-b pb-6">
              <input type="hidden" id="productId" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="productName" className="block text-gray-700">পণ্যের নাম</label>
                  <input type="text" id="productName" className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="productPrice" className="block text-gray-700">দাম</label>
                  <input type="number" id="productPrice" className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="productCategory" className="block text-gray-700">ক্যাটাগরি</label>
                  <select id="productCategory" className="w-full p-2 border rounded">
                    <option value="health">স্বাস্থ্য</option>
                    <option value="cosmetics">মেকআপ</option>
                    <option value="skincare">স্কিনকেয়ার</option>
                    <option value="haircare">হেয়ারকেয়ার</option>
                    <option value="mehandi">মেহেদী</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="productStockStatus" className="block text-gray-700">স্টক স্ট্যাটাস</label>
                  <select id="productStockStatus" className="w-full p-2 border rounded">
                    <option value="in_stock">স্টকে আছে</option>
                    <option value="out_of_stock">স্টকে নেই</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">ছবি URL</label>
                <div id="imageInputs">
                  <input type="text" className="w-full p-2 border rounded mb-2 image-input" placeholder="ছবির লিংক ১" />
                </div>
                <button type="button" className="bg-lipstick-dark text-white px-3 py-1 rounded-sm mt-2 text-sm hover:bg-opacity-80">
                  <i className="fas fa-plus"></i> আরেকটি ছবি
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="productTags" className="block text-gray-700">ট্যাগ (কমা দিয়ে আলাদা করুন)</label>
                <input type="text" id="productTags" className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="productDescription" className="block text-gray-700">বিবরণ</label>
                <textarea id="productDescription" className="w-full p-2 border rounded" rows={4} required></textarea>
              </div>
              <button type="submit" className="bg-lipstick-dark text-white px-4 py-2 rounded hover:bg-opacity-90">প্রোডাক্ট সেভ করুন</button>
              <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90">ফর্ম রিসেট</button>
            </form>

            {/* সব প্রোডাক্টের তালিকা */}
            <h3 className="text-lg font-bold mb-2 text-lipstick-dark">সকল প্রোডাক্টের তালিকা</h3>
            <div id="productListAdmin" className="space-y-2 max-h-96 overflow-y-auto"></div>
          </section>

          {/* হেডার স্লাইডার ম্যানেজমেন্ট */}
          <section id="slider-management" className="hidden p-4 bg-white rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold text-center mb-4 text-lipstick-dark">হেডার স্লাইডার ম্যানেজমেন্ট</h2>
            <p className="text-center text-sm text-gray-600 mb-4">এখান থেকে সিলেক্ট করুন কোন প্রোডাক্টগুলো হোমপেজের উপরের স্লাইডারে দেখাবে এবং তাদের সিরিয়াল দিন।</p>
            <div id="sliderProductListAdmin" className="space-y-2 max-h-96 overflow-y-auto"></div>
          </section>

          {/* ইভেন্ট ব্যানার ম্যানেজমেন্ট ফর্ম */}
          <section id="event-update" className="hidden p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4 text-lipstick-dark">ইভেন্ট ব্যানার ম্যানেজমেন্ট</h2>
            <form id="eventForm" className="mb-6 border-b pb-6">
              <p className="text-center text-sm text-gray-500 mb-4">যেকোনো একটি তথ্য দিলেই ব্যানার পোস্ট করা যাবে।</p>
              <input type="hidden" id="eventId" />
              <div className="mb-4">
                <label htmlFor="eventTitle" className="block text-gray-700">শিরোনাম (ঐচ্ছিক)</label>
                <input type="text" id="eventTitle" className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-gray-700">বিবরণ (ঐচ্ছিক)</label>
                <textarea id="eventDescription" className="w-full p-2 border rounded" rows={2}></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="eventImageUrl" className="block text-gray-700">ছবির URL (ঐচ্ছিক)</label>
                <input type="text" id="eventImageUrl" className="w-full p-2 border rounded" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input type="checkbox" id="eventIsActive" className="form-checkbox h-5 w-5 text-lipstick-dark" />
                  <span className="ml-2 text-gray-700">হোমপেজে দেখান</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">সর্বোচ্চ ৩টি ব্যানার হোমপেজে দেখানো যাবে।</p>
              </div>
              <button type="submit" className="bg-lipstick-dark text-white px-4 py-2 rounded hover:bg-opacity-90">ব্যানার সেভ করুন</button>
              <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90">ফর্ম রিসেট</button>
            </form>
            <h3 className="text-lg font-bold mb-2 text-lipstick-dark">সকল ব্যানার</h3>
            <div id="eventListAdmin" className="space-y-2"></div>
          </section>
        </main>

        <div id="place-order-bar" className="fixed bottom-0 left-0 w-full bg-white p-3 shadow-lg z-40 hidden">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-600">Total Items: <span id="bar-item-count" className="font-bold text-red-500">0</span></span>
              <p className="font-bold text-lg text-red-500">BDT <span id="bar-total-price">0.00</span></p>
            </div>
            <button className="font-bold py-3 px-6 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
              Place Order
            </button>
          </div>
        </div>
        
        {/* Footer will be loaded by JavaScript */}
        <div id="footer"></div>
      </div>
    </div>
  );
}
