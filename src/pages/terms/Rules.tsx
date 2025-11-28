import { Link } from 'react-router-dom';
import { ArtpondoLogo } from '../../components/common/ArtpondLogo';

export default function Rules() {
    return <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <ArtpondoLogo className='fill-primary w-auto h-32'></ArtpondoLogo>
            <h2 className="text-6xl font-bold mb-4">Content submission rules</h2>
            <p className="text-xl mb-6">Página no encontrada</p>
            <Link to="/" className="btn btn-primary">
                Volver al Inicio
            </Link>
        </div>
    </>
}