import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { notificationService } from "../../api/notification.service";

export default function Navbar({ disableMenu = false }: { disableMenu?: boolean }) {
    // ✅ CORRECCIÓN: Extraemos las propiedades correctas del hook
    const { userId, username, profilePictureUrl } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // ✅ CORRECCIÓN: Solo buscamos notificaciones si hay usuario y NO estamos en login
        if (userId && !disableMenu) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 60000);
            return () => clearInterval(interval);
        } else {
            setUnreadCount(0);
        }
    }, [userId, disableMenu]);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const showUserControls = userId && !disableMenu;

    return <>
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                {!disableMenu && (
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/explore">Explorar</Link></li>
                            {userId && <li><Link to={`/profile/${username}/following`}>Siguiendo</Link></li>}
                            {userId && <li><Link to="/settings">Configuración</Link></li>}
                            {userId && <li><Link to="/auth/logout">Cerrar Sesión</Link></li>}
                        </ul>
                    </div>
                )}
            </div>

            <div className="navbar-center">
                <Link to="/" className="h-auto min-h-0"> 
                    <img src="/artpondo.svg" alt="Artpond" className="h-10 w-auto" />
                </Link>
            </div>

            <div className="navbar-end">
                {showUserControls && (
                    <>
                        <Link to="/explore" className="btn btn-ghost btn-circle" title="Explorar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Link>

                        <Link to={`/profile/${username}/following`} className="btn btn-ghost btn-circle" title="Gente que sigo">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </Link>

                        <Link to="/notifications" className="btn btn-ghost btn-circle" title="Notificaciones">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="badge badge-xs badge-error indicator-item"></span>
                                )}
                            </div>
                        </Link>

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img 
                                        alt="Profile" 
                                        src={profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                                    />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li>
                                    <Link to={`/profile/${username}`} className="justify-between">
                                        Mi Perfil
                                        <span className="badge">@{username}</span>
                                    </Link>
                                </li>
                                <li><Link to="/settings">Configuración</Link></li>
                                <li><Link to="/auth/logout">Cerrar Sesión</Link></li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    </>
}