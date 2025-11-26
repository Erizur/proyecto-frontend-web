import { useNotifications } from '../hooks/useNotifications';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyStateProps';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NotificationItem from '../components/notification/NotificationItem';

export default function Notifications() {
    const { notifications, loading, error, markAsRead, refresh } = useNotifications();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refresh} />;

    return (
        <div className="max-w-2xl mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Notificaciones</h1>
                <button onClick={refresh} className="btn btn-ghost btn-sm btn-circle" title="Recargar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {!notifications || notifications.length === 0 ? (
                <EmptyState message="No tienes notificaciones recientes" />
            ) : (
                <div className="space-y-2">
                    {notifications.map((notif) => (
                        <NotificationItem 
                            key={notif.id} 
                            notification={notif} 
                            onMarkAsRead={markAsRead} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}