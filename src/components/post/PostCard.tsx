import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Publication } from "../../types/publication.types";
import UserAvatar from "../user/UserAvatar";
import PostActions from "./PostActions";
import PostTags from "./PostTags";
import { getUserName } from "../../hooks/utils/formatters.ts";
import { userService } from "../../api/user.service";

interface PostCardProps {
    post: Publication;
    onLike: (id: number) => void;
    onSave?: (id: number) => void;
    onReport: (id: number) => void;
}

export default function PostCard({ post, onLike, onSave, onReport }: PostCardProps) {
    const navigate = useNavigate();
    
    const [isLiked, setIsLiked] = useState(post.likedByMe ?? false); 
    const [likes, setLikes] = useState(post.heartsCount || 0);
    const [isSaved, setIsSaved] = useState(post.savedByMe ?? false);

    if (!post || !post.author) return null;

    const handleLike = () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikes(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
        onLike(post.id);
    };

    const handleSave = async () => {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        
        if (onSave) onSave(post.id);

        try {
            await userService.toggleSavePost(post.id);
        } catch (error) {
            console.error("Error guardando post", error);
            setIsSaved(!newSavedState);
        }
    };

    const handleCommentClick = () => {
        navigate(`/post/${post.id}`);
    };

    const authorName = getUserName(post.author);

    return (
        // ✅ DISEÑO: rounded-md (sutil), border definido, shadow-sm
        <div className="card bg-base-100 shadow-sm border border-base-300 rounded-md hover:shadow-md transition-shadow duration-200">
            <div className="card-body p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <UserAvatar 
                            username={post.author.username}
                            displayName={authorName}
                            profilePictureUrl={post.author.profilePictureUrl}
                        />
                        <div className="flex flex-col">
                            <Link to={`/profile/${post.author.username}`} className="font-bold text-sm hover:underline leading-tight text-base-content">
                                {authorName}
                            </Link>
                            <p className="text-xs text-base-content/60">
                                @{post.author.username} · {new Date(post.creationDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-square rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-md z-[1] w-40 p-1 shadow-lg border border-base-200">
                            <li><button onClick={() => onReport(post.id)} className="text-error text-xs rounded-sm">Reportar</button></li>
                        </ul>
                    </div>
                </div>

                <Link to={`/post/${post.id}`} className="block group">
                    {post.description && (
                        <p className="text-sm mb-3 whitespace-pre-wrap text-base-content group-hover:text-primary/90 transition-colors">
                            {post.description}
                        </p>
                    )}
                    
                    {post.images && post.images.length > 0 && (
                        <figure className={`grid gap-1 rounded-sm overflow-hidden mb-3 bg-base-200 border border-base-200 ${
                            post.images.length === 1 ? 'grid-cols-1' : 
                            post.images.length === 2 ? 'grid-cols-2' : 
                            'grid-cols-2'
                        }`}>
                            {post.images.slice(0, 4).map((img, index) => (
                                <div key={img.id} className="relative aspect-square">
                                    <img 
                                        src={img.url} 
                                        alt={`Post content ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    {index === 3 && post.images.length > 4 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                                            +{post.images.length - 4}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </figure>
                    )}
                </Link>

                {/* Tags */}
                <PostTags tags={post.tags} pubType={post.pubType} />

                {/* Acciones */}
                <PostActions 
                    isLiked={isLiked}
                    isSaved={isSaved}
                    likes={likes}
                    comments={post.commentsCount || 0}
                    onLike={handleLike}
                    onComment={handleCommentClick}
                    onSave={handleSave}
                    onShare={() => {}}
                />
            </div>
        </div>
    );
}