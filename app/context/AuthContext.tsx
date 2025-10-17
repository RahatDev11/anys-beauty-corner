
// app/context/AuthContext.tsx
'use client';
'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { auth, provider, database, ref, set, get, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from '@/lib/firebase';
import { useToast } from '@/app/components/Toast';

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
    loginWithGmail: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const checkAdminStatus = useCallback(async (uid: string) => {
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
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            set(userRef, { name: currentUser.displayName, email: currentUser.email, photoURL: currentUser.photoURL, createdAt: new Date().toISOString() });
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const currentUser: User = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                };
                setUser(currentUser);
                const admin = await checkAdminStatus(firebaseUser.uid);
                setIsAdminUser(admin);
                saveUserToFirebase(currentUser);
            } else {
                setUser(null);
                setIsAdminUser(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [checkAdminStatus, saveUserToFirebase]);

    const loginWithGmail = useCallback(() => {
        signInWithPopup(auth, provider)
            .then(result => {
                const loggedInUser = result.user;
                showToast(`স্বাগতম, ${loggedInUser.displayName}`, "success");
                // User state will be updated by onAuthStateChanged listener
            })
            .catch(error => {
                console.error("Login failed:", error);
                showToast("লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।", "error");
            });
    }, [showToast]);

    const logout = useCallback(() => {
        signOut(auth).then(() => {
            showToast("সফলভাবে লগআউট হয়েছেন।", "success");
            // User state will be updated by onAuthStateChanged listener
        }).catch(error => {
            console.error("Logout failed:", error);
            showToast("লগআউট ব্যর্থ হয়েছে।", "error");
        });
    }, [showToast]);

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin: isAdminUser,
            loading,
            loginWithGmail,
            logout,
        }}>
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
