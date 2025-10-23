// components/ProductCard.tsx - UPDATED VERSION
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/types/product';

interface ProductCardProps {
    product: Product;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    buyNow: (product: Product, quantity?: number) => void;
    buyNowSingle: (product: Product, quantity?: number) => void;
    cartItemQuantity?: number;
    showProductDetail?: (id: string) => void;
    variant?: 'normal' | 'slim';
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    buyNow,
    buyNowSingle,
    cartItemQuantity = 0,
    showProductDetail,
    variant = 'normal',
}) => {
    const router = useRouter();

    const getImageUrl = () => {
        if (!product) {
            return "https://via.placeholder.com/150?text=No+Product";
        }
        if (!product.image) {
            return "https://via.placeholder.com/150?text=No+Image";
        }
        if (typeof product.image === 'string' && product.image.includes(',')) {
            const urls = product.image.split(',').map(url => url.trim());
            const firstUrl = urls[0];
            if (firstUrl && firstUrl.startsWith('http')) {
                return firstUrl;
            }
        }
        if (typeof product.image === 'string' && product.image.startsWith('http')) {
            return product.image;
        }
        return "https://via.placeholder.com/150?text=Invalid+URL";
    };

    const imageUrl = getImageUrl();
    const productName = product?.name || 'Unknown Product';
    const productId = product?.id || 'unknown';

    // ✅ সব প্রোডাক্ট কার্ডে ক্লিক করলে প্রোডাক্ট ডিটেলস পেজে যায়
    const handleCardClick = () => {
        if (showProductDetail) {
            showProductDetail(productId);
        } else {
            router.push(`/product-detail/${productId}`);
        }
    };

    // ✅ ইভেন্ট প্রপাগেশন বন্ধ করে দিচ্ছি
    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (product && updateCartQuantity) {
            updateCartQuantity(productId, cartItemQuantity + 1);
        }
    };

    // ✅ ইভেন্ট প্রপাগেশন বন্ধ করে দিচ্ছি
    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (product && updateCartQuantity) {
            if (cartItemQuantity > 1) {
                updateCartQuantity(productId, cartItemQuantity - 1);
            } else if (cartItemQuantity === 1) {
                removeFromCart(productId);
            }
        }
    };

    // ✅ ইভেন্ট প্রপাগেশন বন্ধ করে দিচ্ছি
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (product && addToCart) {
            addToCart(product);
        }
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (product) {
            const quantity = cartItemQuantity > 0 ? cartItemQuantity : 1;
            if (buyNowSingle) {
                buyNowSingle(product, quantity);
            } else {
                buyNow(product, quantity);
            }
        }
    };

    // স্লিম ভ্যারিয়েন্ট রেন্ডার (সাইডবারের জন্য)
    if (variant === 'slim') {
        return (
            <div 
                className="flex items-center justify-between p-3 border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={handleCardClick} // ✅ পুরো কার্ডে ক্লিক করলে প্রোডাক্ট ডিটেলস
            >
                {/* বাম পাশ: ইমেজ এবং প্রোডাক্ট তথ্য */}
                <div className="flex items-center space-x-3 flex-1">
                    <img
                        src={imageUrl}
                        alt={productName}
                        className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-800 truncate hover:text-lipstick transition-colors">
                            {productName}
                        </h3>
                        <p className="text-lg font-bold text-black mt-1">
                            {product?.price ? `${product.price} টাকা` : 'Price N/A'}
                        </p>
                    </div>
                </div>

                {/* ডান পাশ: কোয়ান্টিটি কন্ট্রোল এবং অ্যাকশন বাটন */}
                <div className="flex items-center space-x-2 ml-3" onClick={(e) => e.stopPropagation()}>
                    {cartItemQuantity > 0 ? (
                        <div className="flex items-center space-x-2">
                            <div className="bg-gray-100 rounded-md flex items-center px-2 py-1">
                                <button
                                    onClick={handleDecrement}
                                    className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded-full text-xs hover:bg-gray-400 transition-colors"
                                >
                                    -
                                </button>
                                <span className="mx-2 text-sm font-medium min-w-4 text-center">
                                    {cartItemQuantity}
                                </span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded-full text-xs hover:bg-gray-400 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="text-lipstick hover:text-lipstick-dark text-sm font-medium"
                            >
                                Add
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={!product || product.stockStatus !== 'in_stock'}
                            className="bg-lipstick text-white px-3 py-1 rounded text-xs font-medium hover:bg-lipstick-dark border-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // নরমাল ভ্যারিয়েন্ট রেন্ডার (হোমপেজের জন্য)
    return (
        <div 
            className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-gray-200 hover:shadow-md transition-shadow duration-300 w-full cursor-pointer"
            onClick={handleCardClick} // ✅ পুরো কার্ডে ক্লিক করলে প্রোডাক্ট ডিটেলস
        >
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={productName}
                    className="w-full h-32 object-cover"
                />
            </div>

            <div className="p-3 flex flex-col flex-grow bg-white">
                <div className="flex-grow">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 hover:text-lipstick transition-colors">
                        {productName}
                    </h3>
                </div>

                <div>
                    <p className="text-lg font-bold mt-2 text-black">
                        {product?.price ? `${product.price} টাকা` : 'Price N/A'}
                    </p>

                    <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                        {cartItemQuantity > 0 ? (
                            <div className="w-full bg-gray-100 text-black rounded-md font-semibold flex items-center justify-between h-8 px-2">
                                <button
                                    onClick={handleDecrement}
                                    className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded-full text-xs hover:bg-gray-400 transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-sm font-medium">{cartItemQuantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded-full text-xs hover:bg-gray-400 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={!product || product.stockStatus !== 'in_stock'}
                                className="w-full bg-lipstick text-white rounded-md font-semibold flex items-center h-8 justify-center text-xs hover:bg-lipstick-dark border-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add To Cart
                            </button>
                        )}

                        <button
                            onClick={handleBuyNow}
                            disabled={!product || product.stockStatus !== 'in_stock'}
                            className="w-full bg-gray-800 text-white py-1 rounded-md font-semibold text-xs hover:bg-gray-700 transition-colors border-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now {cartItemQuantity > 0 ? `(${cartItemQuantity})` : ''}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SlimProductCard: React.FC<ProductCardProps> = (props) => {
    return <ProductCard {...props} variant="slim" />;
};

export default ProductCard;