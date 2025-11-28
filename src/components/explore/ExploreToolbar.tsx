import type { PublicationType } from "../../types/publication.types";

interface ExploreToolbarProps {
    selectedType: PublicationType | undefined;
    setSelectedType: (type: PublicationType | undefined) => void;
    sortOrder: string;
    setSortOrder: (order: string) => void;
}

export default function ExploreToolbar({ selectedType, setSelectedType, sortOrder, setSortOrder }: ExploreToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-base-100 p-2 rounded-xl sticky top-20 z-30 backdrop-blur-md bg-opacity-90 shadow-sm border border-base-200">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
                <button 
                    className={`btn btn-sm rounded-full ${!selectedType ? 'btn-neutral' : 'btn-ghost'}`}
                    onClick={() => setSelectedType(undefined)}
                >
                    Todo
                </button>
                <button 
                    className={`btn btn-sm rounded-full ${selectedType === 'ILLUSTRATION' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setSelectedType('ILLUSTRATION')}
                >
                    Ilustraciones
                </button>
                <button 
                    className={`btn btn-sm rounded-full ${selectedType === 'PHOTOGRAPHY' ? 'btn-secondary' : 'btn-ghost'}`}
                    onClick={() => setSelectedType('PHOTOGRAPHY')}
                >
                    Fotografía
                </button>
                <button 
                    className={`btn btn-sm rounded-full ${selectedType === 'TEXT' ? 'btn-accent' : 'btn-ghost'}`}
                    onClick={() => setSelectedType('TEXT')}
                >
                    Posts de comunidad
                </button>
            </div>

            <select 
                className="select select-sm select-bordered rounded-full w-full sm:w-auto"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="creationDate,desc">Más Recientes</option>
                <option value="creationDate,asc">Más Antiguos</option>
            </select>
        </div>
    );
}