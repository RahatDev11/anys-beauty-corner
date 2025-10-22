import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface EventSliderProps {
    events: Array<{
        title: string;
        description: string;
        imageUrl?: string;
        isActive: boolean;
    }>;
}

const EventSlider: React.FC<EventSliderProps> = ({ events }) => {
    const activeEvents = events.filter(event => event.isActive).slice(0, 3);

    if (activeEvents.length === 0) {
        return null; // কোনো ইভেন্ট না থাকলে কিছুই show করবে না
    }

    return (
        <div id="event-slider-wrapper" className="w-full">
            <Swiper
                modules={[Autoplay, Pagination]}
                loop={activeEvents.length > 1}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    el: '.swiper-pagination',
                    clickable: true,
                }}
                className="event-slider"
            >
                {activeEvents.map((event, index) => (
                    <SwiperSlide key={index}>
                        {event.imageUrl ? (
                            <div
                                className="swiper-slide rounded-lg shadow-lg bg-cover bg-center"
                                style={{
                                    height: '160px',
                                    backgroundImage: `url(${event.imageUrl})`,
                                }}
                            >
                                <div className="w-full h-full bg-black bg-opacity-50 rounded-lg p-6 flex flex-col justify-center items-center text-center text-white">
                                    <h3 className="text-xl font-bold">{event.title || ''}</h3>
                                    <p className="mt-1">{event.description || ''}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="swiper-slide bg-white p-6 flex flex-col justify-center items-center text-center rounded-lg shadow-lg" style={{ height: '160px' }}>
                                <h3 className="text-xl font-bold text-lipstick-dark">{event.title || ''}</h3>
                                <p className="text-gray-600 mt-1">{event.description || ''}</p>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="swiper-pagination !bottom-1"></div> {/* Custom pagination container */}
            
            {/* Custom CSS for pagination positioning */}
            <style jsx global>{`
                #event-slider-wrapper {
                    position: relative;
                    margin: 0;
                    padding: 0;
                }
                .event-slider {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }
                .swiper-pagination {
                    position: absolute;
                    bottom: 4px !important;
                    left: 50%;
                    transform: translateX(-50%);
                    width: auto !important;
                    z-index: 10;
                }
                .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: rgba(0, 0, 0, 0.4);
                    opacity: 1;
                    margin: 0 3px;
                }
                .swiper-pagination-bullet-active {
                    background: #A52A2A;
                }
            `}</style>
        </div>
    );
};

export default EventSlider;