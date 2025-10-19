// Script to add sample product data to Firebase
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

// Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample products data
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

// Sample events data
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

// Function to add sample data
async function addSampleData() {
    try {
        // Add products
        await set(ref(database, 'products'), sampleProducts);
        console.log('Products added successfully!');
        
        // Add events
        await set(ref(database, 'events'), sampleEvents);
        console.log('Events added successfully!');
        
        console.log('All sample data added successfully!');
    } catch (error) {
        console.error('Error adding sample data:', error);
    }
}

// Run the function
addSampleData();
