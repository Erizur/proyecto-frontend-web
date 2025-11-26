import { Link } from "react-router-dom";
import type { Publication } from "../../types/publication.types";
import CompactPostCard from "../post/CompactPostCard";

export default function HorizontalFeed({ posts }: { posts: Publication[] }) {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 mb-6 snap-x scrollbar-hide">
            {posts.slice(0, 10).map((post) => (
                <div key={post.id} className="snap-center shrink-0">
                    <CompactPostCard 
                        post={post} 
                        className="w-64 h-80" // Definimos el tamaño aquí para el slider
                    />
                </div>
            ))}
            
            {/* Tarjeta final de "Ver más" */}
            <div className="snap-center shrink-0 w-32 h-80 flex items-center justify-center rounded-xl bg-base-200 cursor-pointer hover:bg-base-300 transition-colors">
                <Link to="/explore" className="text-center p-4 w-full h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-base-100 flex items-center justify-center mb-2 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold">Ver más</span>
                </Link>
            </div>
        </div>
    );
}