import { useState } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../user/UserAvatar";
import { getUserName } from "../../hooks/utils/formatters.ts";
import type { Comment } from "../../types/comment.types";

interface CommentItemProps {
    comment: Comment;
    currentUserId?: string;
    onDelete: (id: number) => void;
    onReply: (parentId: number, text: string) => void;
}

export default function CommentItem({ comment, currentUserId, onDelete, onReply }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const isOwner = Number(currentUserId) === comment.author.userId;
    const authorName = getUserName(comment.author);

    const handleSubmitReply = () => {
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText("");
            setIsReplying(false);
        }
    };

    return (
        <div className="flex gap-3 mb-4 group animate-in fade-in duration-300">
            <div className="shrink-0 mt-1">
                <UserAvatar 
                    username={comment.author.username}
                    displayName={authorName}
                    profilePictureUrl={comment.author.profilePictureUrl}
                    size="xs"
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-base-200/60 p-3 rounded-2xl rounded-tl-none border border-transparent hover:border-base-300 transition-colors">
                    <div className="flex justify-between items-start">
                        <Link to={`/profile/${comment.author.username}`} className="font-bold text-xs hover:underline text-base-content">
                            {authorName}
                        </Link>
                        <span className="text-[10px] opacity-40">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm mt-1 text-base-content/90 break-words">{comment.text}</p>
                </div>
                
                <div className="flex gap-3 mt-1 ml-2 h-4 text-[10px]">
                    <button 
                        onClick={() => setIsReplying(!isReplying)}
                        className="opacity-60 hover:opacity-100 hover:underline"
                    >
                        Responder
                    </button>
                    {isOwner && (
                        <button 
                            onClick={() => onDelete(comment.id)}
                            className="text-error hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Eliminar
                        </button>
                    )}
                </div>

                {/* Input de Respuesta */}
                {isReplying && (
                    <div className="mt-2 flex gap-2">
                        <input 
                            type="text" 
                            className="input input-xs input-bordered w-full"
                            placeholder="Escribe una respuesta..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                            autoFocus
                        />
                        <button className="btn btn-xs btn-primary" onClick={handleSubmitReply}>Enviar</button>
                    </div>
                )}

                {/* Respuestas Anidadas */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-base-200">
                        {comment.replies.map(reply => (
                            <CommentItem 
                                key={reply.id} 
                                comment={reply} 
                                currentUserId={currentUserId}
                                onDelete={onDelete}
                                onReply={onReply} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}