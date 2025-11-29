import type { PublicUser } from "./user.types";
import type { Publication } from "./publication.types";
import type { ReportReason } from "./report.types";

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'DISMISSED';
export type AppealStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Report {
    id: number;
    reporter: PublicUser;
    publication?: Publication;
    reportedUser?: PublicUser;
    reason: ReportReason;
    details?: string;
    status: ReportStatus;
    createdAt: string;
    resolutionNotes?: string;
}

export interface Appeal {
    id: number;
    publication: Publication;
    author: PublicUser;
    justification: string;
    status: AppealStatus;
    createdAt: string;
    adminNotes?: string;
}

export interface FailedTask {
    id: number;
    publicationId: number;
    errorMessage: string;
    failedAt: string;
    osmId?: number; // Para Place tasks
    osmType?: string; // Para Place tasks
    pubType?: string; // Para AI tasks
    username?: string; // Para AI tasks
}