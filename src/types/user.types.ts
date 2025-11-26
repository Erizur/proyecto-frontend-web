
// PublicUserDto: Información ligera
export interface PublicUser {
    userId: number;
    username: string;
    displayName: string;
    role: string;
    profilePictureUrl?: string; // Añadido según api-docs
}

// UserDetailsDto: Información completa con contadores
export interface UserDetails extends PublicUser {
    description?: string;
    followersCount: number; //
    followingCount: number; //
    email?: string;
    showExplicit?: boolean;
}

export interface UpdateUserDto {
    description?: string;
    email?: string;
    showExplicit?: boolean;
}