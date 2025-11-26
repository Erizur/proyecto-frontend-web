import { Link } from "react-router-dom";

interface UserAvatarProps {
    username: string;
    displayName: string;
    profilePictureUrl?: string | null;
    // ✅ Añadido 'xs'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    clickable?: boolean;
}

export default function UserAvatar({ 
    username, 
    displayName, 
    profilePictureUrl, 
    size = 'md', 
    clickable = true 
}: UserAvatarProps) {
    
    const sizeClasses = {
        xs: 'w-6 h-6',   // ✅ Nuevo tamaño para CompactCard
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const imageSrc = profilePictureUrl 
        ? profilePictureUrl 
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    // Nota: Añadimos ring-1 para tamaños muy pequeños para que se distinga
    const ringClass = size === 'xs' ? 'ring-1' : 'ring';

    const avatar = (
        <div className="avatar">
            <div className={`${sizeClasses[size]} rounded-full ${ringClass} ring-primary ring-offset-base-100 ring-offset-1`}>
                <img 
                    src={imageSrc} 
                    alt={displayName} 
                    className="object-cover"
                />
            </div>
        </div>
    );

    if (!clickable) return avatar;

    // Detenemos la propagación para evitar clicks fantasma en tarjetas
    return (
        <Link 
            to={`/profile/${username}`} 
            onClick={(e) => e.stopPropagation()}
        >
            {avatar}
        </Link>
    );
}