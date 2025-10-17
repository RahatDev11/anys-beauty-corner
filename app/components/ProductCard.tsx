
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
        category?: string;
        isInSlider?: boolean;
        sliderOrder?: number;
        tags?: string;
    };
    addToCart: (product: Product) => void;
    updateQuantity: (id: string, change: number) => void;
    buyNow: (product: Product) => void;
    cartItemQuantity?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    addToCart,
    updateQuantity,
    buyNow,
    cartItemQuantity = 0,
}) => {
    const imageUrl = product.image ? product.image.split(",")[0].trim() : "https://via.placeholder.com/150";
    const router = useRouter();

    const handleShowProductDetail = (id: string) => {
        router.push(`/product-detail/${id}`);
    };

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <Image
                src={imageUrl}
                alt={product.name}
                className="w-full h-36 object-cover cursor-pointer"
                onClick={() => handleShowProductDetail(product.id)}
                width={250}
                height={144}
            />
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
                            <div className="w-full bg-brushstroke text-black rounded-lg font-semibold flex items-center h-10 justify-around">
                                <button onClick={() => updateQuantity(product.id, -1)} className="px-3 text-xl font-bold">-</button>
                                <span className="text-lg">{cartItemQuantity}</span>
                                <button onClick={() => updateQuantity(product.id, 1)} className="px-3 text-xl font-bold">+</button>
                            </div>
                        ) : (
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-brushstroke text-black rounded-lg font-semibold flex items-center h-10 justify-center text-sm hover:opacity-90"
                            >
                                Add To Cart
                            </button>
                        )}
                        <button
                            onClick={() => buyNow(product)}
                            className="w-full bg-brushstroke text-black py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-colors"
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
