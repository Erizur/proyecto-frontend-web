import { Link } from "react-router-dom";
import { useState } from "react";
import type { Publication } from "../../types/publication.types";
import UserAvatar from "../user/UserAvatar";
import PostTags from "./PostTags";

// ✅ IMPORTACIÓN CRÍTICA: Asegúrate que apunte a ./PostActions
import PostActions from "./PostActions"; 

interface PostCardProps {
    post: Publication;
    onLike: (id: number) => void;
    onSave?: (id: number) => void;
    onReport: (id: number) => void;
}

export default function PostCard({ post, onLike, onSave, onReport }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likes, setLikes] = useState(0);

    // ✅ PROTECCIÓN DE DATOS
    if (!post || !post.author) {
        return null; 
    }

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        onLike(post.id);
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        onSave?.(post.id);
    };

    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <UserAvatar 
                            username={post.author.username}
                            displayName={post.author.displayName}
                            profilePictureUrl={post.author.profilePictureUrl}
                        />
                        <div>
                            <Link to={`/profile/${post.author.username}`} className="font-semibold text-sm hover:underline">
                                {post.author.displayName}
                            </Link>
                            <p className="text-xs opacity-60">
                                @{post.author.username} · {new Date(post.creationDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a onClick={() => onReport(post.id)}>Reportar</a></li>
                        </ul>
                    </div>
                </div>

                {/* Contenido */}
                <Link to={`/post/${post.id}`}>
                    <p className="text-sm mb-3 cursor-pointer hover:text-primary">
                        {post.description}
                    </p>
                    {post.images && post.images.length > 0 && (
                        <figure className="rounded-lg overflow-hidden mb-3 cursor-pointer hover:opacity-95 transition-opacity">
                            <img 
                                src={post.images[0].url} 
                                alt="Post content" 
                                className="w-full object-cover"
                            />
                        </figure>
                    )}
                </Link>

                <PostTags tags={post.tags} pubType={post.pubType} />

                {/* Acciones */}
                <PostActions 
                    isLiked={isLiked}
                    isSaved={isSaved}
                    likes={likes}
                    comments={0}
                    onLike={handleLike}
                    onComment={() => {}}
                    onSave={handleSave}
                    onShare={() => {}}
                />
            </div>
        </div>
    );
}