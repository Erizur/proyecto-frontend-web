import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../api/user.service';
import type { PublicUser } from '../types/user.types';
import UserAvatar from '../components/user/UserAvatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyStateProps';

export default function Connections() {
    const { username, type } = useParams<{ username: string, type: 'followers' | 'following' }>();
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        if (username) {
            // Primero obtenemos el ID del usuario por su username
            userService.getByUsername(username).then(u => {
                setUserId(u.userId);
            }).catch(console.error);
        }
    }, [username]);

    useEffect(() => {
        if (userId && type) {
            fetchConnections();
        }
    }, [userId, type]);

    const fetchConnections = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const params = { page: 0, size: 50 }; // Traemos los primeros 50
            const response = type === 'followers' 
                ? await userService.getFollowers(userId, params)
                : await userService.getFollowing(userId, params);
            setUsers(response.content);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl mx-auto py-6 px-4">
            <div className="flex items-center gap-4 mb-6">
                <Link to={`/profile/${username}`} className="btn btn-circle btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold capitalize">
                    {type === 'followers' ? 'Seguidores' : 'Siguiendo'}
                </h1>
            </div>

            {users.length > 0 ? (
                <div className="space-y-4">
                    {users.map(u => (
                        <div key={u.userId} className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <UserAvatar username={u.username} displayName={u.displayName} />
                                <div>
                                    <Link to={`/profile/${u.username}`} className="font-bold hover:underline">
                                        {u.displayName}
                                    </Link>
                                    <p className="text-xs opacity-60">@{u.username}</p>
                                </div>
                            </div>
                            {/* Aquí podrías poner un botón de Seguir/Dejar de seguir individual */}
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={`Nadie por aquí aún.`} />
            )}
        </div>
    );
}