import { useState, useEffect } from 'react';
import { notificationService } from '../api/notification.service';
import { useAuth } from './useAuth';

export function useNotificationCount() {
    const { userId } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) {
            setUnreadCount(0);
            return;
        }

        const fetchUnread = async () => {
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadCount(count);
            } catch (e) {
                console.error("Error fetching unread notifications", e);
            }
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 300000);
        
        return () => clearInterval(interval);
    }, [userId]);

    const decrementUnread = () => {
        if (!userId) return;
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const incrementUnread = () => {
        if (!userId) return;
        setUnreadCount(prev => prev + 1);
    };

    return { unreadCount, decrementUnread, incrementUnread };
}