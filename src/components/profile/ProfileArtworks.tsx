import PostCard from "../post/PostCard";
import EmptyState from "../common/EmptyStateProps";
import type { Publication } from "../../types/publication.types";

interface ProfileArtworksProps {
    publications: Publication[];
    isOwnProfile: boolean;
}

export default function ProfileArtworks({ publications, isOwnProfile }: ProfileArtworksProps) {
    if (publications.length === 0) {
        return (
            <EmptyState 
                message={isOwnProfile 
                    ? "Aún no has publicado nada." 
                    : "Este usuario aún no tiene publicaciones o son privadas."} 
            />
        );
    }

    return (
        <div className="space-y-4">
            {publications.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => {}} // Conectar lógica de like
                    onReport={() => {}} // Conectar lógica de reporte
                />
            ))}
        </div>
    );
}