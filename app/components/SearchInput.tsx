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
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const productsRef = ref(database, "products/");
        const unsubscribe = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ 
                    id: key, 
                    ...snapshot.val()[key] 
                }));
                setProducts(productsData);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (query.trim().length > 0) {
            const searchTerm = query.toLowerCase().trim();
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                (p.tags && p.tags.toLowerCase().includes(searchTerm)) ||
                // বাংলা সার্চ সাপোর্ট - যদি নামে বা ট্যাগে মিলে
                p.name.includes(query) ||
                (p.tags && p.tags.includes(query))
            );
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
        router.push(`/product-detail/${productId}`);
        setQuery(''); // Clear search query after selection
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

            {filteredProducts.length > 0 && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white/95 backdrop-blur-sm shadow-lg rounded-lg z-50 border border-gray-200">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="flex items-center p-3 hover:bg-gray-50 text-gray-800 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                <Image 
                                    src={product.image ? product.image.split(',')[0].trim() : '/images/placeholder.jpg'} 
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
                                        {product.tags}
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

            {/* No results found message */}
            {filteredProducts.length === 0 && query.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg z-50 border border-gray-200">
                    <p className="text-center text-gray-500 text-sm">
                        " {query} " এর সাথে মিলে এমন কোনো প্রোডাক্ট পাওয়া যায়নি
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchInput;