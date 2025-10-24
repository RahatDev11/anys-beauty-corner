'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { database, ref, push, set } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

const OrderForm = () => {
    const { cart, totalItems, totalPrice, clearCart, updateCartQuantity, removeFromCart } = useCart();
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

    // কোয়ান্টিটি বাড়ানোর ফাংশন
    const handleIncreaseQuantity = (productId: string) => {
        const product = cart.find(item => item.id === productId);
        if (product) {
            updateCartQuantity(productId, product.quantity + 1);
        }
    };

    // কোয়ান্টিটি কমানোর ফাংশন
    const handleDecreaseQuantity = (productId: string) => {
        const product = cart.find(item => item.id === productId);
        if (product && product.quantity > 1) {
            updateCartQuantity(productId, product.quantity - 1);
        }
    };

    // প্রোডাক্ট রিমুভ করার ফাংশন
    const handleRemoveProduct = (productId: string) => {
        removeFromCart(productId);
    };

    // Firebase-এ অর্ডার সAVE করার ফাংশন
    const saveOrderToFirebase = async (orderData: any) => {
        try {
            const ordersRef = ref(database, 'orders');
            const newOrderRef = push(ordersRef);

            await set(newOrderRef, {
                ...orderData,
                id: newOrderRef.key,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return newOrderRef.key;
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
                    total: item.price * item.quantity,
                    image: item.image
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

            const orderId = await saveOrderToFirebase(orderData);

            console.log('Order saved successfully with ID:', orderId);
            alert(`Order placed successfully! Your order ID is: ${orderId}`);

            clearCart();
            router.push('/');

        } catch (error) {
            console.error('Order submission error:', error);
            setSubmitError('Failed to place order. Please try again.');
            alert('Order failed! Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (deliveryLocation === 'outsideDhaka') {
            if (!deliveryPaymentMethod || !paymentNumber || !transactionId) {
                // Optional: Show validation message
            }
        }
    }, [deliveryLocation, deliveryPaymentMethod, paymentNumber, transactionId]);

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
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-lipstick">Your Order</h2>

                        <div className="checkout-items">
                            <div id="checkoutItems" className="cart-scroll-container space-y-4 max-h-96 overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex gap-4">
                                            {/* ক্লিকযোগ্য প্রোডাক্ট ইমেজ */}
                                            <Link 
                                                href={`/products/${item.id}`}
                                                className="flex-shrink-0"
                                            >
                                                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                                    {item.image ? (
                                                        <Image 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                                            <span className="text-gray-500 text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                            
                                            <div className="flex-grow">
                                                {/* ক্লিকযোগ্য প্রোডাক্ট নাম */}
                                                <Link 
                                                    href={`/products/${item.id}`}
                                                    className="block"
                                                >
                                                    <p className="font-semibold text-lg hover:text-lipstick transition-colors cursor-pointer line-clamp-2">
                                                        {item.name}
                                                    </p>
                                                </Link>
                                                
                                                <p className="text-gray-600 mt-1">Price: {item.price.toFixed(2)} ৳</p>
                                                
                                                     {/* কোয়ান্টিটি কন্ট্রোল */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDecreaseQuantity(item.id)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <span className="text-lg font-bold">−</span>
                                                        </button>
                                                        
                                                        <span className="w-8 text-center font-semibold text-lg">
                                                            {item.quantity}
                                                        </span>
                                                        
                                                        <button
                                                            type="button"
                                                            onClick={() => handleIncreaseQuantity(item.id)}
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                                                        >
                                                            <span className="text-lg font-bold">+</span>
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="text-right">
                                                        <p className="font-semibold text-lg">
                                                            {(item.price * item.quantity).toFixed(2)} ৳
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveProduct(item.id)}
                                                            className="text-red-500 text-sm hover:text-red-700 mt-1 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {cart.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Your cart is empty
                            </div>
                        )}

                        <div className="price-summary mt-6 space-y-2">
                            <div className="flex justify-between py-2">
                                <span>Sub-total</span> 
                                <span id="subTotalDisplay">{totalPrice.toFixed(2)} ৳</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Delivery Fee</span> 
                                <span id="deliveryFeeDisplay">{deliveryFee.toFixed(2)} ৳</span>
                            </div>
                            <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg mt-4 pt-4">
                                <span>Total</span> 
                                <span id="totalAmountDisplay">{totalAmount.toFixed(2)} ৳</span>
                            </div>
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