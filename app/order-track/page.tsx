
'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const OrderTrack = () => {
    const { user, loginWithGmail } = useAuth();
    const [orderId, setOrderId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleTrackOrder = () => {
        // Mock tracking logic
        if (orderId) {
            setModalContent(`Order details for ID: ${orderId}`);
            setShowModal(true);
        } else {
            alert('Please enter an order ID.');
        }
    };

    const handleLogin = () => {
        loginWithGmail();
    };

    return (
        <>
            <div className="container mx-auto pt-20 pb-8 px-4 min-h-screen">
                <div id="trackingArea" className="p-6 bg-white rounded-lg shadow-md">
                    <div id="guestTracking">
                        <h2 className="text-2xl font-bold text-center mb-4 text-lipstick">Track Your Order</h2>
                        <p className="text-center text-gray-600 mb-6">Enter your order ID to know the current status of your order.</p>
                        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input 
                                type="text" 
                                id="orderIdInput" 
                                placeholder="Enter your order ID" 
                                className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />
                            <button 
                                id="trackOrderBtn" 
                                className="bg-lipstick text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                                onClick={handleTrackOrder}
                            >
                                Track
                            </button>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4">Or, to see all your orders</p>
                    </div>
                    {!user && (
                        <div id="loginPrompt" className="text-center">
                            <button 
                                id="loginButton" 
                                className="bg-lipstick text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors mt-2"
                                onClick={handleLogin}
                            >
                                <i className="fab fa-google mr-2"></i> Login with Google
                            </button>
                        </div>
                    )}
                </div>

                {user && (
                    <div id="orderListContainer">
                        {/* Order list will be displayed here for logged in users */}
                        <div id="orderList" className="bg-white rounded-lg shadow-md mt-8 p-6">
                            <h2 className="text-2xl font-bold text-center mb-4 text-lipstick">My Orders</h2>
                            {/* Mock order list */}
                            <p>You have no orders yet.</p>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div id="orderModal" className="modal fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative p-6">
                        <span id="modalClose" className="absolute top-2 right-4 text-3xl text-gray-500 cursor-pointer" onClick={() => setShowModal(false)}>&times;</span>
                        <div id="modalContent">
                            {modalContent}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderTrack;
