'use client';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stockStatus: string;
    image: string; // ✅ REQUIRED - আপনার database এ এটাই আছে
    tags: string[];
    description: string;
    isInSlider?: boolean;
    sliderOrder?: number;
    quantity?: number;
    images?: string[]; // ✅ OPTIONAL - পরে如果需要 multiple images
}