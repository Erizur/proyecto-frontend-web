import { Link } from "react-router-dom";
import type { Publication } from "../../types/publication.types";
import UserAvatar from "../user/UserAvatar";

interface CompactPostCardProps {
    post: Publication;
    className?: string;
}

export default function CompactPostCard({ post, className = "" }: CompactPostCardProps) {
    // ✅ PROTECCIÓN
    if (!post || !post.author) return null;

    return (
        <div className={`relative rounded-xl overflow-hidden shadow-md group bg-base-200 ${className}`}>
            <Link to={`/post/${post.id}`} className="block w-full h-full">
                {post.images && post.images.length > 0 ? (
                    <img 
                        src={post.images[0].url} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={post.description} 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center">
                        <p className="text-xs line-clamp-6 font-medium opacity-70">
                            "{post.description}"
                        </p>
                    </div>
                )}
                
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                    <div className="flex items-center gap-2">
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
                            <p className="text-xs font-bold truncate leading-tight">
                                {post.author.displayName}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}