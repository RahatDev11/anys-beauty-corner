'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { database, ref, push, set } from '@/lib/firebase';

const OrderForm = () => {
    const { cart, totalItems, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryNote, setDeliveryNote] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('insideDhaka');
    const [deliveryPaymentMethod, setDeliveryPaymentMethod] = useState('');
    const [paymentNumber, setPaymentNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const deliveryFee = deliveryLocation === 'insideDhaka' ? 70 : 160;
    const totalAmount = totalPrice + deliveryFee;

    // Firebase-এ অর্ডার সAVE করার ফাংশন
    const saveOrderToFirebase = async (orderData: any) => {
        try {
            // orders নোডে নতুন অর্ডার যোগ করুন
            const ordersRef = ref(database, 'orders');
            const newOrderRef = push(ordersRef);
            
            // অর্ডার ডেটা সAVE করুন
            await set(newOrderRef, {
                ...orderData,
                id: newOrderRef.key, // Firebase generated ID
                status: 'pending', // অর্ডার স্ট্যাটাস
                createdAt: new Date().toISOString(), // অর্ডার তারিখ
                updatedAt: new Date().toISOString()
            });
            
            return newOrderRef.key; // Return the order ID
        } catch (error) {
            console.error('Error saving order to Firebase:', error);
            throw error;
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            // অর্ডার ডেটা প্রস্তুত করুন
            const orderData = {
                customerInfo: {
                    name: customerName,
                    phone: phoneNumber,
                    address: address,
                    deliveryNote: deliveryNote,
                    deliveryLocation: deliveryLocation,
                },
                paymentInfo: deliveryLocation === 'outsideDhaka' ? {
                    method: deliveryPaymentMethod,
                    paymentNumber: paymentNumber,
                    transactionId: transactionId,
                    deliveryFeePaid: true
                } : {
                    method: 'cash_on_delivery',
                    deliveryFeePaid: false
                },
                orderItems: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                })),
                pricing: {
                    subtotal: totalPrice,
                    deliveryFee: deliveryFee,
                    totalAmount: totalAmount
                },
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Firebase-এ অর্ডার সAVE করুন
            const orderId = await saveOrderToFirebase(orderData);
            
            console.log('Order saved successfully with ID:', orderId);
            
            // সাফল্য মেসেজ দেখান
            alert(`Order placed successfully! Your order ID is: ${orderId}`);
            
            // কার্ট ক্লিয়ার করুন
            clearCart();
            
            // হোম পেজে রিডাইরেক্ট করুন
            router.push('/');
            
        } catch (error) {
            console.error('Order submission error:', error);
            setSubmitError('Failed to place order. Please try again.');
            alert('Order failed! Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ঢাকার বাইরের অর্ডার হলে validation চেক করুন
    useEffect(() => {
        if (deliveryLocation === 'outsideDhaka') {
            if (!deliveryPaymentMethod || !paymentNumber || !transactionId) {
                // Optional: Show validation message
            }
        }
    }, [deliveryLocation, deliveryPaymentMethod, paymentNumber, transactionId]);

    return (
        <main className="container mx-auto pt-24 pb-12 px-4" style={{ backgroundColor: 'var(--home-bg-color, #f3f4f6)' }}>
            <form id="checkoutForm" onSubmit={handleCheckout}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Customer Information */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--home-bg-color, #ffffff)' }}>
                        <h2 className="text-2xl font-bold mb-6 text-lipstick">Billing Details</h2>

                        {submitError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {submitError}
                            </div>
                        )}

                        <div className="form-group grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="customerName" className="form-label">Your Name <span className="required-star">*</span></label>
                                <input 
                                    type="text" 
                                    id="customerName" 
                                    className="form-input" 
                                    required 
                                    placeholder="Enter your full name" 
                                    value={customerName} 
                                    onChange={(e) => setCustomerName(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="form-label">Phone Number <span className="required-star">*</span></label>
                                <input 
                                    type="tel" 
                                    id="phoneNumber" 
                                    className="form-input" 
                                    required 
                                    pattern="01[3-9][0-9]{8}" 
                                    placeholder="01XXXXXXXXX" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Full Address <span className="required-star">*</span></label>
                            <textarea 
                                id="address" 
                                rows={3} 
                                className="form-input" 
                                required 
                                placeholder="House No, Road No, Area, City" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="deliveryNote" className="form-label">Additional Information (Optional)</label>
                            <textarea 
                                id="deliveryNote" 
                                rows={2} 
                                className="form-input" 
                                placeholder="Special instructions for delivery (optional)" 
                                value={deliveryNote} 
                                onChange={(e) => setDeliveryNote(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Delivery Area <span className="required-star">*</span></label>
                            <div className="radio-group justify-between">
                                <label className="flex-1 text-center">
                                    <input 
                                        type="radio" 
                                        name="deliveryLocation" 
                                        value="insideDhaka" 
                                        className="form-radio hidden" 
                                        checked={deliveryLocation === 'insideDhaka'} 
                                        onChange={(e) => setDeliveryLocation(e.target.value)} 
                                    /> 
                                    <span className="radio-custom bg-white border-2 border-lipstick text-lipstick py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-lipstick hover:text-white block">
                                        Inside Dhaka
                                    </span>
                                </label>
                                <label className="flex-1 text-center ml-4">
                                    <input 
                                        type="radio" 
                                        name="deliveryLocation" 
                                        value="outsideDhaka" 
                                        className="form-radio hidden" 
                                        checked={deliveryLocation === 'outsideDhaka'} 
                                        onChange={(e) => setDeliveryLocation(e.target.value)} 
                                    /> 
                                    <span className="radio-custom bg-white border-2 border-lipstick text-lipstick py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-lipstick hover:text-white block">
                                        Outside Dhaka
                                    </span>
                                </label>
                            </div>
                        </div>

                        {deliveryLocation === 'outsideDhaka' && (
                            <div id="paymentNotice" className="payment-notice">
                                <div className="flex items-start">
                                    <i className="fas fa-exclamation-circle mt-1 mr-3"></i>
                                    <div>
                                        <strong className="block mb-2">Advance Payment Required</strong>
                                        <p className="text-sm">For orders outside Dhaka, a delivery charge of <strong>160 Taka</strong> has to be paid in advance.</p>
                                        <p className="text-sm mt-2">Please send money to <strong>01972580114</strong> and provide the information below.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {deliveryLocation === 'outsideDhaka' && (
                            <div id="deliveryPaymentGroup" className="space-y-4 mt-4">
                                <div className="form-group">
                                    <label htmlFor="deliveryPaymentMethod" className="form-label">Payment Method <span className="required-star">*</span></label>
                                    <select 
                                        id="deliveryPaymentMethod" 
                                        className="form-input" 
                                        value={deliveryPaymentMethod} 
                                        onChange={(e) => setDeliveryPaymentMethod(e.target.value)}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="bkash">Bkash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="rocket">Rocket</option>
                                    </select>
                                </div>
                                <div id="paymentNumberGroup" className="form-group">
                                    <label htmlFor="paymentNumber" className="form-label">Your Payment Number <span className="required-star">*</span></label>
                                    <input 
                                        type="text" 
                                        id="paymentNumber" 
                                        className="form-input" 
                                        placeholder="Your mobile number" 
                                        value={paymentNumber} 
                                        onChange={(e) => setPaymentNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div id="transactionIdGroup" className="form-group">
                                    <label htmlFor="transactionId" className="form-label">Transaction ID <span className="required-star">*</span></label>
                                    <input 
                                        type="text" 
                                        id="transactionId" 
                                        className="form-input" 
                                        placeholder="Transaction ID" 
                                        value={transactionId} 
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--home-bg-color, #ffffff)' }}>
                        <h2 className="text-2xl font-bold mb-6 text-lipstick">Your Order</h2>

                        <div className="checkout-items">
                            <div id="checkoutItems" className="cart-scroll-container">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} ৳</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="price-summary">
                            <p>
                                <span>Sub-total</span> 
                                <span id="subTotalDisplay">{totalPrice.toFixed(2)} ৳</span>
                            </p>
                            <p>
                                <span>Delivery Fee</span> 
                                <span id="deliveryFeeDisplay">{deliveryFee.toFixed(2)} ৳</span>
                            </p>
                            <p className="total-row">
                                <span>Total</span> 
                                <span id="totalAmountDisplay">{totalAmount.toFixed(2)} ৳</span>
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            id="submitButton" 
                            className="submit-btn mt-6 w-full bg-lipstick text-white py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || cart.length === 0}
                        >
                            {isSubmitting ? 'Placing Order...' : 'Place Order'}
                        </button>

                        <div className="mt-4 text-center text-sm text-gray-600">
                            <p>By confirming the order, you agree to our <a href="/terms" className="text-lipstick underline">Terms and Conditions</a></p>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default OrderForm;