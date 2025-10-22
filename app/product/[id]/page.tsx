// app/product/[id]/page.tsx - UPDATED VERSION
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database, ref, onValue } from '@/lib/firebase';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import { Product } from '@/types/product';
import ProductCard from '../../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [mainImage, setMainImage] = useState('');
    const [productImages, setProductImages] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { addToCart, buyNow, buyNowSingle, cart, removeFromCart, updateCartQuantity } = useCart(); // ✅ buyNowSingle যোগ করুন

    // কার্টে প্রোডাক্টের কোয়ান্টিটি পাওয়ার জন্য
    const cartItem = cart.find(item => item.id === product?.id);
    const cartItemQuantity = cartItem ? cartItem.quantity : 0;

    // ✅ FIXED: Multiple images handling
    const getAllImages = (productData: Product): string[] => {
        let images: string[] = [];

        if (productData.image && typeof productData.image === 'string' && productData.image.trim() !== '') {
            const imageString = productData.image.trim();

            if (imageString.includes(',')) {
                images = imageString
                    .split(',')
                    .map(img => img.trim())
                    .filter(img => img !== '' && (img.startsWith('http') || img.startsWith('https')));
            } 
            else if (imageString.startsWith('http') || imageString.startsWith('https')) {
                images = [imageString];
            }
        }
        else if (productData.images && typeof productData.images === 'string' && productData.images.trim() !== '') {
            images = productData.images
                .split(',')
                .map(img => img.trim())
                .filter(img => img !== '' && (img.startsWith('http') || img.startsWith('https')));
        }
        else {
            images = ['https://via.placeholder.com/400x300/ffffff/cccccc?text=No+Image+Available'];
        }

        return images;
    };

    useEffect(() => {
        if (!id) return;

        const productRef = ref(database, `products/${id}`);
        onValue(productRef, (snapshot) => {
            if (snapshot.exists()) {
                const productData = { id: snapshot.key, ...snapshot.val() } as Product;
                setProduct(productData);

                const allImages = getAllImages(productData);
                setProductImages(allImages);

                if (allImages.length > 0) {
                    setMainImage(allImages[0]);
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

    // ✅ FIXED: Quantity handler functions with proper event handling
    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product) {
            updateCartQuantity(product.id, cartItemQuantity + 1);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product) {
            if (cartItemQuantity > 1) {
                updateCartQuantity(product.id, cartItemQuantity - 1);
            } else {
                removeFromCart(product.id);
            }
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product) {
            addToCart(product);
        }
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product) {
            const quantity = cartItemQuantity > 0 ? cartItemQuantity : 1;
            
            if (buyNowSingle) {
                // ✅ buyNowSingle ব্যবহার করুন - শুধু এই প্রোডাক্টটি যাবে
                buyNowSingle(product, quantity);
            } else {
                // ✅ পুরানো ফাংশন (fallback)
                buyNow(product, quantity);
            }
        }
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lipstick mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
            {/* ✅ FIXED: Reduced padding-top */}
            <main className="p-4 pt-4 md:pt-6 max-w-4xl mx-auto pb-24">
                {/* Main Product */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                            {mainImage && !imageError ? (
                                <Image 
                                    src={mainImage} 
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
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <div className="text-4xl text-gray-400 mb-2">📷</div>
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images - Show only if multiple images */}
                        {productImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto py-2">
                                {productImages.map((image, index) => (
                                    <div 
                                        key={index}
                                        className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer border-2 rounded-lg transition-all ${
                                            mainImage === image ? 'border-lipstick' : 'border-gray-200 hover:border-lipstick'
                                        }`}
                                        onClick={() => handleThumbnailClick(image)}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-lg"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                            unoptimized={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="space-y-4">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h1>
                        <p className="text-lipstick text-xl lg:text-2xl font-bold">{product.price} ৳</p>

                        <div className="space-y-2">
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

                        {/* ✅ FIXED: Action Buttons with proper event handling */}
                        <div className="space-y-3">
                            {cartItemQuantity > 0 ? (
                                <div className="w-full bg-gray-100 text-black rounded-lg font-semibold flex items-center justify-between h-12 px-4">
                                    <button
                                        onClick={handleDecrement}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full text-lg hover:bg-gray-400 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-bold">{cartItemQuantity}</span>
                                    <button
                                        onClick={handleIncrement}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full text-lg hover:bg-gray-400 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stockStatus !== 'in_stock'}
                                    className="w-full bg-lipstick text-white rounded-lg font-semibold flex items-center h-12 justify-center text-base hover:bg-lipstick-dark border-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add To Cart
                                </button>
                            )}

                            <button
                                onClick={handleBuyNow}
                                disabled={product.stockStatus !== 'in_stock'}
                                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-base hover:bg-gray-700 transition-colors border-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy Now {cartItemQuantity > 0 ? `(${cartItemQuantity})` : ''}
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

                {/* ✅ FIXED: Related Products with proper spacing */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold text-center mb-6 text-lipstick-dark">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.slice(0, 4).map((relatedProduct) => {
                                const relatedCartItem = cart.find(item => item.id === relatedProduct.id);
                                const relatedCartQuantity = relatedCartItem ? relatedCartItem.quantity : 0;

                                return (
                                    <ProductCard
                                        key={relatedProduct.id}
                                        product={relatedProduct}
                                        addToCart={addToCart}
                                        removeFromCart={removeFromCart}
                                        updateCartQuantity={updateCartQuantity}
                                        buyNow={buyNow}
                                        buyNowSingle={buyNowSingle} // ✅ buyNowSingle prop পাস করুন
                                        cartItemQuantity={relatedCartQuantity}
                                        showProductDetail={(productId) => router.push(`/product/${productId}`)}
                                    />
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            {/* ✅ FIXED: Fixed Order Bar */}
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

            {/* ✅ FIXED: Modal */}
            {showModal && mainImage && (
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
                            unoptimized={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;