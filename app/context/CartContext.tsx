
// app/context/CartContext.tsx
'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { database, ref, onValue, set, auth, onAuthStateChanged } from '@/lib/firebase';
import { useToast } from '@/app/components/Toast';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    // Add other product properties as needed
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    updateQuantity: (productId: string, change: number) => void;
    removeFromCart: (productId: string) => void;
    checkout: () => void;
    buyNow: (product: Product, quantity?: number) => void;
    totalItems: number;
    totalPrice: number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]); // Global products list
    const { showToast } = useToast();
    const router = useRouter();

    // Load products from Firebase (can be optimized later with a global product context)
    useEffect(() => {
        const productsRef = ref(database, "products/");
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setProducts(productsData);
            }
        });
    }, []);

    const getUserId = useCallback(() => {
        return auth.currentUser ? auth.currentUser.uid : 'anonymous';
    }, []);

    const saveCart = useCallback((currentCart: CartItem[]) => {
        localStorage.setItem("anyBeautyCart", JSON.stringify(currentCart));
        if (auth.currentUser) {
            set(ref(database, `carts/${getUserId()}`), currentCart);
        }
        // Dispatch a custom event if needed for other components to react
        // window.dispatchEvent(new CustomEvent('cartUpdated'));
    }, [getUserId]);

    const loadCart = useCallback(() => {
        const userId = getUserId();
        if (auth.currentUser) {
            onValue(ref(database, `carts/${userId}`), (snapshot) => {
                const firebaseCart = snapshot.val() || [];
                setCart(firebaseCart);
            }, { onlyOnce: true });
        } else {
            const localCart = localStorage.getItem("anyBeautyCart");
            setCart(localCart ? JSON.parse(localCart) : []);
        }
    }, [getUserId]);

    useEffect(() => {
        // Listen for auth state changes to load user-specific cart
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            loadCart();
        });
        return () => unsubscribe();
    }, [loadCart]);

    const addToCart = useCallback((product: Product, quantity: number = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            let updatedCart;
            if (existingItem) {
                updatedCart = prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                updatedCart = [
                    ...prevCart,
                    { id: product.id, name: product.name, price: product.price, image: product.image, quantity: quantity },
                ];
            }
            saveCart(updatedCart);
            showToast(`${product.name} কার্টে যোগ করা হয়েছে`, "success");
            return updatedCart;
        });
    }, [saveCart, showToast]);

    const updateQuantity = useCallback((productId: string, change: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity + change } : item
            ).filter(item => item.quantity > 0);
            saveCart(updatedCart);
            return updatedCart;
        });
    }, [saveCart]);

    const removeFromCart = useCallback((productId: string) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter(item => item.id !== productId);
            saveCart(updatedCart);
            return updatedCart;
        });
    }, [saveCart]);

    const checkout = useCallback(() => {
        if (cart.length > 0) {
            router.push('/order-form');
        } else {
            showToast("আপনার কার্ট খালি!", "error");
        }
    }, [cart, router, showToast]);

    const buyNow = useCallback((product: Product, quantity: number = 1) => {
        const tempCart = [
            { id: product.id, name: product.name, price: product.price, image: product.image, quantity: quantity },
        ];
        const cartData = encodeURIComponent(JSON.stringify(tempCart));
        router.push(`/order-form?cart=${cartData}`);
    }, [router]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const clearCart = useCallback(() => {
        setCart([]);
        saveCart([]);
        showToast("কার্ট খালি করা হয়েছে!", "info");
    }, [saveCart, showToast]);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            checkout,
            buyNow,
            clearCart,
            totalItems,
            totalPrice,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
