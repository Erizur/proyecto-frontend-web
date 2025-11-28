import { useEffect, useState, useCallback } from "react";
import { notificationService } from "../api/notification.service";
import type { Notification } from "../types/notification.types";
import { useNotificationCount } from "./useNotificationCount";

export function useNotifications() {
    const { decrementUnread } = useNotificationCount();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await notificationService.getAll({ page: 0, size: 20 });
            setNotifications(response?.content || []); 
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las notificaciones');
            console.error(err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id: number) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
        
        decrementUnread();

        try {
            await notificationService.markAsRead(id);
        } catch (error) {
            console.error('Error marcando como leída', error);
        }
    };

    return { 
        notifications, 
        loading, 
        error,
        markAsRead, 
        refresh: fetchNotifications 
    };
}