import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import AppealModal from '../components/post/AppealModal';
import EditPostModal from '../components/post/EditPostModal';
import CommentItem from '../components/post/CommentItem';
import ReportModal from '../components/ReportModal';

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const { userId: currentUserId } = useAuth();
    const navigate = useNavigate();
    
    const [post, setPost] = useState<Publication | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingComment, setSendingComment] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Modals
    const [showAppeal, setShowAppeal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showReport, setShowReport] = useState(false);

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
            
            setLikes(data.heartsCount || 0);
            setIsLiked(data.likedByMe ?? false);
            setIsSaved(data.savedByMe ?? false);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching post:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await commentService.getByPublication(Number(id));
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
            setIsLiked(!newIsLiked);
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

    const handleAddComment = async (parentId?: number, text?: string) => {
        const content = text || newComment;
        if (!content.trim()) return;
        
        setSendingComment(true);
        try {
            await commentService.create(Number(id), { text: content, parentId });
            setNewComment('');
            await fetchComments(); 
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSendingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm("¿Borrar este comentario?")) return;
        try {
            await commentService.delete(Number(id), commentId);
            fetchComments(); // Recargar para limpiar anidados
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePost = async () => {
        if(!post || !confirm("¿Estás seguro de eliminar esta publicación permanentemente?")) return;
        try {
            await publicationService.delete(post.id);
            navigate('/');
        } catch (error) {
            alert("No se pudo eliminar");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage errorObject={error} onRetry={fetchPost} />;
    if (!post) return <ErrorMessage message="Publicación no encontrada" />;

    const authorName = getUserName(post.author);
    const isOwner = currentUserId && Number(currentUserId) === post.author.userId;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                <div className="md:col-span-7 lg:col-span-8">
                    <div className="card bg-base-100 shadow-sm border border-base-300 rounded-md overflow-hidden relative group">
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
                        
                        <div className="absolute top-4 left-4 flex gap-2">
                            {post.machineGenerated && <span className="badge badge-neutral bg-black/50 border-0 text-white backdrop-blur-md">Generado por IA</span>}
                            {post.moderated && <span className="badge badge-error">Moderado</span>}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-5 lg:col-span-4 space-y-6">
                    <div className="card bg-base-100 shadow-sm border border-base-300 rounded-md p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
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

                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-square">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-md z-[1] w-40 p-1 shadow-lg border border-base-200">
                                    {isOwner ? (
                                        <>
                                            <li><button onClick={() => setShowEdit(true)}>Editar</button></li>
                                            <li><button onClick={handleDeletePost} className="text-error">Eliminar</button></li>
                                            {post.machineGenerated && (
                                                <li><button onClick={() => setShowAppeal(true)} className="text-warning">Apelar IA</button></li>
                                            )}
                                        </>
                                    ) : (
                                        <li><button onClick={() => setShowReport(true)} className="text-error">Reportar</button></li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {post.images.length > 0 && (
                            <p className="text-sm mb-4 whitespace-pre-wrap text-base-content/90">{post.description}</p>
                        )}

                        <PostTags tags={post.tags} pubType={post.pubType} />

                        {post.pubType !== 'TEXT' && !post.machineGenerated && (
                            <div className="text-xs text-success flex items-center gap-1 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                Marcado como contenido humano
                            </div>
                        )}

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

                    <div className="card bg-base-100 shadow-sm border border-base-300 rounded-md flex-1 flex flex-col max-h-[600px]">
                        <div className="p-4 border-b border-base-200 bg-base-100 rounded-t-md sticky top-0 z-10">
                            <h3 className="font-bold text-sm uppercase tracking-wide opacity-70">Comentarios ({comments.length})</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {comments.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-sm opacity-50">Aún no hay comentarios.</p>
                                    <p className="text-xs opacity-40">¡Di algo interesante!</p>
                                </div>
                            )}
                            
                            {comments.map((comment) => (
                                <CommentItem 
                                    key={comment.id}
                                    comment={comment}
                                    currentUserId={currentUserId}
                                    onDelete={handleDeleteComment}
                                    onReply={(parentId, text) => handleAddComment(parentId, text)}
                                />
                            ))}
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
                                    onClick={() => handleAddComment()}
                                    disabled={sendingComment || !newComment.trim()}
                                >
                                    {sendingComment ? <span className="loading loading-xs"></span> : 'Enviar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AppealModal 
                isOpen={showAppeal} 
                onClose={() => setShowAppeal(false)} 
                publicationId={post.id} 
            />
            
            <EditPostModal 
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
                post={post}
                onSuccess={fetchPost}
            />

            <ReportModal
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                publicationId={post.id}
            />
        </div>
    );
}