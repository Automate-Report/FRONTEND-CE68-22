export interface PenTestReport {
    id: number;
    job_id: number;
    job_name: string;
    schedule_id: number;
    schedule_name: string;
    file_name: string;
    file_path: string;
    file_size: string;
    created_at: string;
}

export interface CreateReportPayload {
    report_name: string;
    asset_ids?: number[]; 
}
    