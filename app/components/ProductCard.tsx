// components/ProductCard.tsx - FINAL VERSION
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
    cartItemQuantity?: number;
    showProductDetail?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    buyNow,
    cartItemQuantity = 0,
    showProductDetail,
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

    const handleShowProductDetail = (id: string) => {
        if (showProductDetail) {
            showProductDetail(id);
        } else {
            router.push(`/product/${id}`);
        }
    };

    const handleIncrement = () => {
        if (product && updateCartQuantity) {
            updateCartQuantity(productId, cartItemQuantity + 1);
        }
    };

    const handleDecrement = () => {
        if (product && updateCartQuantity) {
            if (cartItemQuantity > 1) {
                updateCartQuantity(productId, cartItemQuantity - 1);
            } else if (cartItemQuantity === 1) {
                removeFromCart(productId);
            }
        }
    };

    const handleBuyNow = () => {
        if (product) {
            const quantity = cartItemQuantity > 0 ? cartItemQuantity : 1;
            buyNow(product, quantity);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={productName}
                    className="w-full h-36 object-cover cursor-pointer"
                    onClick={() => handleShowProductDetail(productId)}
                />
            </div>

            <div className="p-3 flex flex-col flex-grow bg-white">
                <div className="flex-grow">
                    <h3
                        className="font-semibold text-lg mb-1 cursor-pointer"
                        onClick={() => handleShowProductDetail(productId)}
                    >
                        {productName}
                    </h3>
                </div>

                <div>
                    <p className="text-xl font-bold mt-3 text-black">
                        {product?.price ? `${product.price} টাকা` : 'Price N/A'}
                    </p>

                    <div className="mt-4 space-y-2">
                        {cartItemQuantity > 0 ? (
                            <div className="w-full bg-gray-100 text-black rounded-lg font-semibold flex items-center justify-between h-10 px-3">
                                <button
                                    onClick={handleDecrement}
                                    className="w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full text-sm hover:bg-gray-400 transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-lg">{cartItemQuantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full text-sm hover:bg-gray-400 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => product && addToCart(product)}
                                disabled={!product || product.stockStatus !== 'in_stock'}
                                className="w-full bg-lipstick text-white rounded-lg font-semibold flex items-center h-10 justify-center text-sm hover:bg-lipstick-dark border-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add To Cart
                            </button>
                        )}

                        <button
                            onClick={handleBuyNow}
                            disabled={!product || product.stockStatus !== 'in_stock'}
                            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors border-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;