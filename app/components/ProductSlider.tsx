import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface ProductSliderProps {
    products: Array<{
        id: string;
        name: string;
        price: number;
        image?: string;
    }>;
    showProductDetail: (id: string) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
    products,
    showProductDetail,
}) => {
    return (
        <div id="new-product-slider-wrapper" className="relative">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                loop={products.length > 1}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination',
                }}
                effect="fade"
                className="new-product-slider h-64 md:h-80"
            >
                {products.map((product) => {
                    const imageUrl = product.image ? product.image.split(",")[0].trim() : "https://via.placeholder.com/400";
                    return (
                        <SwiperSlide key={product.id}>
                            <div 
                                className="relative w-full h-full cursor-pointer"
                                onClick={() => showProductDetail(product.id)}
                            >
                                <Image 
                                    src={imageUrl} 
                                    fill 
                                    style={{objectFit: "cover"}} 
                                    alt={product.name} 
                                    priority
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                                    <h3 className="text-white text-2xl font-bold">{product.name}</h3>
                                    <p className="text-white text-lg">{product.price} টাকা</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showProductDetail(product.id);
                                        }}
                                        className="mt-4 bg-lipstick-dark text-white py-2 px-4 rounded-lg self-start hover:bg-opacity-80 transition-all duration-200"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Custom pagination container - FIXED: moved further down */}
            <div className="swiper-pagination !bottom-2 !left-1/2 !transform !-translate-x-1/2 !w-auto"></div>

            {/* Custom CSS for pagination */}
            <style jsx global>{`
                #new-product-slider-wrapper {
                    position: relative;
                }
                .swiper-pagination {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    z-index: 10;
                }
                .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.6);
                    opacity: 1;
                    transition: all 0.3s ease;
                    margin: 0 4px;
                }
                .swiper-pagination-bullet-active {
                    background: #ffffff;
                    width: 12px;
                    height: 12px;
                }
                .new-product-slider {
                    width: 100%;
                }
                
                /* Fix for pagination positioning - moved further down */
                .swiper-pagination-horizontal {
                    bottom: 8px !important;
                    left: 50%;
                    transform: translateX(-50%);
                    width: auto !important;
                }

                /* Ensure pagination doesn't overlap with button */
                .swiper-slide .absolute {
                    padding-bottom: 3rem !important;
                }
            `}</style>
        </div>
    );
};

export default ProductSlider;