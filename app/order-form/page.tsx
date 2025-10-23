'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { database, ref, push, set } from '@/lib/firebase';
import { SlimProductCard } from '../components/ProductCard';

const OrderForm = () => {
    const { cart, buyNowItems, clearCart, updateCartQuantity, removeFromCart, addToCart, buyNow, buyNowSingle } = useCart();
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

    // ✅ buyNowItems ব্যবহার করুন, না হলে cart ব্যবহার করুন
    const orderItems = buyNowItems.length > 0 ? buyNowItems : cart;
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const deliveryFee = deliveryLocation === 'insideDhaka' ? 70 : 160;
    const totalAmount = totalPrice + deliveryFee;

    // ✅ Check if there are items to order
    useEffect(() => {
        if (orderItems.length === 0) {
            router.push('/');
        }
    }, [orderItems, router]);

    // Firebase-এ অর্ডার SAVE করার ফাংশন
    const saveOrderToFirebase = async (orderData: any) => {
        try {
            console.log('🚀 Saving order to Firebase...', orderData);

            const ordersRef = ref(database, 'orders');
            const newOrderRef = push(ordersRef);
            const orderId = newOrderRef.key;

            await set(newOrderRef, {
                ...orderData,
                id: orderId,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            console.log('✅ Order saved successfully with ID:', orderId);
            return orderId;

        } catch (error) {
            console.error('❌ Error saving order to Firebase:', error);
            throw new Error('Failed to save order to database');
        }
    };

    // SlimProductCard এর জন্য প্রয়োজনীয় props
    const productCardProps = {
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateCartQuantity: updateCartQuantity,
        buyNow: buyNow,
        buyNowSingle: buyNowSingle,
    };

    // Validation function
    const validateForm = () => {
        if (orderItems.length === 0) {
            throw new Error('No items to order!');
        }

        if (!customerName.trim()) {
            throw new Error('Please enter your name');
        }

        if (!phoneNumber.trim() || !/^01[3-9][0-9]{8}$/.test(phoneNumber)) {
            throw new Error('Please enter a valid phone number (01XXXXXXXXX)');
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
            validateForm();

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
                orderItems: orderItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    image: item.image || ''
                })),
                pricing: {
                    subtotal: totalPrice,
                    deliveryFee: deliveryFee,
                    totalAmount: totalAmount,
                    totalItems: totalItems
                },
                status: 'pending',
                orderNumber: `ORD-${Date.now()}`,
                orderType: buyNowItems.length > 0 ? 'buy_now_single' : 'cart'
            };

            const orderId = await saveOrderToFirebase(orderData);

            alert(`✅ Order placed successfully!\nOrder ID: ${orderId}\nWe will contact you soon at ${phoneNumber}`);

            // ✅ Clear appropriate items
            clearCart();

            router.push('/');

        } catch (error: any) {
            console.error('Order submission error:', error);
            setSubmitError(error.message);
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
        const newErrors = {
            customerName: customerName && !customerName.trim() ? 'Name is required' : '',
            phoneNumber: phoneNumber && !/^01[3-9][0-9]{8}$/.test(phoneNumber) ? 'Invalid phone number' : '',
            address: address && !address.trim() ? 'Address is required' : '',
            deliveryPaymentMethod: '',
            paymentNumber: '',
            transactionId: ''
        };
        setErrors(newErrors);
    }, [customerName, phoneNumber, address]);

    if (orderItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">No items to order</h1>
                    <p className="text-gray-600 mb-6">Please add some products to your cart before placing an order.</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="bg-lipstick text-white px-6 py-3 rounded-lg hover:bg-lipstick-dark transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto pt-4 pb-12 px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-center mb-8 text-lipstick">Checkout</h1>

                <form id="checkoutForm" onSubmit={handleCheckout}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-6 text-lipstick">Billing Details</h2>

                                {submitError && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                        {submitError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="customerName" 
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick ${
                                                errors.customerName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required 
                                            placeholder="Enter your full name" 
                                            value={customerName} 
                                            onChange={(e) => setCustomerName(e.target.value)} 
                                        />
                                        {errors.customerName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="tel" 
                                            id="phoneNumber" 
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick ${
                                                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required 
                                            pattern="01[3-9][0-9]{8}" 
                                            placeholder="01XXXXXXXXX" 
                                            value={phoneNumber} 
                                            onChange={(e) => setPhoneNumber(e.target.value)} 
                                        />
                                        {errors.phoneNumber && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        id="address" 
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick ${
                                            errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required 
                                        placeholder="Enter your complete delivery address" 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)} 
                                        rows={3}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="deliveryNote" className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery Note (Optional)
                                    </label>
                                    <textarea 
                                        id="deliveryNote" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                                        placeholder="Any special delivery instructions..." 
                                        value={deliveryNote} 
                                        onChange={(e) => setDeliveryNote(e.target.value)} 
                                        rows={2}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Delivery Location <span className="text-red-500">*</span>
                                    </label>
                                    <div className="radio-group justify-between">
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="deliveryLocation" 
                                                value="insideDhaka" 
                                                checked={deliveryLocation === 'insideDhaka'} 
                                                onChange={(e) => setDeliveryLocation(e.target.value)} 
                                                className="hidden"
                                            />
                                            <span className="radio-custom">
                                                ঢাকার ভিতরে (৳70)
                                            </span>
                                        </label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="deliveryLocation" 
                                                value="outsideDhaka" 
                                                checked={deliveryLocation === 'outsideDhaka'} 
                                                onChange={(e) => setDeliveryLocation(e.target.value)} 
                                                className="hidden"
                                            />
                                            <span className="radio-custom">
                                                ঢাকার বাইরে (৳160)
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {deliveryLocation === 'outsideDhaka' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Advance Payment Required
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>
                                                        ঢাকার বাইরে অর্ডার করার জন্য ডেলিভারি ফি (৳160) অগ্রিম পে করতে হবে।
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Payment Method <span className="text-red-500">*</span>
                                                </label>
                                                <div className="radio-group justify-between">
                                                    <label>
                                                        <input 
                                                            type="radio" 
                                                            name="deliveryPaymentMethod" 
                                                            value="bkash" 
                                                            checked={deliveryPaymentMethod === 'bkash'} 
                                                            onChange={(e) => setDeliveryPaymentMethod(e.target.value)} 
                                                            className="hidden"
                                                        />
                                                        <span className="radio-custom">
                                                            bKash
                                                        </span>
                                                    </label>
                                                    <label>
                                                        <input 
                                                            type="radio" 
                                                            name="deliveryPaymentMethod" 
                                                            value="nagad" 
                                                            checked={deliveryPaymentMethod === 'nagad'} 
                                                            onChange={(e) => setDeliveryPaymentMethod(e.target.value)} 
                                                            className="hidden"
                                                        />
                                                        <span className="radio-custom">
                                                            Nagad
                                                        </span>
                                                    </label>
                                                    <label>
                                                        <input 
                                                            type="radio" 
                                                            name="deliveryPaymentMethod" 
                                                            value="rocket" 
                                                            checked={deliveryPaymentMethod === 'rocket'} 
                                                            onChange={(e) => setDeliveryPaymentMethod(e.target.value)} 
                                                            className="hidden"
                                                        />
                                                        <span className="radio-custom">
                                                            Rocket
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="paymentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Payment Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        id="paymentNumber" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                                                        placeholder="01XXXXXXXXX" 
                                                        value={paymentNumber} 
                                                        onChange={(e) => setPaymentNumber(e.target.value)} 
                                                        required={deliveryLocation === 'outsideDhaka'}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Transaction ID <span className="text-red-500">*</span>
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        id="transactionId" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lipstick"
                                                        placeholder="Enter transaction ID" 
                                                        value={transactionId} 
                                                        onChange={(e) => setTransactionId(e.target.value)} 
                                                        required={deliveryLocation === 'outsideDhaka'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="w-full bg-lipstick text-white py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Placing Order...
                                        </div>
                                    ) : (
                                        `Place Order - ৳${totalAmount.toFixed(2)}`
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Order Summary - শুধু SlimProductCard ব্যবহার করা হচ্ছে */}
                        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                            <h2 className="text-2xl font-bold mb-6 text-lipstick">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                {orderItems.map((item) => (
                                    <SlimProductCard 
                                        key={item.id}
                                        product={item}
                                        cartItemQuantity={item.quantity}
                                        {...productCardProps}
                                    />
                                ))}
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">৳{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee:</span>
                                    <span className="font-semibold">৳{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total:</span>
                                    <span className="text-lipstick">৳{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-600">
                                <p>Total Items: {totalItems}</p>
                                <p className="text-xs text-lipstick mt-1">
                                    {buyNowItems.length > 0 ? 'Single product order' : 'Cart order'}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default OrderForm;