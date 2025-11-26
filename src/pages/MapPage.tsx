import { Link } from "react-router-dom";

export default function MapPage() {
    return (
        <div className="hero min-h-[60vh] bg-base-200 rounded-3xl my-6">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h1 className="text-3xl font-bold">Explora el Mapa</h1>
                    <p className="py-6 opacity-70">
                        Muy pronto podrás descubrir arte cerca de ti, museos y eventos en nuestro mapa interactivo.
                        ¡Estamos construyendo esta experiencia!
                    </p>
                    <Link to="/explore" className="btn btn-primary">
                        Volver a Explorar
                    </Link>
                </div>
            </div>
        </div>
    );
}