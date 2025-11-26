import { useEffect, useState, useCallback } from "react";
import { notificationService } from "../api/notification.service";
import type { Notification } from "../types/notification.types";

export function useNotifications() {
    // Inicializamos siempre como array vacío
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await notificationService.getAll({
                page: 0,
                size: 20,
            });
            
            // CORRECCIÓN CRÍTICA: Si response.content es undefined, usa []
            setNotifications(response?.content || []); 
            
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadCount(count);
            } catch (e) {
                console.warn("No se pudo cargar el contador de no leídos", e);
            }
            
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las notificaciones');
            console.error(err);
            setNotifications([]); // En caso de error, aseguramos array vacío
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id: number) => {
        // Actualización optimista
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));

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
        unreadCount, 
        markAsRead, 
        refresh: fetchNotifications 
    };
}