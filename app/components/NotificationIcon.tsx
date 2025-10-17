
// app/components/NotificationIcon.tsx
import React from 'react';
import Link from 'next/link';
import { useNotifications } from '../context/NotificationContext';

const NotificationIcon: React.FC = () => {
    const { unreadCount } = useNotifications();

    return (
        <Link href="/notifications" className="text-gray-800 w-10 h-10 rounded-full flex items-center justify-center relative">
            <i className="fas fa-bell text-2xl"></i>
            {unreadCount > 0 && (
                <span id="notificationCount" className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${unreadCount === 0 ? 'hidden' : ''}`}>{unreadCount}</span>
            )}
        </Link>
    );
};

export default NotificationIcon;
