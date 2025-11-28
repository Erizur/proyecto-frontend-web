export type ReportReason = 
    | 'SPAM' 
    | 'INAPPROPRIATE_CONTENT' 
    | 'HARASSMENT' 
    | 'COPYRIGHT' 
    | 'UNMARKED_AI' 
    | 'OTHER';

export interface CreateReportDto {
    publicationId?: number;
    reportedUserId?: number;
    reason: ReportReason;
    details?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface Pageable {
    page: number;
    size: number;
    sort?: string[];
}