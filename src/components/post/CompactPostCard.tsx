import { Link } from "react-router-dom";
import type { Publication } from "../../types/publication.types";
import UserAvatar from "../user/UserAvatar";

interface CompactPostCardProps {
    post: Publication;
    className?: string;
}

export default function CompactPostCard({ post, className = "" }: CompactPostCardProps) {
    if (!post || !post.author) return null;

    return (
        <div className={`relative rounded-md overflow-hidden shadow-sm border border-base-300 group bg-base-200 ${className}`}>
            <Link to={`/post/${post.id}`} className="block w-full h-full">
                {post.images && post.images.length > 0 ? (
                    <img 
                        src={post.images[0].url} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={post.description} 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center bg-base-100">
                        <p className="text-xs line-clamp-6 font-medium opacity-70 font-serif italic">
                            "{post.description}"
                        </p>
                    </div>
                )}
                
                {/* Overlay más sutil */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                        <div className="shrink-0">
                            <UserAvatar 
                                username={post.author.username}
                                displayName={post.author.displayName}
                                profilePictureUrl={post.author.profilePictureUrl}
                                size="xs"
                                clickable={false}
                            />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate leading-tight text-white">
                                {post.author.displayName || post.author.username}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}