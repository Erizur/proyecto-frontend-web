import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../api/user.service";
import { useAuth } from "../../hooks/useAuth";
import type { PublicUser } from "../../types/user.types";
import LoadingSpinner from "../common/LoadingSpinner";

export default function HomeSidebar() {
    const { userId, username } = useAuth(); // Asegúrate de que useAuth retorna userId
    const [following, setFollowing] = useState<PublicUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchFollowing();
        }
    }, [userId]);

    const fetchFollowing = async () => {
        try {
            setLoading(true);
            // Obtenemos a quién sigue el usuario logueado
            const response = await userService.getFollowing(Number(userId), { page: 0, size: 5 });
            setFollowing(response.content);
        } catch (err) {
            console.error("Error cargando seguidos", err);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="space-y-6">
            <div className="card bg-base-100 shadow-sm border border-base-200 sticky top-24">
                <div className="card-body p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Siguiendo</h3>
                        {/* Enlace a la lista completa */}
                        <Link to={`/profile/${username}/following`} className="text-xs text-primary hover:underline">Ver todos</Link>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-4"><LoadingSpinner /></div>
                    ) : following.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm opacity-60 mb-2">Aún no sigues a nadie.</p>
                            <Link to="/explore" className="btn btn-xs btn-outline">Explorar</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {following.map((user) => (
                                <div key={user.userId} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="avatar">
                                            <div className="w-8 h-8 rounded-full bg-base-300">
                                                <img 
                                                    src={user.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                                    alt={user.displayName}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-sm truncate">{user.displayName}</span>
                                            <span className="text-xs opacity-60 truncate">@{user.username}</span>
                                        </div>
                                    </div>
                                    <Link to={`/profile/${user.username}`} className="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity">
                                        Ver
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Footer */}
            <div className="text-xs text-base-content/40 px-2 text-center">
                © 2025 artpond.ink & Artpond Staff.
            </div>
        </div>
    );
}