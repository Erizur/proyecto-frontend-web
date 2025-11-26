import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicationService } from '../api/publication.service';
import type { Publication } from '../types/publication.types';
import type { Comment } from '../types/comment.types';
import PostActions from '../components/post/PostActions';
import PostTags from '../components/post/PostTags';
import UserAvatar from '../components/user/UserAvatar';
import { commentService } from '../api/comment.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Publication | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            setError(null);
        } catch (err) {
            setError('Error al cargar la publicación');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await commentService.getByPublication(Number(id));
            setComments(data);
        } catch (err) {
            console.error('Error loading comments:', err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await commentService.create(Number(id), { text: newComment });
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchPost} />;
    if (!post) return <ErrorMessage message="Publicación no encontrada" />;

    return <>
        <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="bg-base-100 rounded-lg shadow-sm overflow-hidden">
                    {post.images.length > 0 && (
                        <img 
                            src={post.images[0].url}
                            alt={post.description}
                            className="w-full h-auto"
                        />
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                        {/* ✅ CORREGIDO */}
                        <UserAvatar 
                            username={post.author.username}
                            displayName={post.author.displayName}
                            profilePictureUrl={post.author.profilePictureUrl}
                        />
                        <div>
                            <Link 
                                to={`/profile/${post.author.username}`}
                                className="font-semibold hover:underline"
                            >
                                {post.author.displayName}
                            </Link>
                            <p className="text-sm opacity-60">@{post.author.username}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-sm">{post.description}</p>
                    </div>

                    {/* Tags */}
                    <PostTags tags={post.tags} pubType={post.pubType} />

                    {/* Actions */}
                    <PostActions
                        isLiked={false}
                        isSaved={false}
                        likes={0}
                        comments={comments.length}
                        onLike={() => {}}
                        onComment={() => {}}
                        onSave={() => {}}
                        onShare={() => {}}
                    />

                    {/* Comments Section */}
                    <div className="border-t border-base-300 pt-4">
                        <h3 className="font-bold mb-4">Comentarios</h3>

                        {/* Add Comment */}
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text"
                                className="input input-bordered flex-1"
                                placeholder="Escribe un comentario..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button 
                                className="btn btn-primary"
                                onClick={handleAddComment}
                            >
                                Enviar
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    {/* ✅ CORREGIDO TAMBIÉN EN COMENTARIOS */}
                                    <UserAvatar 
                                        username={comment.author.username}
                                        displayName={comment.author.displayName}
                                        profilePictureUrl={comment.author.profilePictureUrl}
                                        size="sm"
                                    />
                                    <div className="flex-1">
                                        {/* ... */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}