
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
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setProducts(productsData);
            }
        });
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                (p.tags && p.tags.toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredProducts(filtered.slice(0, 5));
        } else {
            setFilteredProducts([]);
        }
    }, [query, products]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (onSearchFocusChange) {
            onSearchFocusChange(e.target.value.length > 0);
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
        <div className="relative" ref={searchRef}>
            <input
                className="w-full p-2 pl-10 border-0 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-lipstick bg-white/50 backdrop-blur-sm placeholder:text-gray-500/80"
                id={isMobile ? "searchInput" : "searchInputDesktop"}
                onInput={handleInputChange}
                placeholder="প্রোডাক্ট সার্চ করুন..."
                type="text"
                value={query}
            />
            <i className="fas fa-search text-2xl absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"></i>

            {filteredProducts.length > 0 && query.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto absolute bg-white/90 backdrop-blur-sm w-full shadow-lg rounded-lg z-50">
                    {filteredProducts.map((p) => (
                        <a
                            key={p.id}
                            onClick={() => handleProductClick(p.id)}
                            className="flex items-center p-2 hover:bg-gray-100 text-gray-800 border-b cursor-pointer"
                        >
                            <Image src={p.image ? p.image.split(',')[0].trim() : 'https://via.placeholder.com/40'} className="w-8 h-8 object-cover rounded mr-2" alt={p.name} width={32} height={32} />
                            <span className="text-sm">{p.name}</span>
                            <span className="ml-auto text-xs text-red-500">{p.price}৳</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchInput;
