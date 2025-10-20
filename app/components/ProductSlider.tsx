import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSliderProps {
    products: Array<{
        id: string;
        name: string;
        price: number;
        image?: string;
        category?: string;
        stockStatus?: string;
        description?: string;
        tags?: string[];
    }>;
    showProductDetail: (id: string) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
    products,
    showProductDetail,
}) => {
    return (
        <div id="featured-product-slider-wrapper" className="relative pb-12">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                }}
                className="featured-products-swiper"
            >
                {products.map((product) => {
                    const imageUrl = product.image ? product.image.split(",")[0].trim() : "https://via.placeholder.com/300x200";
                    return (
                        <SwiperSlide key={product.id}>
                            <div 
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-100"
                                onClick={() => showProductDetail(product.id)}
                            >
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    <Image 
                                        src={imageUrl} 
                                        fill 
                                        style={{objectFit: "cover"}} 
                                        alt={product.name} 
                                        className="transition-transform duration-500 hover:scale-110"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/300x200';
                                        }}
                                    />
                                    {product.stockStatus === 'out-of-stock' && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description || 'Product description'}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lipstick font-bold text-xl">
                                            ৳{product.price}
                                        </span>
                                        {product.stockStatus !== 'out-of-stock' && (
                                            <span className="text-green-600 text-sm font-medium">
                                                In Stock
                                            </span>
                                        )}
                                    </div>
                                    {product.tags && product.tags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {product.tags.slice(0, 2).map((tag, index) => (
                                                <span 
                                                    key={index}
                                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Custom CSS for slider */}
            <style jsx global>{`
                #featured-product-slider-wrapper {
                    position: relative;
                }
                .featured-products-swiper {
                    padding-bottom: 40px;
                }
                .featured-products-swiper .swiper-pagination {
                    bottom: 0px !important;
                }
                .featured-products-swiper .swiper-pagination-bullet {
                    background: #d1d5db;
                    opacity: 0.6;
                    width: 10px;
                    height: 10px;
                    margin: 0 4px;
                    transition: all 0.3s ease;
                }
                .featured-products-swiper .swiper-pagination-bullet-active {
                    background: #e11d48;
                    opacity: 1;
                    width: 12px;
                    height: 12px;
                }
                .featured-products-swiper .swiper-button-next,
                .featured-products-swiper .swiper-button-prev {
                    color: #e11d48;
                    background: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    transition: all 0.3s ease;
                }
                .featured-products-swiper .swiper-button-next:hover,
                .featured-products-swiper .swiper-button-prev:hover {
                    background: #e11d48;
                    color: white;
                }
                .featured-products-swiper .swiper-button-next:after,
                .featured-products-swiper .swiper-button-prev:after {
                    font-size: 18px;
                    font-weight: bold;
                }
                
                /* Responsive styles */
                @media (max-width: 768px) {
                    .featured-products-swiper {
                        padding-bottom: 35px;
                    }
                    .featured-products-swiper .swiper-pagination-bullet {
                        width: 8px;
                        height: 8px;
                    }
                    .featured-products-swiper .swiper-pagination-bullet-active {
                        width: 10px;
                        height: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductSlider;