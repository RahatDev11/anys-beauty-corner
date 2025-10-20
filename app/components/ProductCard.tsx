'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/types/product';

interface ProductCardProps {
    product: Product;
    addToCart: (product: Product) => void;
    buyNow: (product: Product) => void;
    cartItemQuantity?: number;
    showProductDetail?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    addToCart,
    buyNow,
    cartItemQuantity = 0,
    showProductDetail,
}) => {
    const router = useRouter();

    // ✅ COMPREHENSIVE NULL CHECK
    const getImageUrl = () => {
        // Product null check
        if (!product) {
            console.warn('❌ Product is undefined/null');
            return "https://via.placeholder.com/150?text=No+Product";
        }

        // Product.image null check
        if (!product.image) {
            console.log(`❌ No image for product: ${product.name || 'Unknown'}`);
            return "https://via.placeholder.com/150?text=No+Image";
        }

        // Multiple URLs handling
        if (typeof product.image === 'string' && product.image.includes(',')) {
            const urls = product.image.split(',').map(url => url.trim());
            const firstUrl = urls[0];
            
            // First URL validation
            if (firstUrl && firstUrl.startsWith('http')) {
                return firstUrl;
            }
        }

        // Single URL validation
        if (typeof product.image === 'string' && product.image.startsWith('http')) {
            return product.image;
        }

        // Fallback for invalid URLs
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

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={productName}
                    className="w-full h-36 object-cover cursor-pointer"
                    onClick={() => handleShowProductDetail(productId)}
                    onLoad={() => console.log(`✅ Loaded: ${productName}`)}
                    onError={(e) => {
                        console.log(`❌ Failed: ${productName} - ${imageUrl}`);
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=Error+Loading";
                    }}
                />
                
                {/* ✅ Safe debug badge */}
                <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
                    product?.image 
                        ? (typeof product.image === 'string' && product.image.includes(',') 
                            ? 'bg-blue-500' 
                            : 'bg-green-500')
                        : 'bg-red-500'
                }`}>
                    {product?.image 
                        ? (typeof product.image === 'string' && product.image.includes(',') 
                            ? 'MULTI' 
                            : 'SINGLE')
                        : 'NONE'}
                </div>
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
                            <div className="w-full bg-gray-100 text-black rounded-lg font-semibold flex items-center h-10 justify-around">
                                <span className="text-lg">{cartItemQuantity} in cart</span>
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
                            onClick={() => product && buyNow(product)}
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