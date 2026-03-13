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

export interface Report {
    id: number;
    name: string;
    asset: string;
    date: string;
    created_by: string;
    startDate: string;
    endDate: string;
}
    