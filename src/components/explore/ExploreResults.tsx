import PostCard from "../post/PostCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import type { Publication } from "../../types/publication.types";

interface ExploreResultsProps {
    posts: Publication[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    refresh: () => void;
    onLike: (id: number) => void;
    onClearSearch: () => void;
}

export default function ExploreResults({ 
    posts, loading, error, hasMore, loadMore, refresh, onLike, onClearSearch 
}: ExploreResultsProps) {

    if (loading && posts.length === 0) return <LoadingSpinner />;
    
    if (error) return <ErrorMessage message={error} onRetry={refresh} />;

    if (!loading && posts.length === 0) {
        return (
            <div className="text-center py-20 bg-base-100 rounded-xl border border-dashed border-base-300">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold">No encontramos resultados</h3>
                <p className="opacity-60">Intenta con otro tag o cambia los filtros.</p>
                <button 
                    className="btn btn-link mt-4"
                    onClick={onClearSearch}
                >
                    Limpiar filtros
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onLike={onLike}
                        onReport={() => {}}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="text-center mt-10">
                    <button 
                        className="btn btn-outline btn-wide"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Cargar más'}
                    </button>
                </div>
            )}
        </>
    );
}