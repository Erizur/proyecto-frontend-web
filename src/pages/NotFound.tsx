import { Link } from 'react-router-dom';

export default function NotFound() {
    return <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Página no encontrada</p>
            <Link to="/" className="btn btn-primary">
                Volver al Inicio
            </Link>
        </div>
    </>
}