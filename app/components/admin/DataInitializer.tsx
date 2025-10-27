'use client';

import React, { useState } from 'react';
import { database, ref, set } from '../../../lib/firebase';

interface DataInitializerProps {
    onComplete?: () => void;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ onComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const sampleProducts = {
        "product1": {
            name: "Luxury Lipstick Set",
            price: 2500,
            category: "makeup",
            stockStatus: "in-stock",
            images: ["/products/lipstick1.jpg", "/products/lipstick2.jpg"],
            tags: ["lipstick", "luxury", "makeup", "set"],
            description: "High-quality luxury lipstick set with 6 beautiful shades. Perfect for any occasion.",
            isInSlider: true,
            sliderOrder: 1
        },
        "product2": {
            name: "Anti-Aging Cream",
            price: 3200,
            category: "skincare",
            stockStatus: "in-stock",
            images: ["/products/cream1.jpg", "/products/cream2.jpg"],
            tags: ["skincare", "anti-aging", "cream", "premium"],
            description: "Premium anti-aging cream with natural ingredients. Reduces fine lines and wrinkles.",
            isInSlider: true,
            sliderOrder: 2
        },
        "product3": {
            name: "Hair Care Shampoo",
            price: 1800,
            category: "haircare",
            stockStatus: "in-stock",
            images: ["/products/shampoo1.jpg", "/products/shampoo2.jpg"],
            tags: ["haircare", "shampoo", "natural", "organic"],
            description: "Natural and organic hair care shampoo. Makes your hair soft and shiny.",
            isInSlider: true,
            sliderOrder: 3
        },
        "product4": {
            name: "Face Mask Kit",
            price: 1500,
            category: "skincare",
            stockStatus: "in-stock",
            images: ["/products/mask1.jpg", "/products/mask2.jpg"],
            tags: ["skincare", "face-mask", "kit", "natural"],
            description: "Complete face mask kit with 5 different masks for different skin types.",
            isInSlider: false,
            sliderOrder: 99
        },
        "product5": {
            name: "Eye Shadow Palette",
            price: 2200,
            category: "makeup",
            stockStatus: "in-stock",
            images: ["/products/eyeshadow1.jpg", "/products/eyeshadow2.jpg"],
            tags: ["makeup", "eye-shadow", "palette", "colorful"],
            description: "Beautiful eye shadow palette with 12 different colors. Perfect for creating various looks.",
            isInSlider: false,
            sliderOrder: 99
        },
        "product6": {
            name: "Hair Oil Treatment",
            price: 1200,
            category: "haircare",
            stockStatus: "in-stock",
            images: ["/products/hairoil1.jpg", "/products/hairoil2.jpg"],
            tags: ["haircare", "hair-oil", "treatment", "natural"],
            description: "Natural hair oil treatment for healthy and strong hair.",
            isInSlider: false,
            sliderOrder: 99
        }
    };

    const sampleEvents = {
        "event1": {
            title: "Summer Beauty Sale",
            description: "Get up to 50% off on all summer beauty products. Limited time offer!",
            imageUrl: "/events/summer-sale.jpg",
            isActive: true
        },
        "event2": {
            title: "New Product Launch",
            description: "Discover our latest collection of premium beauty products.",
            imageUrl: "/events/new-launch.jpg",
            isActive: true
        },
        "event3": {
            title: "Beauty Workshop",
            description: "Join our free beauty workshop and learn professional makeup techniques.",
            imageUrl: "/events/workshop.jpg",
            isActive: true
        }
    };

    const initializeData = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            // Add products
            await set(ref(database, 'products'), sampleProducts);
            setMessage('Products added successfully!');
            
            // Add events
            await set(ref(database, 'events'), sampleEvents);
            setMessage('Products and Events added successfully!');
            
            if (onComplete) {
                onComplete();
            }
        } catch (error) {
            console.error('Error adding sample data:', error);
            setMessage('Error adding sample data. Please check your Firebase configuration.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-lipstick-dark mb-4">Initialize Sample Data</h3>
            <p className="text-gray-600 mb-4">
                Click the button below to add sample products and events to your Firebase database.
            </p>
            <button
                onClick={initializeData}
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-semibold ${
                    isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-lipstick hover:bg-lipstick-dark'
                } text-white transition-colors duration-300`}
            >
                {isLoading ? 'Adding Data...' : 'Add Sample Data'}
            </button>
            {message && (
                <div className={`mt-4 p-3 rounded-lg ${
                    message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default DataInitializer;
