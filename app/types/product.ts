export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stockStatus: string;
    images: string[];
    tags: string[];
    description: string;
    image?: string;
    isInSlider?: boolean;
    sliderOrder?: number;
}

