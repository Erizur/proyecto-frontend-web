import { useState } from "react";
import ArtMap from "../components/map/ArtMap";
import { mapService } from "../api/map.service";
import type { Publication } from "../types/publication.types";
import PostCard from "../components/post/PostCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyStateProps";
import { publicationService } from "../api/publication.service";

export default function MapPage() {
    const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
    const [posts, setPosts] = useState<Publication[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePlaceSelect = async (placeId: number) => {
        setSelectedPlaceId(placeId);
        setLoadingPosts(true);
        setError(null);
        
        // Scroll hacia abajo en móvil para ver los posts
        if (window.innerWidth < 1024) {
            setTimeout(() => {
                document.getElementById('map-posts-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }

        try {
            // Traemos la primera página
            const response = await mapService.getPostsForPlace(placeId, { page: 0, size: 20 });
            setPosts(response.content);
        } catch (err: any) {
            console.error(err);
            setError("No se pudieron cargar las obras de este lugar.");
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleLike = async (id: number) => {
         try { await publicationService.toggleHeart(id); } catch (e) { console.error(e); }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden">
            {/* Panel Izquierdo (Mapa) - Ocupa todo en móvil, mitad en desktop */}
            <div className="flex-1 h-[50vh] lg:h-full relative p-4">
                <ArtMap onPlaceSelect={handlePlaceSelect} />
            </div>

            {/* Panel Derecho (Lista de Posts) - Scrollable */}
            <div 
                id="map-posts-section"
                className="flex-1 h-[50vh] lg:h-full bg-base-100 border-l border-base-200 overflow-y-auto p-6 shadow-inner"
            >
                {!selectedPlaceId ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                        <div className="text-6xl mb-4">📍</div>
                        <h2 className="text-2xl font-bold mb-2">Selecciona un lugar</h2>
                        <p>Toca un marcador en el mapa para ver las obras creadas allí.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Obras en este lugar</h2>
                            <button 
                                onClick={() => setSelectedPlaceId(null)} 
                                className="btn btn-ghost btn-sm lg:hidden"
                            >
                                Cerrar
                            </button>
                        </div>

                        {loadingPosts ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <ErrorMessage message={error} onRetry={() => handlePlaceSelect(selectedPlaceId)} />
                        ) : posts.length === 0 ? (
                            <EmptyState message="No hay obras visibles en este lugar (pueden estar moderadas o ser contenido sensible)." />
                        ) : (
                            <div className="space-y-6 pb-20 lg:pb-0">
                                {posts.map(post => (
                                    <PostCard 
                                        key={post.id} 
                                        post={post} 
                                        onLike={handleLike} 
                                        onReport={() => {}} // Pendiente conectar modal
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}