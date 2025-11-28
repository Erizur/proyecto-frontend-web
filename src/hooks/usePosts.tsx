import { useState, useEffect, useCallback, useRef } from 'react';
import { publicationService } from '../api/publication.service';
import { userService } from '../api/user.service';
import type { Publication, PublicationType } from '../types/publication.types';
import type { AxiosError } from 'axios';

export interface UsePostsOptions {
    pubType?: PublicationType;
    userId?: number | null;
    onlyFollowing?: boolean;
    onlySaved?: boolean;
    tagName?: string;
    sort?: string;
}

export function usePosts(options: UsePostsOptions = {}) {
    const { pubType, userId, onlyFollowing, onlySaved, tagName, sort } = options;
    
    const [posts, setPosts] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const currentPageRef = useRef(0);

    const fetchPosts = useCallback(async (pageNum: number, isNewFilter: boolean = false) => {
        if (userId === null && !tagName && !onlySaved && !onlyFollowing) {
            setLoading(true);
            return;
        }

        try {
            setLoading(true);
            let response;
            
            const params: any = { 
                page: pageNum, 
                size: 10,
                pubType: pubType,
            };

            if (sort) {
                params.sort = [sort];
            }

            if (tagName) {
                response = await publicationService.getByTag(tagName, params).catch((err: AxiosError) => {
                    if (err.status == 404) {
                        return {
                            success: true,
                            message: 'Empty data. El tag no existe',
                            content: []
                        };
                    }
                });
            } else if (onlySaved) {
                response = await userService.getSavedPosts(params);
            } else if (onlyFollowing) {
                response = await publicationService.getFeed(params);
            } else if (userId !== undefined && userId !== null) {
                response = await publicationService.getByUserId(userId, params);
            } else {
                response = await publicationService.getAll(params);
            }

            if (!response || !response.content) {
                throw new Error('Respuesta inválida del servidor');
            }

            if (pageNum === 0 || isNewFilter) {
                setPosts(response.content);
            } else {
                setPosts(prev => [...prev, ...response.content]);
            }

            currentPageRef.current = pageNum;
            setHasMore(!response.last);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al cargar publicaciones');
        } finally {
            setLoading(false);
        }
    }, [pubType, userId, onlyFollowing, onlySaved, tagName, sort]);

    useEffect(() => {
        currentPageRef.current = 0;
        fetchPosts(0, true);
    }, [pubType, userId, onlyFollowing, onlySaved, tagName, sort, fetchPosts]); 

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = currentPageRef.current + 1;
            fetchPosts(nextPage);
        }
    };

    const refresh = () => {
        currentPageRef.current = 0;
        fetchPosts(0);
    };

    return { posts, loading, error, hasMore, loadMore, refresh, setPosts }; 
}