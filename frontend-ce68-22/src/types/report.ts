export interface PenTestReport {
    id: number;
    project_id: number;
    asset_id?: number;
    asset_name: string;
    file_name: string;
    file_size: number;
    file_type: string;
    created_by: string;
    created_at: string;
}

export interface CreateReportPayload {
    report_name: string;
    asset_ids?: number[]; 
}
    