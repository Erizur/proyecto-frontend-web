interface PostActionsProps {
    isLiked: boolean;
    isSaved: boolean;
    likes: number;
    comments: number;
    onLike: () => void;
    onComment: () => void;
    onSave: () => void;
    onShare: () => void;
}

// ✅ Asegúrate que aquí diga PostActions y NO PostCard
export default function PostActions({ 
    isLiked, 
    isSaved, 
    likes, 
    comments, 
    onLike, 
    onComment, 
    onSave, 
    onShare 
}: PostActionsProps) {
    return (
        <div className="flex items-center gap-1 pt-2 border-t border-base-300 mt-3">
            <button 
                className={`btn btn-ghost btn-sm gap-2 flex-1 ${isLiked ? 'text-error' : ''}`}
                onClick={(e) => { e.preventDefault(); onLike(); }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs">{likes}</span>
            </button>
            
            <button className="btn btn-ghost btn-sm gap-2 flex-1" onClick={(e) => { e.preventDefault(); onComment(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs">{comments}</span>
            </button>

            <button 
                className={`btn btn-ghost btn-sm gap-2 flex-1 ${isSaved ? 'text-warning' : ''}`}
                onClick={(e) => { e.preventDefault(); onSave(); }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </button>

            <button className="btn btn-ghost btn-sm gap-2 flex-1" onClick={(e) => { e.preventDefault(); onShare(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </button>
        </div>
    );
}