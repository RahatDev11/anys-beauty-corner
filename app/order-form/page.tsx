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

    // Firebase-এ অর্ডার সAVE করার ফাংশন - Enhanced Version
    const saveOrderToFirebase = async (orderData: any) => {
        try {
            console.log('🚀 Saving order to Firebase...', orderData);

            // orders নোডে নতুন অর্ডার যোগ করুন
            const ordersRef = ref(database, 'orders');
            const newOrderRef = push(ordersRef);
            
            const orderId = newOrderRef.key;
            
            // অর্ডার ডেটা সAVE করুন
            await set(newOrderRef, {
                ...orderData,
                id: orderId, // Firebase generated ID
                status: 'pending', // অর্ডার স্ট্যাটাস
                createdAt: new Date().toISOString(), // অর্ডার তারিখ
                updatedAt: new Date().toISOString()
            });

            console.log('✅ Order saved successfully with ID:', orderId);
            return orderId;
            
        } catch (error) {
            console.error('❌ Error saving order to Firebase:', error);
            throw new Error('Failed to save order to database');
        }
    };

    // Validation function
    const validateForm = () => {
        if (cart.length === 0) {
            throw new Error('Your cart is empty!');
        }

        if (!customerName.trim()) {
            throw new Error('Please enter your name');
        }

        if (!phoneNumber.trim() || !/^01[3-9][0-9]{8}$/.test(phoneNumber)) {
            throw new Error('Please enter a valid phone number');
        }

        if (!address.trim()) {
            throw new Error('Please enter your address');
        }

        if (deliveryLocation === 'outsideDhaka') {
            if (!deliveryPaymentMethod) {
                throw new Error('Please select payment method');
            }
            if (!paymentNumber.trim()) {
                throw new Error('Please enter payment number');
            }
            if (!transactionId.trim()) {
                throw new Error('Please enter transaction ID');
            }
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Form validation
            validateForm();

            // অর্ডার ডেটা প্রস্তুত করুন
            const orderData = {
                customerInfo: {
                    name: customerName.trim(),
                    phone: phoneNumber.trim(),
                    address: address.trim(),
                    deliveryNote: deliveryNote.trim(),
                    deliveryLocation: deliveryLocation,
                },
                paymentInfo: deliveryLocation === 'outsideDhaka' ? {
                    method: deliveryPaymentMethod,
                    paymentNumber: paymentNumber.trim(),
                    transactionId: transactionId.trim(),
                    deliveryFeePaid: true,
                    deliveryFeeAmount: deliveryFee
                } : {
                    method: 'cash_on_delivery',
                    deliveryFeePaid: false,
                    deliveryFeeAmount: deliveryFee
                },
                orderItems: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    image: item.image || '' // যদি image থাকে
                })),
                pricing: {
                    subtotal: totalPrice,
                    deliveryFee: deliveryFee,
                    totalAmount: totalAmount,
                    totalItems: totalItems
                },
                status: 'pending',
                orderNumber: `ORD-${Date.now()}` // Unique order number
            };

            // Firebase-এ অর্ডার সAVE করুন
            const orderId = await saveOrderToFirebase(orderData);
            
            // Success notification
            alert(`✅ Order placed successfully!\nOrder ID: ${orderId}\nWe will contact you soon at ${phoneNumber}`);
            
            // Clear cart and redirect
            clearCart();
            router.push('/order-success'); // আপনি একটি success page তৈরি করতে পারেন
            
        } catch (error: any) {
            console.error('Order submission error:', error);
            setSubmitError(error.message);
            alert(`❌ ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Form field validation states
    const [errors, setErrors] = useState({
        customerName: '',
        phoneNumber: '',
        address: '',
        deliveryPaymentMethod: '',
        paymentNumber: '',
        transactionId: ''
    });

    // Real-time validation
    useEffect(() => {
        const newErrors = { ...errors };
        
        if (customerName && !customerName.trim()) {
            newErrors.customerName = 'Name is required';
        } else {
            newErrors.customerName = '';
        }

        if (phoneNumber && !/^01[3-9][0-9]{8}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number';
        } else {
            newErrors.phoneNumber = '';
        }

        if (address && !address.trim()) {
            newErrors.address = 'Address is required';
        } else {
            newErrors.address = '';
        }

        setErrors(newErrors);
    }, [customerName, phoneNumber, address]);

    return (
        <main className="container mx-auto pt-24 pb-12 px-4">
            <form id="checkoutForm" onSubmit={handleCheckout}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Customer Information */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
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
                                    className={`form-input ${errors.customerName ? 'border-red-500' : ''}`}
                                    required 
                                    placeholder="Enter your full name" 
                                    value={customerName} 
                                    onChange={(e) => setCustomerName(e.target.value)} 
                                />
                                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="form-label">Phone Number <span className="required-star">*</span></label>
                                <input 
                                    type="tel" 
                                    id="phoneNumber" 
                                    className={`form-input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                    required 
                                    pattern="01[3-9][0-9]{8}" 
                                    placeholder="01XXXXXXXXX" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Full Address <span className="required-star">*</span></label>
                            <textarea 
                                id="address" 
                                rows={3} 
                                className={`form-input ${errors.address ? 'border-red-500' : ''}`}
                                required 
                                placeholder="House No, Road No, Area, City" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)}
                            ></textarea>
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>

                        {/* ... বাকি form fields একই থাকবে ... */}
                        
                        <button 
                            type="submit" 
                            id="submitButton" 
                            className="submit-btn mt-6 w-full bg-lipstick text-white py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || cart.length === 0}
                        >
                            {isSubmitting ? 'Placing Order...' : `Place Order - ৳${totalAmount.toFixed(2)}`}
                        </button>
                    </div>

                    {/* Order Summary - একই থাকবে */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-lipstick">Your Order</h2>
                        
                        {/* ... order summary content ... */}
                    </div>
                </div>
            </form>
        </main>
    );
};

export default OrderForm;