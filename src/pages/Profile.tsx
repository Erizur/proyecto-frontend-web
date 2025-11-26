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
import ProfileArtworks from '../components/profile/ProfileArtworks';
import EmptyState from '../components/common/EmptyStateProps';

export default function Profile() {
    const { username } = useParams<{ username: string }>();
    const { userId: currentUserIdStr } = useAuth(); 
    const currentUserId = currentUserIdStr ? Number(currentUserIdStr) : null;
    
    const [profileData, setProfileData] = useState<UserDetails | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState<'ART' | 'COMMUNITY' | 'LIKED'>('ART');

    const isOwnProfile = Boolean(
        currentUserId !== null && 
        profileData && 
        currentUserId === profileData.userId
    );

    const pubTypeFilter: PublicationType | undefined = 
        activeTab === 'COMMUNITY' ? 'TEXT' : 
        activeTab === 'ART' ? 'ILLUSTRATION' : undefined;

    const showSaved = activeTab === 'LIKED';

    const { 
        posts, 
        loading: loadingPosts, 
        hasMore, 
        loadMore 
    } = usePosts({ 
        pubType: pubTypeFilter, 
        userId: profileData?.userId ?? null,
        onlySaved: showSaved 
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
            const basicInfo = await userService.getByUsername(username!);
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
                    <>
                        <ProfileArtworks 
                            publications={posts} 
                            isOwnProfile={isOwnProfile} 
                        />
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
                    </>
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