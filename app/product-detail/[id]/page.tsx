'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database, ref, onValue } from '@/lib/firebase';
import { useCart } from '@/app/context/CartContext';
import ProductSlider from '@/app/components/ProductSlider';
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
    isInSlider?: boolean;
    sliderOrder?: number;
}

const ProductDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [mainImage, setMainImage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { addToCart, buyNow, cart } = useCart(); // ✅ getTotalPrice remove করা হয়েছে

    useEffect(() => {
        if (!id) return;

        const productRef = ref(database, `products/${id}`);
        onValue(productRef, (snapshot) => {
            if (snapshot.exists()) {
                const productData = { id: snapshot.key, ...snapshot.val() };
                setProduct(productData);
                if (productData.images && productData.images.length > 0) {
                    setMainImage(productData.images[0]);
                }
            } else {
                setProduct(null);
            }
            setLoading(false);
        });

        const productsRef = ref(database, "products/");
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ 
                    id: key, 
                    ...snapshot.val()[key] 
                }));
                setProducts(productsData);
            } else {
                setProducts([]);
            }
        });
    }, [id]);

    const handleThumbnailClick = (image: string) => {
        setMainImage(image);
        setImageError(false);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleModalClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            buyNow(product);
            router.push('/order-form');
        }
    };

    // ✅ Calculate cart totals - manual calculation
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                    <p className="text-gray-600 mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="mt-4 bg-lipstick text-white px-4 py-2 rounded-lg hover:bg-lipstick-dark transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Description truncation logic
    const description = product.description || '';
    const shouldTruncate = description.length > 150;
    const displayDescription = showFullDescription || !shouldTruncate 
        ? description 
        : `${description.substring(0, 150)}...`;

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-4 pt-24 md:pt-28 max-w-4xl mx-auto pb-24">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Gallery */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative aspect-[4/3]">
                                {mainImage && !imageError ? (
                                    <Image 
                                        src={mainImage} 
                                        alt={product.name}
                                        onClick={openModal}
                                        fill 
                                        style={{objectFit: "contain"}} 
                                        className="border border-gray-200 rounded-lg cursor-pointer transition-transform hover:scale-105"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                                        <span className="text-gray-400">Image not available</span>
                                    </div>
                                )}
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="flex md:flex-col gap-2 overflow-x-auto md:max-h-80 md:overflow-y-auto">
                                    {product.images.map((image: string, index: number) => (
                                        <div 
                                            key={index}
                                            className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer border-2 rounded transition-all ${
                                                mainImage === image ? 'border-lipstick' : 'border-transparent hover:border-gray-300'
                                            }`}
                                            onClick={() => handleThumbnailClick(image)}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded"
                                                onError={() => {}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
                            <p className="text-lipstick text-xl lg:text-2xl font-bold mb-4">{product.price} ৳</p>

                            <div className="mb-6 space-y-2">
                                <div>
                                    <span className="text-gray-600">Category: </span>
                                    <span className="font-semibold capitalize">{product.category}</span>
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
                                    className="bg-lipstick text-white py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={product.stockStatus !== 'in-stock'}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    className="bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={product.stockStatus !== 'in-stock'}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Buy Now
                                </button>
                            </div>

                            {/* Description with truncation */}
                            <div className="description-container">
                                <p className="text-gray-700 mb-3 leading-relaxed">{displayDescription}</p>
                                {shouldTruncate && (
                                    <button 
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="text-lipstick font-semibold text-sm hover:underline focus:outline-none flex items-center gap-1"
                                    >
                                        {showFullDescription ? 'Show Less' : 'Read More'}
                                        <svg className={`w-4 h-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold text-center mb-8 text-lipstick-dark">Related Products</h2>
                        <ProductSlider 
                            products={relatedProducts} 
                            showProductDetail={(productId) => router.push(`/product/${productId}`)}
                        />
                    </section>
                )}
            </main>

            {/* Fixed Order Bar */}
            {totalItems > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg z-40 border-t border-gray-200">
                    <div className="flex justify-between items-center max-w-4xl mx-auto">
                        <div>
                            <span className="text-gray-600">Total Items: <span className="font-bold text-lipstick">{totalItems}</span></span>
                            <p className="font-bold text-lg text-lipstick">BDT <span>{totalPrice.toFixed(2)}</span></p>
                        </div>
                        <button 
                            onClick={() => router.push('/order-form')}
                            disabled={totalItems === 0}
                            className="font-bold py-3 px-6 rounded-lg bg-lipstick text-white hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Place Order ({totalItems})
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                    onClick={handleModalClick}
                >
                    <button 
                        className="absolute top-4 right-4 text-white text-3xl cursor-pointer z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
                        onClick={closeModal}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                    <div className="relative w-full h-full max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        <Image 
                            src={mainImage} 
                            alt={product.name}
                            fill
                            style={{objectFit: "contain"}} 
                            className="cursor-zoom-out"
                            onError={() => setImageError(true)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;