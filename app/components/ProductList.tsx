
import React from 'react';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Array<{
        id: string;
        name: string;
        price: number;
        image?: string;
        category?: string;
        isInSlider?: boolean;
        sliderOrder?: number;
        tags?: string;
    }>;
    cartItems: Array<{
        id: string;
        quantity: number;
    }>;
    addToCart: (id: string) => void;
    updateQuantity: (id: string, change: number) => void;
    buyNow: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    cartItems,
    addToCart,
    updateQuantity,
    buyNow,
}) => {
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
                    />
                );
            })}
        </div>
    );
};

export default ProductList;
