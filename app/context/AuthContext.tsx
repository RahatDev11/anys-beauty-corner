// app/context/AuthContext.tsx
'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { auth, provider, database, ref, set, get, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from '@/lib/firebase';

interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    loginWithGmail: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [loading, setLoading] = useState(true);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        // Simple toast implementation without external dependency
        if (typeof window !== 'undefined') {
            // You can use browser alert temporarily or implement simple toast
            if (type === 'error') {
                console.error('Auth Error:', message);
                alert(`Error: ${message}`); // Temporary solution
            } else {
                console.log('Auth Success:', message);
            }
        }
    }, []);

    const checkAdminStatus = useCallback(async (uid: string): Promise<boolean> => {
        try {
            const adminRef = ref(database, `admins/${uid}`);
            const snapshot = await get(adminRef);
            return snapshot.exists();
        } catch (error) {
            console.error("Error checking admin status:", error);
            return false;
        }
    }, []);

    const saveUserToFirebase = useCallback(async (currentUser: User) => {
        try {
            const userRef = ref(database, `users/${currentUser.uid}`);
            const snapshot = await get(userRef);
            if (!snapshot.exists()) {
                await set(userRef, { 
                    name: currentUser.displayName, 
                    email: currentUser.email, 
                    photoURL: currentUser.photoURL, 
                    createdAt: new Date().toISOString() 
                });
            }
        } catch (error) {
            console.error("Error saving user to Firebase:", error);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const currentUser: User = {
                        uid: firebaseUser.uid,
                        displayName: firebaseUser.displayName,
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL,
                    };
                    setUser(currentUser);
                    
                    // Check admin status
                    const isAdmin = await checkAdminStatus(firebaseUser.uid);
                    setIsAdminUser(isAdmin);
                    
                    // Save user to database
                    await saveUserToFirebase(currentUser);
                } else {
                    setUser(null);
                    setIsAdminUser(false);
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                setUser(null);
                setIsAdminUser(false);
            } finally {
                setLoading(false);
            }
        });
        
        return () => unsubscribe();
    }, [checkAdminStatus, saveUserToFirebase]);

    const loginWithGmail = useCallback(async (): Promise<void> => {
        try {
            const result = await signInWithPopup(auth, provider);
            const loggedInUser = result.user;
            showToast(`স্বাগতম, ${loggedInUser.displayName || 'User'}`, "success");
        } catch (error: any) {
            console.error("Login failed:", error);
            const errorMessage = error?.message || "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
            showToast(errorMessage, "error");
        }
    }, [showToast]);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await signOut(auth);
            showToast("সফলভাবে লগআউট হয়েছেন।", "success");
        } catch (error: any) {
            console.error("Logout failed:", error);
            const errorMessage = error?.message || "লগআউট ব্যর্থ হয়েছে।";
            showToast(errorMessage, "error");
        }
    }, [showToast]);

    const value: AuthContextType = {
        user,
        isAdmin: isAdminUser,
        loading,
        loginWithGmail,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};