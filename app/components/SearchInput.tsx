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
    category?: string;
    description?: string;
}

interface SearchInputProps {
    isMobile?: boolean;
    onSearchFocusChange?: (isOpen: boolean) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ isMobile = false, onSearchFocusChange }) => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Firebase থেকে প্রোডাক্ট লোড করা - carts থেকে
    useEffect(() => {
        console.log("🔥 Firebase থেকে প্রোডাক্ট লোড করার চেষ্টা করছি...");
        
        try {
            const cartsRef = ref(database, "carts");
            const unsubscribe = onValue(cartsRef, (snapshot) => {
                console.log("📦 Firebase carts স্ন্যাপশট:", snapshot.exists());
                
                if (snapshot.exists()) {
                    const productsData: Product[] = [];
                    const cartsData = snapshot.val();
                    
                    // সকল cart থেকে unique products extract করা
                    const productMap = new Map();
                    
                    Object.keys(cartsData).forEach(cartKey => {
                        const cartItems = cartsData[cartKey];
                        
                        if (Array.isArray(cartItems)) {
                            cartItems.forEach((item: any) => {
                                if (item && item.id && item.name && !productMap.has(item.id)) {
                                    productMap.set(item.id, {
                                        id: item.id,
                                        name: item.name || '',
                                        price: item.price || 0,
                                        image: Array.isArray(item.image) ? item.image[0] : item.image || '',
                                        tags: item.tags || '',
                                        category: item.category || '',
                                        description: item.description || ''
                                    });
                                }
                            });
                        }
                    });
                    
                    const uniqueProducts = Array.from(productMap.values());
                    console.log("✅ ইউনিক প্রোডাক্ট লোড হয়েছে:", uniqueProducts.length);
                    
                    if (uniqueProducts.length > 0) {
                        console.log("📝 প্রথম প্রোডাক্ট:", uniqueProducts[0]);
                        setProducts(uniqueProducts);
                    } else {
                        // যদি carts এ প্রোডাক্ট না থাকে, mock data ব্যবহার
                        console.log("🔄 Mock ডেটা ব্যবহার করছি...");
                        const mockProducts = getMockProducts();
                        setProducts(mockProducts);
                    }
                } else {
                    console.log("❌ Firebase এ কোনো carts ডেটা নেই");
                    const mockProducts = getMockProducts();
                    setProducts(mockProducts);
                }
                setIsLoading(false);
            }, (error) => {
                console.error("🔥 Firebase error:", error);
                console.log("🔄 Mock ডেটা ব্যবহার করছি...");
                const mockProducts = getMockProducts();
                setProducts(mockProducts);
                setIsLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("🔥 Firebase connection failed:", error);
            const mockProducts = getMockProducts();
            setProducts(mockProducts);
            setIsLoading(false);
        }
    }, []);

    // আপনার JSON থেকে mock products বানানো
    const getMockProducts = (): Product[] => {
        return [
            {
                id: "1742815614971",
                name: "Milk shake",
                price: 1350,
                image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1741665598/FB_IMG_1741595084807_r6dfd9.jpg",
                tags: "Milk shake, মিল্ক শেক",
                category: "health",
                description: "মিল্কশেক খাওয়ার নিয়ম হলো, প্রতিদিন রাতে খাবারের ৩০ মিনিট পর হালকা গরম দুধের সাথে ১/২ চামচ মিল্কশেক পাউডার ভালোভাবে মিশিয়ে খাওয়া।"
            },
            {
                id: "1742823833150",
                name: "কাশ্মীরি মেহেদী ১ বক্স",
                price: 350,
                image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742034015/1742033780107_x2fjnv.jpg",
                tags: "কাশ্মীরি, মেহেদী, ১ বক্স",
                category: "mehandi",
                description: "কাশ্মীরি মেহেদী হলো কাশ্মীর অঞ্চলের বিশেষ একটি মেহেদি, যা তার প্রাকৃতিক গুণগত মান এবং দীর্ঘস্থায়ী রঙের জন্য পরিচিত।"
            },
            {
                id: "1742834582521",
                name: "প্রেম দুলহান ৬ পিছ",
                price: 170,
                image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742034015/1742033804123_qmnwzy.jpg",
                tags: "প্রেম দুলহান",
                category: "mehandi",
                description: "প্রেম দুলহান মেহেন্দি সম্পর্কে বিস্তারিত জানতে চাইলে, এই তথ্যগুলি দেখুন"
            },
            {
                id: "1742835159605",
                name: "ন্যাচারাল হেলথ সাপ্লিমেন্ট",
                price: 990,
                image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742835050/1742834776574_kczf3n.jpg",
                tags: "ন্যাচারাল হেলথ সাপ্লিমেন্ট",
                category: "health",
                description: "সুস্বাদু Health supplement এর সাথে শরীরের গঠন মনের মত করুন"
            },
            {
                id: "1742835626731",
                name: "চকলেট শেক",
                price: 1350,
                image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742835562/FB_IMG_1742835455428_ooukwc.jpg",
                tags: "চকলেট শেক",
                category: "health",
                description: "চকলেট শেকের উপকারিতা হলো এটি হজমশক্তি বৃদ্ধি করে, স্মৃতিশক্তি ভালো রাখে"
            },
            {
                id: "1742836099301",
                name: "Saffron goat milk soap 110gm",
                price: 1050,
                image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742835984/FB_IMG_1742835941581_ikmsmj.jpg",
                tags: "Saffron goat milk soap",
                category: "health",
                description: "এই একটাই সাবান, যা আপনাকে দেবে রোদে পোড়া ভাব দূর করার সহজ সমাধান"
            },
            {
                id: "1742837125610",
                name: "keto green coffee 3 packet",
                price: 1390,
                image: "https://res.cloudinary.com/dnvm88wfi/image/upload/v1742837058/FB_IMG_1742837029592_sljyp0.jpg",
                tags: "keto green coffee 3 packet",
                category: "health",
                description: "এক কাপ Keto Green Coffee খেয়েই কমে যাবে আপনার বাড়তি ওজন"
            }
        ];
    };

    // সার্চ ফিল্টারিং
    useEffect(() => {
        console.log("🔍 সার্চ কুয়েরি:", query);
        console.log("📊 মোট প্রোডাক্ট:", products.length);
        
        if (query.trim().length > 0) {
            const searchTerm = query.toLowerCase().trim();
            console.log("🎯 সার্চ টার্ম:", searchTerm);
            
            const filtered = products.filter(p => {
                if (!p.name) return false;
                
                const nameMatch = p.name.toLowerCase().includes(searchTerm);
                const tagsMatch = p.tags && p.tags.toLowerCase().includes(searchTerm);
                const descriptionMatch = p.description && p.description.toLowerCase().includes(searchTerm);
                
                // বাংলা সার্চ সাপোর্ট
                const banglaNameMatch = p.name.includes(query);
                const banglaTagsMatch = p.tags && p.tags.includes(query);
                const banglaDescriptionMatch = p.description && p.description.includes(query);
                
                const matches = nameMatch || tagsMatch || descriptionMatch || 
                              banglaNameMatch || banglaTagsMatch || banglaDescriptionMatch;
                
                if (matches && process.env.NODE_ENV === 'development') {
                    console.log("✅ মিলেছে:", p.name);
                }
                
                return matches;
            });
            
            console.log("📋 ফিল্টার্ড প্রোডাক্ট:", filtered.length);
            setFilteredProducts(filtered.slice(0, 8)); // ৮টি প্রোডাক্ট দেখাবে
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

    // Outside click handler
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
                    placeholder="প্রোডাক্ট সার্চ করুন (Milk shake, মেহেদী, চকলেট...)"
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
                    <p className="text-center text-gray-500">প্রোডাক্ট লোড হচ্ছে...</p>
                </div>
            )}

            {!isLoading && filteredProducts.length > 0 && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-lg z-50 border border-gray-200">
                    <div className="p-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500">
                            {filteredProducts.length}টি প্রোডাক্ট পাওয়া গেছে
                        </p>
                    </div>
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="flex items-center p-3 hover:bg-red-50 text-gray-800 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200 group"
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <Image 
                                    src={product.image || '/images/placeholder.jpg'} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                    alt={product.name} 
                                    width={48} 
                                    height={48}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                    }}
                                />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {product.name}
                                </p>
                                {product.tags && (
                                    <p className="text-xs text-gray-500 truncate">
                                        {product.tags}
                                    </p>
                                )}
                                {product.category && (
                                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                        {product.category}
                                    </span>
                                )}
                            </div>
                            <div className="ml-2 flex-shrink-0">
                                <span className="text-sm font-bold text-red-600">
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
                    <p className="text-center text-xs text-gray-400 mt-2">
                        ট্রাই করুন: <span className="font-medium">"Milk shake"</span>, 
                        <span className="font-medium">"মেহেদী"</span>, 
                        <span className="font-medium">"চকলেট"</span>, 
                        <span className="font-medium">"সাবান"</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchInput;