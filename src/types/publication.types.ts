export interface Author {
    userId: number;
    username: string;
    displayName: string;
    role: string;
    profilePictureUrl?: string;
}

export interface ImageResponse {
    id: number;
    url: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface Place {
    osmId: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export type PublicationType = 'PHOTOGRAPHY' | 'ILLUSTRATION' | 'TEXT';

export interface Publication {
    id: number;
    description: string;
    author: Author;

    heartsCount: number;
    commentsCount: number;
    likedByMe?: boolean;
    savedByMe?: boolean;
    moderated?: boolean;

    contentWarning: boolean;
    machineGenerated: boolean;
    manuallyVerified?: boolean;
    creationDate: string;
    images: ImageResponse[];
    tags: Tag[];
    place?: Place;
    pubType: PublicationType;
}

export interface CreatePublicationDto {
    description?: string;
    contentWarning: boolean;
    machineGenerated: boolean;
    pubType: PublicationType;
    tags?: string[];
    osmId?: number;
    osmType?: string;
    hideCleanImage?: boolean;
}