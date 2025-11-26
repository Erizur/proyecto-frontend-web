import { useState } from 'react';
import { publicationService } from '../api/publication.service';
import PostCard from '../components/post/PostCard';
import CreatePostModal from '../components/post/CreatePostModal';
import CreatePostButton from '../components/common/CreatePostButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { usePosts } from '../hooks/usePosts';
import HorizontalFeed from '../components/feed/HorizontalFeed';
import HomeSidebar from '../components/feed/HomeSideBar';

export default function Home() {
    const [viewMode, setViewMode] = useState<'following' | 'community'>('following');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // 1. RECIENTES: Feed Global (onlyFollowing: false)
    const { posts: recentPosts, loading: loadingRecent } = usePosts({
        pubType: 'ILLUSTRATION',
        onlyFollowing: false 
    });

    // 2. FEED PRINCIPAL: Solo Seguidos
    const feedPubType = viewMode === 'community' ? 'TEXT' : 'ILLUSTRATION';
    
    // ✅ CORRECCIÓN: Pasamos un objeto con las opciones
    const { 
        posts: feedPosts, 
        loading: loadingFeed, 
        error, 
        hasMore, 
        loadMore, 
        refresh,
        setPosts 
    } = usePosts({
        pubType: feedPubType,
        onlyFollowing: true // Esto activa getFeed
    });

    const handleLike = async (postId: number) => {
         try { await publicationService.toggleHeart(postId); } catch (e) { console.error(e); }
    };

    const handleCreatePost = async (data: any, images: File[]) => {
        try {
            const newPost = await publicationService.create(data, images);
            if (
                (viewMode === 'community' && newPost.pubType === 'TEXT') ||
                (viewMode === 'following' && newPost.pubType !== 'TEXT')
            ) {
                setPosts(prev => [newPost, ...prev]);
            }
            setShowCreateModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (error) return <ErrorMessage message={error} onRetry={refresh} />;

    return (
        <div className="max-w-7xl mx-auto py-6 px-4">
            
            {/* Recientes Globales */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <h2 className="text-xl font-bold">🔥 Ilustraciones Recientes</h2>
                </div>
                
                {loadingRecent && recentPosts.length === 0 ? (
                    <div className="flex gap-4 overflow-hidden">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="skeleton w-64 h-80 rounded-xl shrink-0"></div>
                        ))}
                    </div>
                ) : (
                    <HorizontalFeed posts={recentPosts} />
                )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Feed Principal (Seguidos) */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6">
                        <div role="tablist" className="tabs tabs-bordered w-full">
                            <a 
                                role="tab" 
                                className={`tab h-12 text-lg flex-1 ${viewMode === 'following' ? 'tab-active font-bold border-primary' : ''}`}
                                onClick={() => setViewMode('following')}
                            >
                                Siguiendo (Arte)
                            </a>
                            <a 
                                role="tab" 
                                className={`tab h-12 text-lg flex-1 ${viewMode === 'community' ? 'tab-active font-bold border-primary' : ''}`}
                                onClick={() => setViewMode('community')}
                            >
                                Comunidad (Texto)
                            </a>
                        </div>
                    </div>

                    {loadingFeed && feedPosts.length === 0 ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-6">
                            {feedPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onReport={() => {}}
                                />
                            ))}
                            
                            {hasMore && (
                                <div className="flex justify-center pt-4">
                                    <button 
                                        className="btn btn-outline btn-wide" 
                                        onClick={loadMore} 
                                        disabled={loadingFeed}
                                    >
                                        {loadingFeed ? 'Cargando...' : 'Ver más'}
                                    </button>
                                </div>
                            )}

                            {!loadingFeed && feedPosts.length === 0 && (
                                <div className="text-center py-16 bg-base-100 rounded-xl border border-base-200 shadow-sm">
                                    <div className="max-w-xs mx-auto">
                                        <p className="font-bold text-lg mb-2">¡Está muy tranquilo por aquí!</p>
                                        <p className="text-base-content/60 mb-4">
                                            {viewMode === 'following' 
                                                ? 'Parece que las personas que sigues no han publicado arte recientemente.' 
                                                : 'No hay discusiones recientes de tu comunidad.'}
                                        </p>
                                        {viewMode === 'following' && (
                                            <a href="/explore" className="btn btn-primary btn-sm">Explorar Artistas</a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block lg:col-span-4">
                    <HomeSidebar />
                </div>
            </div>

            <CreatePostButton onClick={() => setShowCreateModal(true)} />
            
            <CreatePostModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreatePost}
            />
        </div>
    );
}