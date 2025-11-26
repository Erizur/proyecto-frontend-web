import PostCard from "../post/PostCard";
import EmptyState from "../common/EmptyStateProps";
import type { Publication } from "../../types/publication.types";
import { publicationService } from "../../api/publication.service"; // Importar servicio

interface ProfileArtworksProps {
    publications: Publication[];
    isOwnProfile: boolean;
}

export default function ProfileArtworks({ publications, isOwnProfile }: ProfileArtworksProps) {
    
    const handleLike = async (id: number) => {
        try {
            await publicationService.toggleHeart(id);
        } catch (error) {
            console.error("Error dando like:", error);
        }
    };

    const handleReport = (id: number) => {
        console.log("Reportar post", id);
        alert("Funcionalidad de reporte pendiente de conexión con modal global");
    };

    if (publications.length === 0) {
        return (
            <EmptyState 
                message={isOwnProfile 
                    ? "Aún no has publicado nada." 
                    : "Este usuario aún no tiene publicaciones."} 
            />
        );
    }

    return (
        <div className="space-y-6">
            {publications.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onReport={handleReport}
                />
            ))}
        </div>
    );
}