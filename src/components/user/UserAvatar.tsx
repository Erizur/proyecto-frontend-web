import { Link } from "react-router-dom";

interface UserAvatarProps {
    username: string;
    displayName: string;
    profilePictureUrl?: string | null;
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
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const imageSrc = (profilePictureUrl && profilePictureUrl.trim() !== "") 
        ? profilePictureUrl 
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const ringClass = size === 'xs' ? 'ring-1' : 'ring-2';

    const avatar = (
        <div className="avatar">
            <div className={`${sizeClasses[size]} rounded-full ${ringClass} ring-base-300 ring-offset-base-100 ring-offset-1`}>
                <img 
                    src={imageSrc} 
                    alt={displayName} 
                    className="object-cover"
                    onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
                    }}
                />
            </div>
        </div>
    );

    if (!clickable) return avatar;

    return (
        <Link 
            to={`/profile/${username}`} 
            onClick={(e) => e.stopPropagation()}
            className="transition-transform hover:scale-105 active:scale-95"
        >
            {avatar}
        </Link>
    );
}