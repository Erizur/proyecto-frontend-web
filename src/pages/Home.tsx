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
import { useAuth } from '../hooks/useAuth';
import type { PublicationType } from '../types/publication.types';

export default function Home() {
    const { userId } = useAuth(); 
    
    // Estados de vista: 
    // 'following': Solo seguidos (Arte/Texto mezclado o filtrado)
    // 'discover': Todo global (Más recientes)
    // 'community': Solo texto global
    const [viewMode, setViewMode] = useState<'following' | 'discover' | 'community'>('discover');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Hook de Recientes (Carrusel superior)
    const { posts: recentPosts, loading: loadingRecent } = usePosts({
        pubType: 'ILLUSTRATION',
        onlyFollowing: false 
    });

    // Lógica para el Feed Principal
    let feedPubType: PublicationType | undefined = undefined;
    let onlyFollowing = false;

    if (viewMode === 'following') {
        onlyFollowing = true;
        // Puedes filtrar si quieres solo arte en 'following' o todo
        // feedPubType = 'ILLUSTRATION'; 
    } else if (viewMode === 'community') {
        feedPubType = 'TEXT';
        onlyFollowing = false;
    } else if (viewMode === 'discover') {
        feedPubType = undefined; // Trae todo
        onlyFollowing = false;
    }
    
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
        onlyFollowing: onlyFollowing
    });

    const handleLike = async (postId: number) => {
         try { await publicationService.toggleHeart(postId); } catch (e) { console.error(e); }
    };

    const handleCreatePost = async (data: any, images: File[]) => {
        try {
            const newPost = await publicationService.create(data, images);
            // Actualizar feed si corresponde
            refresh();
            setShowCreateModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (error) return <ErrorMessage message={error} onRetry={refresh} />;

    return (
        <div className="max-w-7xl mx-auto py-6 px-4">
            
            {/* Carrusel de Recientes (Estética mejorada) */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <h2 className="text-xl font-bold text-base-content">🔥 Tendencias en Arte</h2>
                </div>
                
                {loadingRecent && recentPosts.length === 0 ? (
                    <div className="flex gap-4 overflow-hidden">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="skeleton w-64 h-80 rounded-md shrink-0 opacity-50"></div>
                        ))}
                    </div>
                ) : (
                    <HorizontalFeed posts={recentPosts} />
                )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                     
                    {/* Tabs de Navegación */}
                     <div className="flex items-center justify-between mb-6 sticky top-20 z-30 bg-base-100/80 backdrop-blur p-2 rounded-md border border-base-200 shadow-sm">
                        <div role="tablist" className="tabs tabs-bordered w-full">
                            <a 
                                role="tab" 
                                className={`tab h-10 flex-1 transition-colors ${viewMode === 'discover' ? 'tab-active font-bold border-primary text-primary' : 'text-base-content/60'}`}
                                onClick={() => setViewMode('discover')}
                            >
                                Descubrir
                            </a>
                            
                            {userId && (
                                <a 
                                    role="tab" 
                                    className={`tab h-10 flex-1 transition-colors ${viewMode === 'following' ? 'tab-active font-bold border-primary text-primary' : 'text-base-content/60'}`}
                                    onClick={() => setViewMode('following')}
                                >
                                    Siguiendo
                                </a>
                            )}
                            
                            <a 
                                role="tab" 
                                className={`tab h-10 flex-1 transition-colors ${viewMode === 'community' ? 'tab-active font-bold border-primary text-primary' : 'text-base-content/60'}`}
                                onClick={() => setViewMode('community')}
                            >
                                Comunidad
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
                                <div className="flex justify-center pt-4 pb-8">
                                    <button 
                                        className="btn btn-outline btn-wide rounded-md" 
                                        onClick={loadMore} 
                                        disabled={loadingFeed}
                                    >
                                        {loadingFeed ? 'Cargando...' : 'Ver más'}
                                    </button>
                                </div>
                            )}

                            {!loadingFeed && feedPosts.length === 0 && (
                                <div className="text-center py-16 bg-base-100 rounded-md border border-base-200 shadow-sm">
                                    <div className="max-w-xs mx-auto">
                                        <p className="font-bold text-lg mb-2">¡Está muy tranquilo por aquí!</p>
                                        <p className="text-base-content/60 mb-4">
                                            {viewMode === 'following' 
                                                ? 'Las personas que sigues no han publicado nada recientemente.' 
                                                : 'No hay publicaciones recientes en esta categoría.'}
                                        </p>
                                        {viewMode === 'following' && (
                                            <button onClick={() => setViewMode('discover')} className="btn btn-primary btn-sm rounded-md">
                                                Descubrir Artistas
                                            </button>
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