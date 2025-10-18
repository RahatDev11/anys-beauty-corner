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
    const [selectedImage, setSelectedImage] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
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
    const mainImage = images[selectedImage] || "https://via.placeholder.com/500x400.png?text=No+Image";
    
    // Description truncation logic
    const description = product.description || '';
    const shouldTruncate = description.length > 150;
    const displayDescription = showFullDescription || !shouldTruncate 
        ? description 
        : `${description.substring(0, 150)}...`;

    return (
        <div className="min-h-screen bg-background">
            {/* Header will be included via layout */}
            
            <main className="p-4 pt-24 md:pt-28 max-w-4xl mx-auto">
                {/* Product Content - matches HTML structure */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Gallery */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative aspect-[4/3]">
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="border border-gray-200 rounded-lg cursor-pointer"
                                />
                            </div>
                            
                            {images.length > 1 && (
                                <div className="flex md:flex-col gap-2 overflow-x-auto md:max-h-80 md:overflow-y-auto">
                                    {images.map((img, index) => (
                                        <div 
                                            key={index}
                                            className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer border-2 rounded ${
                                                index === selectedImage ? 'border-lipstick' : 'border-transparent'
                                            }`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Product Details */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
                            <p className="text-lipstick text-xl lg:text-2xl font-bold mb-4">{product.price} টাকা</p>
                            
                            <div className="mb-6 space-y-2">
                                <div>
                                    <span className="text-gray-600">Category: </span>
                                    <span className="font-semibold">{product.category}</span>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        product.stockStatus === 'in-stock' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-3 mb-6">
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-lipstick text-white py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={product.stockStatus !== 'in-stock'}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-brushstroke text-black py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={product.stockStatus !== 'in-stock'}
                                >
                                    Buy Now
                                </button>
                            </div>
                            
                            {/* Description */}
                            <div className="description-container">
                                <p className="text-gray-700 mb-3 leading-relaxed">{displayDescription}</p>
                                {shouldTruncate && (
                                    <button 
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="text-lipstick font-semibold text-sm focus:outline-none"
                                    >
                                        {showFullDescription ? 'Show Less' : 'Read More'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section - Placeholder */}
                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-center mb-4 text-lipstick-dark">Related Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Related products will be loaded here */}
                        <div className="text-center py-8 text-gray-500">
                            Related products coming soon...
                        </div>
                    </div>
                </section>
            </main>

            {/* Fixed Order Bar - matches HTML structure */}
            <div className="fixed bottom-0 left-0 w-full bg-white p-3 shadow-lg z-40" style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}>
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <div>
                        <span className="text-gray-600">Total Items: <span className="font-bold text-lipstick">0</span></span>
                        <p className="font-bold text-lg text-lipstick">BDT <span>0.00</span></p>
                    </div>
                    <button 
                        onClick={() => router.push('/cart')}
                        className="font-bold py-3 px-6 rounded-lg bg-lipstick text-white hover:bg-lipstick-dark transition-colors"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}