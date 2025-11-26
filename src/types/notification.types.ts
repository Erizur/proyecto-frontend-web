import type { PublicUser } from "./user.types";

export type NotificationType = 
    | "COMMENT_ON_POST" 
    | "REPLY_TO_COMMENT" 
    | "HEART_ON_POST" 
    | "CONTENT_MODERATED" 
    | "WELCOME" 
    | "NEW_FOLLOWER";

export interface Notification {
    id: number;
    recipient: PublicUser;
    actor: PublicUser; // Quién hizo la acción (ej. quien te dio like)
    type: NotificationType;
    referenceId: number; // ID del post o del usuario relacionado
    message: string;
    createdAt: string;
    read: boolean;
}