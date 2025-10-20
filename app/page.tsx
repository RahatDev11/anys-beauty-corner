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

    // ✅ FIX: Extract first URL from comma-separated string
    const getImageUrl = () => {
        if (!product.image) {
            return "https://via.placeholder.com/150?text=No+Image";
        }

        // যদি multiple URLs comma separated থাকে
        if (product.image.includes(',')) {
            const urls = product.image.split(',').map(url => url.trim());
            const firstUrl = urls[0];
            console.log(`🔗 Multiple URLs found for ${product.name}, using first:`, {
                original: product.image,
                firstUrl: firstUrl,
                totalUrls: urls.length
            });
            return firstUrl;
        }

        // Single URL হলে
        if (!product.image.startsWith('http')) {
            return "https://via.placeholder.com/150?text=Invalid+URL";
        }

        return product.image;
    };

    const imageUrl = getImageUrl();

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
                    alt={product.name}
                    className="w-full h-36 object-cover cursor-pointer"
                    onClick={() => handleShowProductDetail(product.id)}
                    onLoad={() => console.log(`✅ Loaded: ${product.name}`)}
                    onError={(e) => {
                        console.log(`❌ Failed: ${product.name} - ${imageUrl}`);
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=Error+Loading";
                    }}
                />
                {/* ✅ Debug badge showing URL count */}
                <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
                    product.image && product.image.startsWith('http') 
                        ? product.image.includes(',') ? 'bg-blue-500' : 'bg-green-500'
                        : 'bg-red-500'
                }`}>
                    {product.image && product.image.includes(',') 
                        ? 'MULTI' 
                        : (product.image ? 'SINGLE' : 'NONE')}
                </div>
            </div>
            <div className="p-3 flex flex-col flex-grow bg-white">
                <div className="flex-grow">
                    <h3
                        className="font-semibold text-lg mb-1 cursor-pointer"
                        onClick={() => handleShowProductDetail(product.id)}
                    >
                        {product.name}
                    </h3>
                </div>
                <div>
                    <p className="text-xl font-bold mt-3 text-black">{product.price} টাকা</p>
                    <div className="mt-4 space-y-2">
                        {cartItemQuantity > 0 ? (
                            <div className="w-full bg-gray-100 text-black rounded-lg font-semibold flex items-center h-10 justify-around">
                                <span className="text-lg">{cartItemQuantity} in cart</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-lipstick text-white rounded-lg font-semibold flex items-center h-10 justify-center text-sm hover:bg-lipstick-dark border-none"
                            >
                                Add To Cart
                            </button>
                        )}
                        <button
                            onClick={() => buyNow(product)}
                            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors border-none"
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