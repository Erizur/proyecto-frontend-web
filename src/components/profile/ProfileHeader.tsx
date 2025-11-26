import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../user/UserAvatar";
import { userService } from "../../api/user.service";
import { useAuth } from "../../hooks/useAuth"; 
import type { UserDetails, PublicUser } from "../../types/user.types";
import type { Author } from "../../types/publication.types";

interface ProfileHeaderProps {
    // Combinamos tipos para aceptar cualquiera, priorizando UserDetails
    profile: UserDetails | PublicUser | Author;
    isOwnProfile: boolean;
    followersCount?: number; 
    followingCount?: number;
}

export default function ProfileHeader({ 
    profile, 
    isOwnProfile, 
    followersCount = 0, 
    followingCount = 0 
}: ProfileHeaderProps) {
    const { userId: currentUserId } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [localFollowers, setLocalFollowers] = useState(followersCount);
    const [loadingFollow, setLoadingFollow] = useState(false);

    useEffect(() => {
        if (currentUserId && !isOwnProfile && profile.userId) {
            checkFollowStatus();
        }
    }, [currentUserId, profile.userId, isOwnProfile]);

    useEffect(() => {
        setLocalFollowers(followersCount);
    }, [followersCount]);

    const checkFollowStatus = async () => {
        if (!currentUserId) return;
        const status = await userService.checkIsFollowing(Number(currentUserId), profile.userId);
        setIsFollowing(status);
    };

    const handleFollow = async () => {
        if (loadingFollow) return;
        setLoadingFollow(true);
        try {
            await userService.toggleFollow(profile.userId);
            
            if (isFollowing) {
                setLocalFollowers(prev => Math.max(0, prev - 1));
            } else {
                setLocalFollowers(prev => prev + 1);
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Error al seguir", error);
        } finally {
            setLoadingFollow(false);
        }
    };

    // Helpers seguros para propiedades opcionales
    const description = 'description' in profile ? profile.description : '';
    const role = 'role' in profile ? profile.role : 'USER';
    const profilePic = 'profilePictureUrl' in profile ? profile.profilePictureUrl : undefined;

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl mb-6 border border-base-200">
            <figure className="pt-6 lg:pl-6">
                <UserAvatar 
                    username={profile.username}
                    displayName={profile.displayName}
                    profilePictureUrl={profilePic}
                    size="lg"
                    clickable={false}
                />
            </figure>
            
            <div className="card-body">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div>
                        <h2 className="card-title text-2xl">
                            {profile.displayName}
                            <div className="badge badge-primary badge-outline text-xs">{role}</div>
                        </h2>
                        <p className="text-base-content/60 text-sm">@{profile.username}</p>
                    </div>

                    <div className="card-actions">
                        {isOwnProfile ? (
                            <Link to="/settings" className="btn btn-sm btn-outline gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Editar
                            </Link>
                        ) : (
                            <button 
                                onClick={handleFollow}
                                disabled={loadingFollow}
                                className={`btn btn-sm ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                            >
                                {isFollowing ? 'Siguiendo' : 'Seguir'}
                            </button>
                        )}
                    </div>
                </div>

                {description && <p className="mt-2 text-sm">{description}</p>}

                <div className="stats shadow mt-4 bg-base-200/50 stats-vertical lg:stats-horizontal">
                    <Link to={`/profile/${profile.username}/followers`} className="stat place-items-center lg:place-items-start p-2 lg:px-4 hover:bg-base-200 transition-colors cursor-pointer">
                        <div className="stat-title text-xs">Seguidores</div>
                        <div className="stat-value text-lg">{localFollowers}</div>
                    </Link>
                    
                    <Link to={`/profile/${profile.username}/following`} className="stat place-items-center lg:place-items-start p-2 lg:px-4 hover:bg-base-200 transition-colors cursor-pointer">
                        <div className="stat-title text-xs">Siguiendo</div>
                        <div className="stat-value text-lg">{followingCount}</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}