
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { database, ref, onValue } from '@/lib/firebase';
import { useCart } from '../../context/CartContext';
import ProductSlider from '../../components/ProductSlider';
import Image from 'next/image';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stockStatus: string;
    images: string[];
    tags: string[];
    description: string;
    isInSlider?: boolean;
    sliderOrder?: number;
}

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [mainImage, setMainImage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, buyNow } = useCart();

    const handleQuantityChange = (amount: number) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
    };

    useEffect(() => {
        if (id) {
            const productRef = ref(database, `products/${id}`);
            onValue(productRef, (snapshot) => {
                if (snapshot.exists()) {
                    const productData = { id: snapshot.key, ...snapshot.val() };
                    setProduct(productData);


                    if (productData.images && productData.images.length > 0) {
                        setMainImage(`/products/${productData.images[0]}`);
                    }
                } else {
                    console.log("No data available");
                }
            });
        }

        const productsRef = ref(database, "products/");
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setProducts(productsData);
            } else {
                setProducts([]);
            }
        });
    }, [id]);

    const handleThumbnailClick = (image: string) => {
        setMainImage(`/products/${image}`);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (!product) {
        return <LoadingSpinner fullPage message="Product details loading..." />;
    }

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

    return (
        <>
            <main className="p-4 pt-24 md:pt-28 max-w-4xl mx-auto">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div className="image-gallery">
                        {mainImage && (
                            <div className="main-image-container relative h-96">
                                <Image id="mainImage" src={mainImage} alt="Main Product Image" onClick={openModal} fill style={{objectFit: "cover"}} />
                            </div>
                        )}
                        <div className="thumbnail-container mt-4" id="thumbnailContainer">
                            {product.images && product.images.map((image: string, index: number) => (
                                <Image 
                                    key={index} 
                                    src={`/products/${image}`} 
                                    alt={`Product thumbnail ${index + 1}`} 
                                    className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                                    onClick={() => handleThumbnailClick(image)}
                                    width={60}
                                    height={60}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h1 id="productTitle" className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
                        <p id="productPrice" className="text-lipstick text-2xl lg:text-3xl font-bold mb-4 tracking-wide">{product.price} ৳</p>
                        <div id="productDetailsExtra" className="mb-6">
                            {/* Additional details can be rendered here */}
                        </div>
                        
                        <div id="actionButtons" className="flex flex-col space-y-3 mb-6">
                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300"
                                >
                                    +
                                </button>
                                <span className="text-sm text-gray-600 ml-4">
                                    {product.stockStatus === 'In Stock' ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <button onClick={() => addToCart(product, quantity)} className="bg-lipstick text-white px-4 py-2 rounded hover:bg-opacity-90">Add to Cart</button>
                            <button onClick={() => buyNow(product, quantity)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-opacity-90">Buy Now</button>
                        </div>
                        <div className="description-container">
                            <p id="productDescription" className="text-gray-700 mb-3 leading-relaxed">{product.description}</p>
                        </div>
                        {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <section id="relatedProductsSection" className="mt-8">
                    <h2 className="text-2xl font-bold text-center mb-4 text-lipstick-dark">Related Products</h2>
                    <ProductSlider products={relatedProducts} showProductDetail={(id) => {}} />
                </section>
            </main>

            {showModal && mainImage && (
                <div id="imageModal" style={{ display: 'flex' }} className="relative">
                    <span id="modalCloseBtn" title="Close" onClick={closeModal}>×</span>
                    <Image id="modalImage" src={mainImage} alt="Full Screen Product Image" fill style={{objectFit: "contain"}} />
                </div>
            )}
        </>
    );
};

export default ProductDetail;
