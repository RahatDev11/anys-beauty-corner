'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/app/types/product';
import { useRouter } from 'next/navigation';

interface ProductListProps {
    products: Array<Product>;
    cartItems: Array<{
        id: string;
        quantity: number;
    }>;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    buyNow: (product: Product, quantity?: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    buyNow,
}) => {
    const router = useRouter();

    const showProductDetail = (id: string) => {
        router.push(`/product/${id}`);
    };

    return (
        <div id="productList" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
                const cartItem = cartItems.find((item) => item.id === product.id);
                const cartItemQuantity = cartItem ? cartItem.quantity : 0;
                return (
                    <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        updateCartQuantity={updateCartQuantity}
                        buyNow={buyNow}
                        cartItemQuantity={cartItemQuantity}
                        showProductDetail={showProductDetail}
                    />
                );
            })}
        </div>
    );
};

export default ProductList;