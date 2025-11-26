import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Dock() {
    const { userId, username } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path 
        ? "text-primary scale-110" 
        : "text-base-content/60 hover:text-primary hover:scale-105";

    return (
        <div className={`
            fixed z-50 
            /* Móvil: Abajo Centrado */
            bottom-6 left-1/2 -translate-x-1/2 
            /* Escritorio: Izquierda Centrado Verticalmente */
            lg:bottom-auto lg:top-1/2 lg:left-6 lg:translate-x-0 lg:-translate-y-1/2
        `}>
            <div className={`
                flex items-center gap-2 
                /* Móvil: Horizontal */
                flex-row px-6 py-3
                /* Escritorio: Vertical */
                lg:flex-col lg:px-3 lg:py-6
                
                bg-base-100/80 backdrop-blur-xl border border-base-200 
                rounded-full shadow-2xl transition-all duration-300
            `}>
                
                {/* Inicio */}
                <Link to="/" className={`p-2 transition-all duration-300 ${isActive("/")}`} title="Inicio">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </Link>

                {/* Explorar */}
                <Link to="/explore" className={`p-2 transition-all duration-300 ${isActive("/explore")}`} title="Explorar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </Link>

                {/* Mapa */}
                <Link to="/map" className={`p-2 transition-all duration-300 ${isActive("/map")}`} title="Mapa">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </Link>

                {/* Separador: Vertical en móvil, Horizontal en escritorio */}
                <div className="bg-base-300 w-px h-6 lg:w-6 lg:h-px mx-1 lg:my-1"></div>

                {/* Perfil / Login */}
                {userId ? (
                    <Link to={`/profile/${username}`} className={`p-2 transition-all duration-300 ${isActive(`/profile/${username}`)}`} title="Mi Perfil">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>
                ) : (
                    <Link to="/auth/login" className={`p-2 transition-all duration-300 ${isActive("/auth/login")}`} title="Ingresar">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    );
}