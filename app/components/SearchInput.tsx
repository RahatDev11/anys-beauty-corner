// app/components/SearchInput.tsx
import React, { useState, useEffect, useRef } from 'react';
import { database, ref, onValue } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    tags?: string;
}

interface SearchInputProps {
    isMobile?: boolean;
    onSearchFocusChange?: (isOpen: boolean) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ isMobile = false, onSearchFocusChange }) => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Temporary mock data - Firebase কাজ না করলে এটি ব্যবহার করুন
    const mockProducts: Product[] = [
        {
            id: "1742836416596",
            name: "ন্যাচারাল ফুড বাদাম শেক",
            price: 999,
            image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742836366/FB_IMG_1742836332893_yerctd.jpg",
            tags: "বাদাম শেক ন্যাচারাল ফুড"
        },
        {
            id: "1742835626731", 
            name: "চকলেট শেক",
            price: 1350,
            image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742835562/FB_IMG_1742835455428_ooukwc.jpg",
            tags: "চকলেট শেক"
        },
        {
            id: "1742837058123",
            name: "স্ট্রবেরি শেক",
            price: 1200,
            image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742837058/FB_IMG_1742837029592_sljyp0.jpg",
            tags: "স্ট্রবেরি শেক"
        }
    ];

    useEffect(() => {
        console.log("🔥 Firebase থেকে প্রোডাক্ট লোড করার চেষ্টা করছি...");
        setIsLoading(true);
        
        try {
            const productsRef = ref(database, "products");
            const unsubscribe = onValue(productsRef, (snapshot) => {
                console.log("📦 Firebase স্ন্যাপশট:", snapshot.exists());
                
                if (snapshot.exists()) {
                    const productsData = Object.keys(snapshot.val()).map(key => ({ 
                        id: key, 
                        ...snapshot.val()[key] 
                    }));
                    console.log("✅ প্রোডাক্ট লোড হয়েছে:", productsData.length);
                    console.log("📝 প্রথম প্রোডাক্ট:", productsData[0]);
                    setProducts(productsData);
                } else {
                    console.log("❌ Firebase এ কোনো ডেটা নেই, mock ডেটা ব্যবহার করছি");
                    // Firebase এ ডেটা না থাকলে mock ডেটা ব্যবহার করুন
                    setProducts(mockProducts);
                }
                setIsLoading(false);
            }, (error) => {
                console.error("🔥 Firebase error:", error);
                console.log("🔄 Mock ডেটা ব্যবহার করছি...");
                // Error হলে mock ডেটা ব্যবহার করুন
                setProducts(mockProducts);
                setIsLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("🔥 Firebase connection failed:", error);
            console.log("🔄 Mock ডেটা ব্যবহার করছি...");
            setProducts(mockProducts);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log("🔍 সার্চ কুয়েরি:", query);
        console.log("📊 মোট প্রোডাক্ট:", products.length);
        
        if (query.trim().length > 0) {
            const searchTerm = query.toLowerCase().trim();
            console.log("🎯 সার্চ টার্ম:", searchTerm);
            
            const filtered = products.filter(p => {
                const nameMatch = p.name && p.name.toLowerCase().includes(searchTerm);
                const tagsMatch = p.tags && p.tags.toLowerCase().includes(searchTerm);
                const banglaNameMatch = p.name && p.name.includes(query);
                const banglaTagsMatch = p.tags && p.tags.includes(query);
                
                const matches = nameMatch || tagsMatch || banglaNameMatch || banglaTagsMatch;
                
                if (matches) {
                    console.log("✅ মিলেছে:", p.name);
                }
                
                return matches;
            });
            
            console.log("📋 ফিল্টার্ড প্রোডাক্ট:", filtered.length, filtered);
            setFilteredProducts(filtered.slice(0, 5));
        } else {
            setFilteredProducts([]);
        }
    }, [query, products]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (onSearchFocusChange) {
            onSearchFocusChange(value.length > 0);
        }
    };

    const handleProductClick = (productId: string) => {
        console.log("🔄 প্রোডাক্ট এ ক্লিক:", productId);
        router.push(`/product-detail/${productId}`);
        setQuery('');
        if (onSearchFocusChange) {
            onSearchFocusChange(false);
        }
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setQuery('');
                if (onSearchFocusChange) {
                    onSearchFocusChange(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onSearchFocusChange]);

    return (
        <div className="relative w-full" ref={searchRef}>
            <div className="relative">
                <input
                    className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80"
                    id={isMobile ? "searchInput" : "searchInputDesktop"}
                    onChange={handleInputChange}
                    placeholder="প্রোডাক্ট সার্চ করুন..."
                    type="text"
                    value={query}
                    autoComplete="off"
                />
                <i className="fas fa-search text-2xl absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"></i>
            </div>

            {/* Development debug info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mt-1 bg-yellow-100 p-1 rounded">
                    🔍 ডিবাগ: {products.length} প্রোডাক্ট | {filteredProducts.length} ফলাফল | "{query}"
                </div>
            )}

            {isLoading && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg z-50 border border-gray-200">
                    <p className="text-center text-gray-500">লোড হচ্ছে...</p>
                </div>
            )}

            {!isLoading && filteredProducts.length > 0 && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white/95 backdrop-blur-sm shadow-lg rounded-lg z-50 border border-gray-200">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="flex items-center p-3 hover:bg-gray-50 text-gray-800 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                <Image 
                                    src={product.image || '/images/placeholder.jpg'} 
                                    className="w-full h-full object-cover" 
                                    alt={product.name} 
                                    width={40} 
                                    height={40}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                    }}
                                />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                </p>
                                {product.tags && (
                                    <p className="text-xs text-gray-500 truncate">
                                        ট্যাগ: {product.tags}
                                    </p>
                                )}
                            </div>
                            <div className="ml-2 flex-shrink-0">
                                <span className="text-sm font-semibold text-red-600">
                                    {product.price}৳
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && filteredProducts.length === 0 && query.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg z-50 border border-gray-200">
                    <p className="text-center text-gray-500 text-sm">
                        " {query} " এর সাথে মিলে এমন কোনো প্রোডাক্ট পাওয়া যায়নি
                    </p>
                    <p className="text-center text-xs text-gray-400 mt-1">
                        ট্রাই করুন: "বাদাম", "চকলেট", "শেক"
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchInput;