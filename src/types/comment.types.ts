import type { Author } from "./publication.types";

export interface Comment {
    id: number;
    text: string;
    author: Author;
    createdAt: string;
    replies: Comment[];
}

export interface CreateCommentDto {
    text: string;
    parentId?: number;
}