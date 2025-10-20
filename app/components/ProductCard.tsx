'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    const imageUrl = product.image || "https://via.placeholder.com/150";
    const router = useRouter();

    // ✅ Debug logging
    console.log(`🖼️ ProductCard: ${product.name}`, {
        hasImage: !!product.image,
        imageUrl: imageUrl,
        imageField: product.image
    });

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
                <Image
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-36 object-cover cursor-pointer"
                    onClick={() => handleShowProductDetail(product.id)}
                    width={250}
                    height={144}
                    unoptimized={true} // ✅ IMPORTANT: Add this line
                    onLoad={() => console.log(`✅ Image loaded successfully: ${product.name}`)}
                    onError={(e) => {
                        console.log(`❌ Image failed to load: ${product.name}`, {
                            imageUrl: imageUrl,
                            productId: product.id
                        });
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150";
                    }}
                />
                {/* ✅ Debug badge */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {product.image ? "✅" : "❌"}
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