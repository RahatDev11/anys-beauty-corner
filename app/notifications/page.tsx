
// app/notifications/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useNotifications } from '@/app/context/NotificationContext';
import { useAuth } from '@/app/context/AuthContext';

const NotificationsPage: React.FC = () => {
    const { notifications, loading, markAsRead, loadUserNotifications } = useNotifications();
    const { user, loading: authLoading, loginWithGmail } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            loadUserNotifications();
        }
    }, [user, authLoading, loadUserNotifications]);

    if (authLoading || loading) {
        return <div className="text-center p-8">নোটিফিকেশন লোড হচ্ছে...</div>;
    }

    if (!user) {
        return (
            <div className="text-center p-8">
                <p className="mb-4">নোটিফিকেশন দেখতে লগইন করুন।</p>
                <button onClick={loginWithGmail} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    লগইন করুন
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 pt-24">
            <h1 className="text-3xl font-bold text-center mb-8">আপনার নোটিফিকেশন</h1>
            <div className="max-w-2xl mx-auto">
                {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 italic p-4">আপনার কোনো নোটিফিকেশন নেই।</p>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`${notification.isRead ? 'bg-gray-100' : 'bg-white'} p-4 rounded-lg shadow-md mb-4 border-l-4 border-lipstick cursor-pointer`}
                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-lg text-gray-800">{notification.title}</h2>
                                <span className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString('bn-BD')}</span>
                            </div>
                            <p className="text-gray-600 mt-2">{notification.body}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
