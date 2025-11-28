
// PublicUserDto: Información ligera
export interface PublicUser {
    userId: number;
    username: string;
    displayName: string;
    role: string;
    profilePictureUrl?: string; 
}

export interface UserDetails extends PublicUser {
    description?: string;
    followersCount: number;
    followingCount: number;
}

export interface UserResponse extends UserDetails {
    email?: string;
    showExplicit?: boolean;
}

export interface UpdateUserDto {
    username?: string;
    displayName?: string;
    description?: string;
    email?: string;
    showExplicit?: boolean;
}