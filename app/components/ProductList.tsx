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
    updateQuantity: (id: string, change: number) => void;
    buyNow: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    cartItems,
    addToCart,
    updateQuantity,
    buyNow,
}) => {
    const router = useRouter();

    const showProductDetail = (id: string) => {
        router.push(`/product/${id}`);
    };

    return (
        <div id="productList" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
                const cartItem = cartItems.find((item) => item.id === product.id);
                const cartItemQuantity = cartItem ? cartItem.quantity : 0;
                return (
                    <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={(productItem) => addToCart(productItem)}
                        updateQuantity={updateQuantity}
                        buyNow={(productItem) => buyNow(productItem)}
                        cartItemQuantity={cartItemQuantity}
                        showProductDetail={showProductDetail}
                    />
                );
            })}
        </div>
    );
};

export default ProductList;