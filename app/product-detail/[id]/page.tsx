'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { database, ref, onValue } from '@/lib/firebase';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    stockStatus: string;
    tags?: string[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart, buyNow } = useCart();

    useEffect(() => {
        if (!productId) return;

        const productRef = ref(database, `products/${productId}`);
        
        onValue(productRef, (snapshot) => {
            if (snapshot.exists()) {
                const productData = snapshot.val();
                setProduct({ 
                    id: productId, 
                    ...productData 
                });
            } else {
                setProduct(null);
            }
            setLoading(false);
        });
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            alert('Product added to cart!');
        }
    };

    const handleBuyNow = () => {
        if (product) {
            buyNow(product);
            router.push('/order-form');
        }
    };

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
                    <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
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

    const images = product.image ? product.image.split(',').map(img => img.trim()) : [];
    const mainImage = images[0] || "https://via.placeholder.com/400";

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="relative w-full h-80 md:h-96">
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-lg"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative h-20 cursor-pointer">
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                                <p className="text-2xl font-bold text-lipstick mb-4">{product.price} টাকা</p>
                                
                                <div className="mb-4">
                                    <span className="text-sm text-gray-600">Category: </span>
                                    <span className="text-sm font-semibold">{product.category}</span>
                                </div>
                                
                                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                                
                                {product.tags && product.tags.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span 
                                                    key={index}
                                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mb-6">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                        product.stockStatus === 'in-stock' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-lipstick text-white py-3 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={product.stockStatus !== 'in-stock'}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full bg-brushstroke text-black py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={product.stockStatus !== 'in-stock'}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}