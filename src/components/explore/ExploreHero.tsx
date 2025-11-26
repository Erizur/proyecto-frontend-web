interface ExploreHeroProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function ExploreHero({ searchQuery, setSearchQuery }: ExploreHeroProps) {
    return (
        <div className="relative bg-base-200 py-12 px-4 mb-8 text-center overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Explora la <span className="text-primary">Comunidad</span>
                </h1>
                <p className="text-lg opacity-70">
                    Encuentra inspiración, ilustraciones y discusiones interesantes.
                </p>
                
                {/* Barra de Búsqueda Grande */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <input 
                        type="text"
                        className="relative input input-lg w-full rounded-full shadow-lg pl-12 pr-4 bg-base-100 border-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Buscar por #tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Tags sugeridos */}
                {!searchQuery && (
                    <div className="flex flex-wrap justify-center gap-2 text-sm opacity-80">
                        <span>Tendencias:</span>
                        <button onClick={() => setSearchQuery('digitalart')} className="hover:text-primary underline cursor-pointer">#digitalart</button>
                        <button onClick={() => setSearchQuery('sketch')} className="hover:text-primary underline cursor-pointer">#sketch</button>
                        <button onClick={() => setSearchQuery('photography')} className="hover:text-primary underline cursor-pointer">#photography</button>
                    </div>
                )}
            </div>
        </div>
    );
}