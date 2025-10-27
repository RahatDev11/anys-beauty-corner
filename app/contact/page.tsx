'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white pt-24 md:pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-lipstick-dark mb-4">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-lg text-gray-600">
            আমরা আপনার প্রশ্ন এবং পরামর্শের জন্য সর্বদা প্রস্তুত
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-lipstick">
              <h3 className="text-xl font-bold text-lipstick-dark mb-2 flex items-center">
                <span className="text-2xl mr-3">📍</span>
                আমাদের ঠিকানা
              </h3>
              <p className="text-gray-700">
                Any's Beauty Corner<br />
                ঢাকা, বাংলাদেশ
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-lipstick">
              <h3 className="text-xl font-bold text-lipstick-dark mb-2 flex items-center">
                <span className="text-2xl mr-3">📞</span>
                ফোন নম্বর
              </h3>
              <p className="text-gray-700">
                <a href="tel:01931866636" className="hover:text-lipstick-dark transition">
                  01931866636
                </a>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-lipstick">
              <h3 className="text-xl font-bold text-lipstick-dark mb-2 flex items-center">
                <span className="text-2xl mr-3">📧</span>
                ইমেইল
              </h3>
              <p className="text-gray-700">
                <a href="mailto:info@anysbeautycorner.com" className="hover:text-lipstick-dark transition">
                  info@anysbeautycorner.com
                </a>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-lipstick">
              <h3 className="text-xl font-bold text-lipstick-dark mb-2 flex items-center">
                <span className="text-2xl mr-3">⏰</span>
                কর্মসময়
              </h3>
              <p className="text-gray-700">
                সোমবার - শুক্রবার: ৯:০০ AM - ৬:০০ PM<br />
                শনিবার - রবিবার: ১০:০০ AM - ৫:০০ PM
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-r from-lipstick/10 to-transparent rounded-lg p-6">
              <h3 className="text-xl font-bold text-lipstick-dark mb-4">আমাদের অনুসরণ করুন</h3>
              <div className="flex gap-4">
                <a href="#" className="text-lipstick-dark hover:text-lipstick transition text-2xl">
                  f
                </a>
                <a href="#" className="text-lipstick-dark hover:text-lipstick transition text-2xl">
                  📷
                </a>
                <a href="#" className="text-lipstick-dark hover:text-lipstick transition text-2xl">
                  💬
                </a>
                <a href="#" className="text-lipstick-dark hover:text-lipstick transition text-2xl">
                  ▶
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-lipstick-dark mb-6">আমাদের কাছে বার্তা পাঠান</h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                ✓ আপনার বার্তা সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">নাম</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                  placeholder="আপনার নাম"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">ইমেইল</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                  placeholder="আপনার ইমেইল"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">ফোন নম্বর</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                  placeholder="আপনার ফোন নম্বর"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">বিষয়</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                >
                  <option value="">বিষয় নির্বাচন করুন</option>
                  <option value="product-inquiry">পণ্য সম্পর্কে প্রশ্ন</option>
                  <option value="order-issue">অর্ডার সমস্যা</option>
                  <option value="delivery">ডেলিভারি সম্পর্কে</option>
                  <option value="feedback">প্রতিক্রিয়া</option>
                  <option value="other">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">বার্তা</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick resize-none"
                  placeholder="আপনার বার্তা এখানে লিখুন"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-lipstick to-lipstick-dark text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                বার্তা পাঠান
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;

