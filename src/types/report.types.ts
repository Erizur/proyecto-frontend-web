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