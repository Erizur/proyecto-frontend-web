import { Link } from "react-router-dom";
import type { Notification, NotificationType } from "../../types/notification.types";
import UserAvatar from "../user/UserAvatar";

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const getConfig = (type: NotificationType, referenceId: number, actorUsername: string) => {
        switch (type) {
            case 'HEART_ON_POST':
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>,
                    link: `/post/${referenceId}`,
                    bgColor: 'bg-error/10',
                    actionText: 'Nueva interacción'
                };
            case 'COMMENT_ON_POST':
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>,
                    link: `/post/${referenceId}`,
                    bgColor: 'bg-primary/10',
                    actionText: 'Nuevo comentario'
                };
            case 'REPLY_TO_COMMENT':
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
                    link: `/post/${referenceId}`,
                    bgColor: 'bg-info/10',
                    actionText: 'Nueva respuesta'
                };
            case 'NEW_FOLLOWER':
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>,
                    link: `/profile/${actorUsername}`,
                    bgColor: 'bg-secondary/10',
                    actionText: 'Nuevo seguidor'
                };
            case 'CONTENT_MODERATED':
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
                    link: '#',
                    bgColor: 'bg-warning/10',
                    actionText: 'Tu contenido ha sido moderado'
                };
            case 'WELCOME':
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>,
                    link: '/explore',
                    bgColor: 'bg-success/10',
                    actionText: '¡Bienvenido a ArtPond!'
                };
            default:
                return {
                    icon: <div className="w-2 h-2 bg-gray-400 rounded-full"></div>,
                    link: '#',
                    bgColor: 'bg-base-200',
                    actionText: 'Nueva notificación'
                };
        }
    };

    const config = getConfig(notification.type, notification.referenceId, notification.actor?.username);

    return (
        <Link 
            to={config.link}
            className={`block p-4 rounded-xl transition-all hover:scale-[1.01] border ${notification.read ? 'bg-base-100 border-transparent' : 'bg-base-100 border-primary/20 shadow-sm'}`}
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
        >
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bgColor}`}>
                    {config.icon}
                </div>

                {notification.actor && (
                    <div className="shrink-0">
                        <UserAvatar 
                            username={notification.actor.username}
                            displayName={notification.actor.displayName}
                            profilePictureUrl={notification.actor.profilePictureUrl}
                            size="sm"
                            clickable={false}
                        />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1 flex-wrap">
                        {notification.actor && (
                            <span className="font-bold text-sm">
                                {notification.actor.displayName}
                            </span>
                        )}
                        <span className="text-sm text-base-content/80 ml-1">
                            {config.actionText}
                        </span>
                    </div>
                    
                    {notification.message && (
                        <p className="text-sm text-base-content/60 mt-1 italic line-clamp-2">
                            "{notification.message}"
                        </p>
                    )}
                    
                    <p className="text-xs text-base-content/40 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()} · {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>

                {!notification.read && (
                    <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-2" title="No leída"></div>
                )}
            </div>
        </Link>
    );
}