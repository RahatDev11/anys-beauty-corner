import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/app/types/product';

interface ProductCardProps {
    product: Product;
    addToCart: (product: Product) => void;
    updateQuantity: (id: string, change: number) => void;
    buyNow: (product: Product) => void;
    cartItemQuantity?: number;
    showProductDetail?: (id: string) => void; // ✅ Optional prop হিসেবে add করুন
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    addToCart,
    updateQuantity,
    buyNow,
    cartItemQuantity = 0,
    showProductDetail, // ✅ Props এ receive করুন
}) => {
    const imageUrl = product.image ? product.image.split(",")[0].trim() : "https://via.placeholder.com/150";
    const router = useRouter();

    const handleShowProductDetail = (id: string) => {
        // যদি prop থেকে function আসে সেটা use করুন, নাহলে default behavior
        if (showProductDetail) {
            showProductDetail(id);
        } else {
            // Fallback: direct router use করুন
            router.push(`/product-detail/${id}`);
        }
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
                                className="w-full bg-brushstroke text-black rounded-lg font-semibold flex items-center h-10 justify-center text-sm hover:opacity-90 border-none"
                            >
                                Add To Cart
                            </button>
                        )}
                        <button
                            onClick={() => buyNow(product)}
                            className="w-full bg-brushstroke text-black py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-colors border-none"
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