import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { notificationService } from "../../api/notification.service";
import ArtpondoText from "../common/ArtpondLogo";

export default function Navbar({ disableMenu = false }: { disableMenu?: boolean }) {
    const { userId, username, profilePictureUrl } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnread = async () => {
        if (userId) {
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadCount(count);
            } catch (e) {
                console.error("Error fetching unread notifications", e);
            }
        }
    };

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 60000);
        return () => clearInterval(interval);
    }, [userId]);

    const showAuthButtons = !userId && !disableMenu;
    const showUserControls = userId && !disableMenu;

    return <>
        <div className="navbar bg-base-100/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-base-200">
            
            <div className="navbar-start">
                 <Link to="/" className="h-auto min-h-0 px-2 hover:bg-transparent lg:hidden"> 
                    <img src="/artpondo_web.svg" alt="logo" className="h-8 w-8" />
                </Link>
            </div>

            <div className="navbar-center">
                <Link to="/" className="h-auto min-h-0 px-2 hover:bg-transparent hidden lg:flex items-center"> 
                    <img src="/artpondo_web.svg" alt="logo" className="h-8 w-8" />
                    <ArtpondoText
                            className="h-8 w-auto"
                            style={{
                                '--primary': 'var(--color-base-200)',
                                '--secondary': 'var(--color-base-content)'
                    
                            }}/>
                </Link>
                <span className="text-xl font-bold tracking-tight lg:hidden">Artpond</span>
            </div>

            <div className="navbar-end gap-2">
                {showAuthButtons && (
                    <>
                        <Link to="/auth/login" className="btn btn-ghost btn-sm rounded-md">Ingresar</Link>
                        <Link to="/auth/register" className="btn btn-primary btn-sm rounded-md shadow-sm">Crear cuenta</Link>
                    </>
                )}

                {showUserControls && (
                    <>
                         <Link to="/notifications" className="btn btn-ghost btn-circle" title="Notificaciones">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && <span className="badge badge-xs badge-error indicator-item"></span>}
                            </div>
                        </Link>
                        
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img alt="Perfil" src={profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-md z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200">
                                <li><Link to="/settings" className="rounded-sm">Configuración</Link></li>
                                <div className="divider my-1"></div>
                                <li><Link to="/auth/logout" className="text-error rounded-sm">Cerrar Sesión</Link></li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    </>
}