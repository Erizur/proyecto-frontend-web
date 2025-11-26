import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { publicationService } from '../api/publication.service';
import type { PublicationType } from '../types/publication.types';

// Componentes modulares
import ExploreHero from '../components/explore/ExploreHero';
import ExploreToolbar from '../components/explore/ExploreToolbar';
import ExploreResults from '../components/explore/ExploreResults';

export default function Explore() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlTag = searchParams.get('tag');

    // Estados
    const [searchQuery, setSearchQuery] = useState(urlTag || '');
    const [debouncedSearch, setDebouncedSearch] = useState(urlTag || '');
    const [selectedType, setSelectedType] = useState<PublicationType | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<string>('creationDate,desc');

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery) setSearchParams({ tag: searchQuery });
            else setSearchParams({});
        }, 600);
        return () => clearTimeout(timer);
    }, [searchQuery, setSearchParams]);

    // Data Fetching
    const { posts, loading, error, hasMore, loadMore, refresh } = usePosts({
        pubType: selectedType,
        tagName: debouncedSearch || undefined,
        sort: sortOrder
    });

    const handleLike = async (postId: number) => {
         try { await publicationService.toggleHeart(postId); } catch (e) { console.error(e); }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedType(undefined);
    };

    return (
        <div className="min-h-screen bg-base-100">
            <ExploreHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <div className="max-w-4xl mx-auto px-4 pb-10">
                <ExploreToolbar 
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />

                <ExploreResults 
                    posts={posts}
                    loading={loading}
                    error={error}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    refresh={refresh}
                    onLike={handleLike}
                    onClearSearch={handleClearSearch}
                />
            </div>
        </div>
    );
}