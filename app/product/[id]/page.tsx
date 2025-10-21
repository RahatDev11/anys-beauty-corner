'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database, ref, onValue } from '@/lib/firebase';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import { Product } from '@/types/product';

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
    const { addToCart, buyNow, cart } = useCart();

    useEffect(() => {
        if (!id) return;

        const productRef = ref(database, `products/${id}`);
        onValue(productRef, (snapshot) => {
            if (snapshot.exists()) {
                const productData = { id: snapshot.key, ...snapshot.val() } as Product;
                setProduct(productData);
                
                if (productData.image) {
                    setMainImage(productData.image);
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
                } as Product));
                setProducts(productsData);
            } else {
                setProducts([]);
            }
        });
    }, [id]);

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

    const description = product.description || '';
    const shouldTruncate = description.length > 150;
    const displayDescription = showFullDescription || !shouldTruncate 
        ? description 
        : `${description.substring(0, 150)}...`;

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

    return (
        <div className="min-h-screen bg-white">
            <main className="p-4 pt-24 md:pt-28 max-w-4xl mx-auto pb-24">
                {/* Main Product */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Image Section */}
                    <div>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
                            {product.image ? (
                                <Image 
                                    src={product.image} 
                                    alt={product.name}
                                    onClick={openModal}
                                    fill 
                                    style={{objectFit: "cover"}} 
                                    className="cursor-pointer transition-transform hover:scale-105"
                                    onError={() => setImageError(true)}
                                    priority
                                    unoptimized={true}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
                                    <div className="text-4xl text-gray-400 mb-2">📷</div>
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details Section */}
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
                                    product.stockStatus === 'in_stock' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3 mb-6">
                            <button 
                                onClick={handleAddToCart}
                                className="bg-lipstick text-white py-3 px-6 rounded-lg font-semibold hover:bg-lipstick-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={product.stockStatus !== 'in_stock'}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={product.stockStatus !== 'in_stock'}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Buy Now
                            </button>
                        </div>

                        {/* Description */}
                        <div>
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

                {/* Related Products - Home Page Style */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-8 text-lipstick-dark">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                <div 
                                    key={relatedProduct.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100"
                                    onClick={() => router.push(`/product/${relatedProduct.id}`)}
                                >
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        <Image
                                            src={relatedProduct.image || ''}
                                            alt={relatedProduct.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="transition-transform duration-500 hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                            unoptimized={true}
                                        />
                                        {relatedProduct.stockStatus !== 'in_stock' && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                                            {relatedProduct.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {relatedProduct.description || 'Product description'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lipstick font-bold text-xl">
                                                ৳{relatedProduct.price}
                                            </span>
                                            {relatedProduct.stockStatus === 'in_stock' && (
                                                <span className="text-green-600 text-sm font-medium">
                                                    In Stock
                                                </span>
                                            )}
                                        </div>
                                        {relatedProduct.tags && relatedProduct.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {relatedProduct.tags.slice(0, 2).map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
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
            {showModal && product.image && (
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
                            src={product.image} 
                            alt={product.name}
                            fill
                            style={{objectFit: "contain"}} 
                            className="cursor-zoom-out"
                            unoptimized={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;