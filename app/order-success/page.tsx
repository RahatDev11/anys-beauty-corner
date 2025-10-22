// app/order-success/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

const OrderSuccessPage = () => {
    const router = useRouter();
    const { cart, clearCart } = useCart();
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        // যদি কার্ট খালি থাকে, তাহলে হোম পেজে redirect করুন
        if (cart.length === 0) {
            // localStorage থেকে অর্ডার ডিটেইলস পড়ার চেষ্টা করুন
            const savedOrder = localStorage.getItem('lastOrder');
            if (savedOrder) {
                setOrderDetails(JSON.parse(savedOrder));
            } else {
                router.push('/');
            }
        } else {
            // নতুন অর্ডার হলে ডেটা সেট করুন এবং কার্ট ক্লিয়ার করুন
            const orderData = {
                orderNumber: `ORD-${Date.now()}`,
                items: cart.length,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            setOrderDetails(orderData);
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
            clearCart();
        }
    }, [cart, clearCart, router]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Success Card */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-green-500 py-8 px-6 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
                        <p className="text-green-100 text-lg">Thank you for your purchase</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                            
                            {orderDetails && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Number:</span>
                                        <span className="font-semibold text-lipstick">{orderDetails.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Items:</span>
                                        <span className="font-semibold">{orderDetails.items} items</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-semibold text-lg text-lipstick">৳{orderDetails.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Status:</span>
                                        <span className="font-semibold text-green-600">Confirmed</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Next Steps */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Next?</h3>
                            <div className="space-y-3 text-gray-600">
                                <div className="flex items-start">
                                    <div className="w-6 h-6 bg-lipstick text-white rounded-full flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">1</div>
                                    <p>You will receive a confirmation call within 30 minutes</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 bg-lipstick text-white rounded-full flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">2</div>
                                    <p>Your order will be processed and shipped within 24 hours</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 bg-lipstick text-white rounded-full flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">3</div>
                                    <p>Delivery: 1-3 business days inside Dhaka, 3-5 days outside Dhaka</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                            <p className="text-blue-700 text-sm">
                                Call us at: <a href="tel:01972580114" className="font-semibold">01972580114</a> or 
                                Email: <a href="mailto:support@nahid.com" className="font-semibold">support@nahid.com</a>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/"
                                className="flex-1 bg-lipstick text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors"
                            >
                                Continue Shopping
                            </Link>
                            <Link 
                                href="/orders"
                                className="flex-1 border-2 border-lipstick text-lipstick text-center py-3 px-6 rounded-lg font-semibold hover:bg-lipstick hover:text-white transition-colors"
                            >
                                View My Orders
                            </Link>
                        </div>

                        {/* Social Sharing */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 mb-3">Share your purchase with friends</p>
                            <div className="flex justify-center space-x-4">
                                <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <span className="text-sm font-semibold">f</span>
                                </button>
                                <button className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                    <span className="text-sm font-semibold">t</span>
                                </button>
                                <button className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                                    <span className="text-sm font-semibold">in</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Products Section (Optional) */}
                <div className="max-w-2xl mx-auto mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">You Might Also Like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* এখানে রিকমেন্ডেড প্রোডাক্টস দেখাতে পারেন */}
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                            <p className="text-sm font-semibold">Product 1</p>
                            <p className="text-lipstick font-bold">৳500</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                            <p className="text-sm font-semibold">Product 2</p>
                            <p className="text-lipstick font-bold">৳700</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                            <p className="text-sm font-semibold">Product 3</p>
                            <p className="text-lipstick font-bold">৳300</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                            <p className="text-sm font-semibold">Product 4</p>
                            <p className="text-lipstick font-bold">৳900</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;