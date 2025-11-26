import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicationService } from '../api/publication.service';
import { commentService } from '../api/comment.service';
import { userService } from '../api/user.service';
import { useAuth } from '../hooks/useAuth';
import { getUserName } from '../hooks/utils/formatters.ts';

import type { Publication } from '../types/publication.types';
import type { Comment } from '../types/comment.types';

import PostActions from '../components/post/PostActions';
import PostTags from '../components/post/PostTags';
import UserAvatar from '../components/user/UserAvatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const { userId: currentUserId } = useAuth();
    
    const [post, setPost] = useState<Publication | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingComment, setSendingComment] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPost();
            fetchComments();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const data = await publicationService.getById(Number(id));
            setPost(data);
            setLikes(data.heartsCount);
            setIsLiked(data.likedByMe);
            setIsSaved(data.savedByMe);
            setError(null);
        } catch (err) {
            setError('Error al cargar la publicación');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await commentService.getByPublication(Number(id));
            // Ordenamos por fecha (más recientes abajo, como chat, o arriba)
            // Si el backend ya los ordena, genial. Si no:
            // data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLike = async () => {
        if (!post) return;
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikes(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));

        try {
            await publicationService.toggleHeart(post.id);
        } catch (error) {
            console.error(error);
            setIsLiked(!newIsLiked); // Revertir
        }
    };

    const handleSave = async () => {
        if (!post) return;
        const newSaved = !isSaved;
        setIsSaved(newSaved);
        try {
            await userService.toggleSavePost(post.id);
        } catch (error) {
            console.error(error);
            setIsSaved(!newSaved);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setSendingComment(true);
        try {
            await commentService.create(Number(id), { text: newComment });
            setNewComment('');
            // Recargar comentarios para asegurar consistencia con ID del servidor
            await fetchComments(); 
        } catch (err) {
            console.error('Error adding comment:', err);
            // Podrías mostrar un toast de error aquí
        } finally {
            setSendingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm("¿Borrar este comentario?")) return;
        try {
            await commentService.delete(Number(id), commentId);
            // Actualización optimista en la UI
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchPost} />;
    if (!post) return <ErrorMessage message="Publicación no encontrada" />;

    const authorName = getUserName(post.author);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                <div className="md:col-span-7 lg:col-span-8">
                    <div className="card bg-base-100 shadow-sm border border-base-300 rounded-md overflow-hidden">
                        {post.images && post.images.length > 0 ? (
                            <div className="bg-base-200 flex items-center justify-center min-h-[300px]">
                                <img 
                                    src={post.images[0].url}
                                    alt={post.description}
                                    className="max-w-full max-h-[85vh] w-auto object-contain"
                                />
                            </div>
                        ) : (
                            <div className="p-12 flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 min-h-[300px]">
                                <p className="text-2xl font-serif italic text-center text-base-content/80">
                                    {post.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-5 lg:col-span-4 space-y-6">
                    <div className="card bg-base-100 shadow-sm border border-base-300 rounded-md p-5">
                        <div className="flex items-center gap-4 mb-4">
                            <UserAvatar 
                                username={post.author.username}
                                displayName={authorName}
                                profilePictureUrl={post.author.profilePictureUrl}
                                size="md"
                            />
                            <div>
                                <Link to={`/profile/${post.author.username}`} className="font-bold hover:text-primary transition-colors">
                                    {authorName}
                                </Link>
                                <div className="text-xs opacity-60 flex gap-2">
                                    <span>@{post.author.username}</span>
                                    <span>•</span>
                                    <span>{new Date(post.creationDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {post.images.length > 0 && (
                            <p className="text-sm mb-4 whitespace-pre-wrap text-base-content/90">{post.description}</p>
                        )}

                        <PostTags tags={post.tags} pubType={post.pubType} />

                        <div className="divider my-2"></div>

                        <PostActions
                            isLiked={isLiked}
                            isSaved={isSaved}
                            likes={likes}
                            comments={comments.length}
                            onLike={handleLike}
                            onComment={() => document.getElementById('comment-input')?.focus()}
                            onSave={handleSave}
                            onShare={() => {}}
                        />
                    </div>

                    {/* Panel de Comentarios */}
                    <div className="card bg-base-100 shadow-sm border border-base-300 rounded-md flex-1 flex flex-col max-h-[600px]">
                        <div className="p-4 border-b border-base-200 bg-base-100 rounded-t-md sticky top-0 z-10">
                            <h3 className="font-bold text-sm uppercase tracking-wide opacity-70">Comentarios ({comments.length})</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {comments.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-sm opacity-50">Aún no hay comentarios.</p>
                                    <p className="text-xs opacity-40">¡Di algo interesante!</p>
                                </div>
                            )}
                            
                            {comments.map((comment) => {
                                const commentAuthorName = getUserName(comment.author);
                                const isOwner = Number(currentUserId) === comment.author.userId;

                                return (
                                    <div key={comment.id} className="flex gap-3 group animate-in fade-in duration-300">
                                        <div className="shrink-0 mt-1">
                                            <UserAvatar 
                                                username={comment.author.username}
                                                displayName={commentAuthorName}
                                                profilePictureUrl={comment.author.profilePictureUrl}
                                                size="xs"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-base-200/60 p-3 rounded-2xl rounded-tl-none border border-transparent hover:border-base-300 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <Link to={`/profile/${comment.author.username}`} className="font-bold text-xs hover:underline text-base-content">
                                                        {commentAuthorName}
                                                    </Link>
                                                    <span className="text-[10px] opacity-40">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm mt-1 text-base-content/90 break-words">{comment.text}</p>
                                            </div>
                                            
                                            <div className="flex gap-3 mt-1 ml-2 h-4">
                                                {isOwner && (
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-[10px] text-error hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-3 bg-base-100 border-t border-base-200 rounded-b-md">
                            <div className="join w-full">
                                <input 
                                    id="comment-input"
                                    type="text"
                                    className="input input-bordered join-item w-full input-sm focus:outline-none focus:border-primary"
                                    placeholder="Escribe un comentario..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                    disabled={sendingComment}
                                />
                                <button 
                                    className="btn btn-primary btn-sm join-item"
                                    onClick={handleAddComment}
                                    disabled={sendingComment || !newComment.trim()}
                                >
                                    {sendingComment ? <span className="loading loading-xs"></span> : 'Enviar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}