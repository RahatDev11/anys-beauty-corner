
'use client';

import React, { useState, useEffect } from 'react';
import { database, ref, onValue, update } from '@/lib/firebase';

interface Product {
    id: string;
    name: string;
    isInSlider?: boolean;
    sliderOrder?: number;
}

const SliderManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const productsRef = ref(database, 'products/');
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setProducts(productsData);
            } else {
                setProducts([]);
            }
        });
    }, []);

    const handleSliderChange = (productId: string, isInSlider: boolean) => {
        const updates: { [key: string]: boolean | number } = {};
        updates[`/products/${productId}/isInSlider`] = isInSlider;
        update(ref(database), updates);
    };

    const handleSliderOrderChange = (productId: string, order: number) => {
        const updates: { [key: string]: boolean | number } = {};
        updates[`/products/${productId}/sliderOrder`] = order;
        update(ref(database), updates);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold text-center mb-4 text-lipstick-dark">Header Slider Management</h2>
            <p className="text-center text-sm text-gray-600 mb-4">Select which products will be shown in the homepage slider and set their order.</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {products.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 border-b">
                        <span>{product.name}</span>
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                className="form-checkbox h-5 w-5 text-lipstick-dark mr-4"
                                checked={product.isInSlider || false}
                                onChange={(e) => handleSliderChange(product.id, e.target.checked)}
                            />
                            <input 
                                type="number" 
                                className="w-20 p-1 border rounded"
                                placeholder="Order"
                                value={product.sliderOrder || ''}
                                onChange={(e) => handleSliderOrderChange(product.id, parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SliderManagement;
