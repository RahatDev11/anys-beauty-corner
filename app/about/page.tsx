'use client';

import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white pt-24 md:pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-lipstick-dark mb-4">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-lg text-gray-600">
            Any's Beauty Corner - আপনার সৌন্দর্য এবং স্বাস্থ্যের জন্য বিশ্বস্ত সঙ্গী
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Our Story */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-3xl font-bold text-lipstick-dark mb-4">আমাদের গল্প</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Any's Beauty Corner প্রতিষ্ঠিত হয়েছিল একটি সাধারণ লক্ষ্য নিয়ে - প্রতিটি নারীকে প্রাকৃতিক এবং মানসম্পন্ন সৌন্দর্য পণ্য সরবরাহ করা। আমরা বিশ্বাস করি যে সত্যিকারের সৌন্দর্য আসে আত্মবিশ্বাস এবং যত্ন থেকে।
            </p>
            <p className="text-gray-700 leading-relaxed">
              আমাদের যাত্রা শুরু হয়েছিল একটি ছোট স্টোর থেকে, কিন্তু আজ আমরা হাজার হাজার সন্তুষ্ট গ্রাহকদের সেবা করছি। আমাদের প্রতিটি পণ্য সযত্নে নির্বাচিত এবং পরীক্ষিত।
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-3xl font-bold text-lipstick-dark mb-4">আমাদের মিশন</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-lipstick-dark text-2xl mr-3">✓</span>
                <span className="text-gray-700">প্রাকৃতিক এবং নিরাপদ সৌন্দর্য পণ্য সরবরাহ করা</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark text-2xl mr-3">✓</span>
                <span className="text-gray-700">প্রতিযোগিতামূলক মূল্যে সর্বোচ্চ মানের পণ্য নিশ্চিত করা</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark text-2xl mr-3">✓</span>
                <span className="text-gray-700">দ্রুত এবং নির্ভরযোগ্য ডেলিভারি সেবা প্রদান করা</span>
              </li>
              <li className="flex items-start">
                <span className="text-lipstick-dark text-2xl mr-3">✓</span>
                <span className="text-gray-700">গ্রাহক সন্তুষ্টিকে সর্বোচ্চ অগ্রাধিকার দেওয়া</span>
              </li>
            </ul>
          </section>

          {/* Why Choose Us */}
          <section className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-lipstick">
            <h2 className="text-3xl font-bold text-lipstick-dark mb-4">কেন আমাদের বেছে নিন?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-lipstick/10 to-transparent p-4 rounded-lg">
                <h3 className="font-bold text-lipstick-dark mb-2">প্রামাণিক পণ্য</h3>
                <p className="text-gray-600 text-sm">আমরা শুধুমাত্র প্রমাণিত এবং প্রামাণিক পণ্য বিক্রয় করি।</p>
              </div>
              <div className="bg-gradient-to-br from-lipstick/10 to-transparent p-4 rounded-lg">
                <h3 className="font-bold text-lipstick-dark mb-2">দ্রুত ডেলিভারি</h3>
                <p className="text-gray-600 text-sm">সারা দেশে দ্রুত এবং নিরাপদ ডেলিভারি সেবা।</p>
              </div>
              <div className="bg-gradient-to-br from-lipstick/10 to-transparent p-4 rounded-lg">
                <h3 className="font-bold text-lipstick-dark mb-2">সাশ্রয়ী মূল্য</h3>
                <p className="text-gray-600 text-sm">সর্বদা প্রতিযোগিতামূলক এবং ন্যায্য মূল্য নিশ্চিত করি।</p>
              </div>
              <div className="bg-gradient-to-br from-lipstick/10 to-transparent p-4 rounded-lg">
                <h3 className="font-bold text-lipstick-dark mb-2">গ্রাহক সেবা</h3>
                <p className="text-gray-600 text-sm">২৪/৭ গ্রাহক সহায়তা এবং পরামর্শ সেবা।</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <p className="text-gray-700 mb-6">আমাদের সাথে যোগ দিন এবং আপনার সৌন্দর্য যাত্রা শুরু করুন।</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-lipstick to-lipstick-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              শপিং শুরু করুন
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;

