
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

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
        <div id="new-product-slider-wrapper">
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
                className="new-product-slider"
            >
                {products.map((product) => {
                    const imageUrl = product.image ? product.image.split(",")[0].trim() : "https://via.placeholder.com/400";
                    return (
                        <SwiperSlide key={product.id}>
                            <div className="relative w-full h-64 md:h-80">
                                <img src={imageUrl} className="w-full h-full object-cover" alt={product.name} />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                                    <h3 className="text-white text-2xl font-bold">{product.name}</h3>
                                    <p className="text-white text-lg">{product.price} টাকা</p>
                                    <button
                                        onClick={() => showProductDetail(product.id)}
                                        className="mt-4 bg-lipstick-dark text-white py-2 px-4 rounded-lg self-start hover:bg-opacity-80"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <div className="swiper-pagination"></div> {/* Custom pagination container */}
        </div>
    );
};

export default ProductSlider;
