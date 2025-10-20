'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database, ref, onValue } from '@/lib/firebase';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stockStatus: string;
    images: string[];
    tags: string[];
    description: string;
}

const ProductDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart, buyNow, cart } = useCart();

    useEffect(() => {
        if (!id) return;

        const productRef = ref(database, `products/${id}`);
        onValue(productRef, (snapshot) => {
            if (snapshot.exists()) {
                const productData = { id: snapshot.key, ...snapshot.val() };
                setProduct(productData);
            } else {
                setProduct(null);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lipstick mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
                    <button 
                        onClick={() => router.push('/')}
                        className="mt-4 bg-lipstick text-white px-4 py-2 rounded-lg hover:bg-lipstick-dark"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const mainImage = product.images?.[0] || '/placeholder-image.jpg';

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Product Image - Simple */}
                        <div className="flex-1">
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <Image 
                                    src={mainImage} 
                                    alt={product.name}
                                    fill 
                                    style={{ objectFit: "cover" }}
                                    className="rounded-lg"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Product Details - Simple */}
                        <div className="flex-1">
                            <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
                            <p className="text-lipstick text-2xl lg:text-3xl font-bold mb-6">{product.price} ৳</p>

                            <div className="mb-6">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    product.stockStatus === 'in-stock' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {product.stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <button 
                                    onClick={() => addToCart(product)}
                                    disabled={product.stockStatus !== 'in-stock'}
                                    className="w-full bg-lipstick text-white py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={() => {
                                        buyNow(product);
                                        router.push('/order-form');
                                    }}
                                    disabled={product.stockStatus !== 'in-stock'}
                                    className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {product.description && (
                                <div className="border-t pt-6">
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;