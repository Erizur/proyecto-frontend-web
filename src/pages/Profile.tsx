import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../api/user.service';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import type { UserDetails } from '../types/user.types';
import type { PublicationType } from '../types/publication.types';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import PostCard from '../components/post/PostCard';
import EmptyState from '../components/common/EmptyStateProps';

export default function Profile() {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser } = useAuth();
    
    const [profileData, setProfileData] = useState<UserDetails | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState<'ART' | 'COMMUNITY' | 'LIKED'>('ART');

    const isOwnProfile = Boolean(
        currentUser && 
        profileData && 
        Number(currentUser.userId) === profileData.userId
    );

    const pubTypeFilter: PublicationType | undefined = 
        activeTab === 'COMMUNITY' ? 'TEXT' : 
        activeTab === 'ART' ? 'ILLUSTRATION' : undefined;

    const { 
        posts, 
        loading: loadingPosts, 
        hasMore, 
        loadMore 
    } = usePosts({ 
        pubType: pubTypeFilter, 
        userId: profileData?.userId ?? null 
    });

    useEffect(() => {
        if (username) {
            fetchUserProfile();
        }
    }, [username]);

    const fetchUserProfile = async () => {
        try {
            setLoadingProfile(true);
            setProfileError(null);
            
            // 1. Buscar ID por username (Público)
            const basicInfo = await userService.getByUsername(username!);
            
            // 2. Buscar DETALLES COMPLETOS por ID (Privado/Interno)
            // Esto es necesario para obtener followersCount y followingCount
            const details = await userService.getById(basicInfo.userId);
            
            setProfileData(details);

        } catch (err) {
            console.error(err);
            setProfileError('Usuario no encontrado');
        } finally {
            setLoadingProfile(false);
        }
    };

    if (loadingProfile) return <LoadingSpinner />;
    if (profileError) return <ErrorMessage message={profileError} onRetry={fetchUserProfile} />;
    if (!profileData) return <ErrorMessage message="Usuario no encontrado" />;

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <ProfileHeader 
                profile={profileData} 
                isOwnProfile={isOwnProfile} 
                followersCount={profileData.followersCount}
                followingCount={profileData.followingCount}
            />

            <ProfileTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                isOwnProfile={isOwnProfile}
            />

            <div className="min-h-[300px]">
                {loadingPosts && posts.length === 0 ? (
                    <LoadingSpinner />
                ) : posts.length > 0 ? (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={() => {}}
                                onReport={() => {}}
                            />
                        ))}
                        
                        {hasMore && (
                            <div className="flex justify-center mt-6">
                                <button 
                                    className="btn btn-outline btn-wide"
                                    onClick={loadMore}
                                    disabled={loadingPosts}
                                >
                                    {loadingPosts ? 'Cargando...' : 'Cargar más'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState 
                        message={
                            activeTab === 'COMMUNITY' ? "No hay publicaciones de comunidad." :
                            activeTab === 'LIKED' ? "No tienes publicaciones guardadas." :
                            "Este usuario no ha publicado arte visual."
                        } 
                    />
                )}
            </div>
        </div>
    );
}