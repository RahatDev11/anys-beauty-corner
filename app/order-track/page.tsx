// app/order-track/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { database, ref, onValue } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react'; // ✅ NextAuth imports

interface OrderItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

interface Order {
    id: string;
    orderId: string;
    orderDate: string;
    customerName: string;
    phoneNumber: string;
    customerEmail?: string;
    address: string;
    deliveryLocation: string;
    paymentMethod: string;
    subTotal: number;
    deliveryFee: number;
    totalAmount: number;
    advancePayment?: number;
    status: string;
    cartItems: OrderItem[];
    userId?: string;
    guestId?: string;
}

// Helper function for status display
function getStatusText(status: string) {
    const statuses: { [key: string]: string } = {
        processing: 'প্রসেসিং',
        confirmed: 'কনফার্মড', 
        packaging: 'প্যাকেজিং',
        shipped: 'ডেলিভারি হয়েছে',
        delivered: 'সম্পন্ন হয়েছে', 
        failed: 'ব্যর্থ', 
        cancelled: 'ক্যানসেলড'
    };
    return statuses[status] || 'অজানা';
}

function getStatusColor(status: string) {
    const colors: { [key: string]: { text: string, bg: string } } = {
        processing: { text: 'text-yellow-800', bg: 'bg-yellow-100' },
        confirmed: { text: 'text-blue-800', bg: 'bg-blue-100' },
        packaging: { text: 'text-purple-800', bg: 'bg-purple-100' },
        shipped: { text: 'text-cyan-800', bg: 'bg-cyan-100' },
        delivered: { text: 'text-green-800', bg: 'bg-green-100' },
        failed: { text: 'text-red-800', bg: 'bg-red-100' },
        cancelled: { text: 'text-gray-800', bg: 'bg-gray-200' }
    };
    return colors[status] || colors.cancelled;
}

const OrderTrack = () => {
    const { user, loginWithGmail, loading: authLoading } = useAuth();
    const { data: session, status: sessionStatus } = useSession(); // ✅ NextAuth session
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    // ✅ Combined User Data (Priority: NextAuth > Your Auth)
    const currentUser = session?.user || user;
    const isLoggedIn = !!currentUser;

    // Get guest ID from localStorage
    const getGuestId = () => {
        let guestId = localStorage.getItem('guestId');
        if (!guestId) {
            guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guestId', guestId);
        }
        return guestId;
    };

    useEffect(() => {
        if (!authLoading && sessionStatus !== 'loading') {
            if (isLoggedIn) {
                // Load orders for logged in user
                const ordersRef = ref(database, 'orders');
                onValue(ordersRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const ordersData: Order[] = [];
                        snapshot.forEach((childSnapshot) => {
                            const order = { id: childSnapshot.key, ...childSnapshot.val() };
                            // Show orders for this user (both NextAuth and Firebase auth)
                            if (order.userId === user?.uid || order.customerEmail === session?.user?.email) {
                                ordersData.push(order);
                            }
                        });
                        setOrders(ordersData.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
                    } else {
                        setOrders([]);
                    }
                    setLoading(false);
                });
            } else {
                // Load orders for guest user
                const guestId = getGuestId();
                const ordersRef = ref(database, 'orders');
                onValue(ordersRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const ordersData: Order[] = [];
                        snapshot.forEach((childSnapshot) => {
                            const order = { id: childSnapshot.key, ...childSnapshot.val() };
                            // Show orders for this guest
                            if (order.guestId === guestId) {
                                ordersData.push(order);
                            }
                        });
                        setOrders(ordersData.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
                    } else {
                        setOrders([]);
                    }
                    setLoading(false);
                });
            }
        }
    }, [user, authLoading, isLoggedIn, session, sessionStatus]);

    // ✅ NextAuth Google Login Handler
    const handleGoogleLogin = async () => {
        setLoginLoading(true);
        try {
            await signIn('google', { 
                callbackUrl: '/order-track',
                redirect: true 
            });
        } catch (error) {
            console.error('Google login failed:', error);
            setLoginLoading(false);
        }
    };

    // ✅ Combined Login Handler (Both Auth Systems)
    const handleLogin = async () => {
        setLoginLoading(true);
        try {
            // Try NextAuth first, if fails try Firebase
            await signIn('google', { 
                callbackUrl: '/order-track',
                redirect: true 
            });
        } catch (error) {
            console.error('NextAuth login failed, trying Firebase:', error);
            try {
                await loginWithGmail();
            } catch (firebaseError) {
                console.error('Firebase login also failed:', firebaseError);
            } finally {
                setLoginLoading(false);
            }
        }
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // ✅ Combined loading state
    const isLoading = authLoading || sessionStatus === 'loading';

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lipstick mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto pt-20 pb-8 px-4 min-h-screen">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-4 text-lipstick">
                        {isLoggedIn ? `My Orders (${currentUser.name || currentUser.displayName || currentUser.email})` : 'My Orders (Guest)'}
                    </h2>

                    {!isLoggedIn && (
                        <div className="text-center mb-6">
                            <p className="text-gray-600 mb-4">
                                You are viewing orders as a guest. Login to access all features.
                            </p>
                            <button 
                                className="bg-lipstick text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 mx-auto"
                                onClick={handleLogin}
                                disabled={loginLoading}
                            >
                                {loginLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <i className="fab fa-google text-white"></i>
                                )}
                                {loginLoading ? 'Logging in...' : 'Login with Google'}
                            </button>
                        </div>
                    )}

                    {isLoggedIn && (
                        <div className="text-center mb-4">
                            <p className="text-green-600 font-semibold">
                                ✅ Logged in as {currentUser.name || currentUser.displayName || currentUser.email}
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lipstick mx-auto mb-4"></div>
                            <p className="text-lg text-gray-600">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-6xl text-gray-300 mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                            <button 
                                onClick={() => router.push('/')}
                                className="mt-4 bg-lipstick text-white px-6 py-2 rounded-lg hover:bg-lipstick-dark transition-colors"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const statusColor = getStatusColor(order.status);
                                return (
                                    <div 
                                        key={order.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => openOrderDetails(order)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-lg">Order #{order.orderId}</h3>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor.bg} ${statusColor.text}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">Placed on: {formatDate(order.orderDate)}</p>
                                                <p className="text-gray-600">Customer: {order.customerName}</p>
                                                <p className="text-gray-600">Total: ৳{order.totalAmount}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <button className="text-lipstick font-semibold hover:underline">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-lipstick">Order Details</h2>
                                <button 
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                    onClick={() => setShowModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Order Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Order Information</h3>
                                        <p><strong>Order ID:</strong> #{selectedOrder.orderId}</p>
                                        <p><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                                        <p><strong>Status:</strong> 
                                            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status).bg} ${getStatusColor(selectedOrder.status).text}`}>
                                                {getStatusText(selectedOrder.status)}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Customer Information</h3>
                                        <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
                                        {selectedOrder.customerEmail && (
                                            <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Information */}
                                <div>
                                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                                    <p><strong>Address:</strong> {selectedOrder.address}</p>
                                    <p><strong>Location:</strong> {selectedOrder.deliveryLocation}</p>
                                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="font-semibold mb-2">Order Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.cartItems.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold">৳{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Total */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>৳{selectedOrder.subTotal}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Delivery Fee:</span>
                                        <span>৳{selectedOrder.deliveryFee}</span>
                                    </div>
                                    {selectedOrder.advancePayment && (
                                        <div className="flex justify-between mb-2">
                                            <span>Advance Payment:</span>
                                            <span>৳{selectedOrder.advancePayment}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total Amount:</span>
                                        <span>৳{selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderTrack;