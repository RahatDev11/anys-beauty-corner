// app/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { 
    auth, 
    createGoogleProvider, // পরিবর্তন করুন
    database, 
    ref, 
    set, 
    get, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    User as FirebaseUser 
} from '@/lib/firebase';

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
    const [authInitialized, setAuthInitialized] = useState(false);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        if (typeof window !== 'undefined') {
            if (type === 'error') {
                console.error('Auth Error:', message);
                alert(`Error: ${message}`);
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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            try {
                setLoading(true);
                
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

                    // Save user to Firebase
                    await saveUserToFirebase(currentUser);
                    
                    console.log('User logged in:', currentUser.email);
                } else {
                    setUser(null);
                    setIsAdminUser(false);
                    console.log('User logged out');
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                setUser(null);
                setIsAdminUser(false);
            } finally {
                setLoading(false);
                setAuthInitialized(true);
            }
        });

        return () => unsubscribe();
    }, [checkAdminStatus, saveUserToFirebase]);

    const loginWithGmail = useCallback(async (): Promise<void> => {
        try {
            console.log('Starting Google login...');
            
            // Create new provider instance each time
            const provider = createGoogleProvider();
            
            const result = await signInWithPopup(auth, provider);
            const loggedInUser = result.user;
            
            console.log('Login successful:', loggedInUser.email);
            showToast(`স্বাগতম, ${loggedInUser.displayName || 'User'}!`, "success");
            
        } catch (error: unknown) {
            console.error("Login failed:", error);
            
            let errorMessage = "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
            
            if (error instanceof Error) {
                errorMessage = error.message;
                
                // Handle specific Firebase errors
                if (errorMessage.includes('popup-closed-by-user')) {
                    errorMessage = "লগইন পপআপ বন্ধ করা হয়েছে।";
                } else if (errorMessage.includes('popup-blocked')) {
                    errorMessage = "লগইন পপআপ ব্লক করা হয়েছে। অনুগ্রহ করে পপআপ Allow করুন।";
                } else if (errorMessage.includes('network-request-failed')) {
                    errorMessage = "নেটওয়ার্ক সমস্যা। ইন্টারনেট কানেকশন চেক করুন।";
                } else if (errorMessage.includes('auth/argument-error')) {
                    errorMessage = "Authentication configuration error. Please check Firebase setup.";
                }
            }
            
            showToast(errorMessage, "error");
            throw error;
        }
    }, [showToast]);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await signOut(auth);
            showToast("সফলভাবে লগআউট হয়েছেন।", "success");
        } catch (error: unknown) {
            console.error("Logout failed:", error);
            const errorMessage = error instanceof Error ? error.message : "লগআউট ব্যর্থ হয়েছে।";
            showToast(errorMessage, "error");
            throw error;
        }
    }, [showToast]);

    const value: AuthContextType = {
        user,
        isAdmin: isAdminUser,
        loading: loading || !authInitialized,
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