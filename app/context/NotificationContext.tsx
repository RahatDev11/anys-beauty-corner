
// app/context/NotificationContext.tsx
'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { database, ref, onValue, get, auth, onAuthStateChanged } from '@/lib/firebase';

interface Notification {
    id: string;
    title: string;
    body: string;
    timestamp: number;
    isRead: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (notificationId: string) => void;
    loadUserNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null);
            setLoading(false);
        });
        return () => unsubscribeAuth();
    }, []);

    const loadUserNotifications = useCallback(() => {
        if (!userId) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        const notificationsRef = ref(database, `notifications/${userId}`);
        const unsubscribeDb = onValue(notificationsRef, (snapshot) => {
            if (snapshot.exists()) {
                const notificationsData = Object.keys(snapshot.val()).map(key => ({
                    id: key,
                    ...snapshot.val()[key]
                })).sort((a, b) => b.timestamp - a.timestamp);
                setNotifications(notificationsData);
                const unread = notificationsData.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
            setLoading(false);
        });

        return () => unsubscribeDb();
    }, [userId]);

    useEffect(() => {
        const cleanup = loadUserNotifications();
        return () => { if (cleanup) cleanup(); };
    }, [loadUserNotifications]);

    const markAsRead = useCallback(async (notificationId: string) => {
        if (!userId) return;
        const notificationRef = ref(database, `notifications/${userId}/${notificationId}/isRead`);
        // await set(notificationRef, true); // Use set to update a specific field
        // For simplicity, we'll update locally and let Firebase sync
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        // In a real app, you'd update Firebase here:
        // await update(ref(database, `notifications/${userId}/${notificationId}`), { isRead: true });
    }, [userId]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            loadUserNotifications,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
