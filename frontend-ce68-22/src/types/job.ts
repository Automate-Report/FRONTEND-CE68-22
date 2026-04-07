export interface SummaryInfoByWorker {
    total_jobs: number;
    total_completed: number;
    total_failed: number;
    total_findings: number;
}

export interface GetJobByWorker{
    id: number;
    name: string;
    schedule_id: number;
    schedule_name: string;
    attack_type: string;
    status: string;
    started_at: string;
    finished_at?: string;
    vuln_count: number;
}