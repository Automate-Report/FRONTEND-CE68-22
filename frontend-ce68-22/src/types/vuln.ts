export interface SummaryStatusVlun {
    total: number;
    open_cnt: number;
    tp_cnt: number;
    in_progress_cnt: number;
    fixed_cnt: number;
}

interface ReProduceInfo {
    target: string;
    method: string;
    payload: string;
    curl_command: string;
}

interface Evidence {
    screenshot: string;
    response_details: string;
}

interface VulnDates {
    first_seen: string;
    last_seen: string;
}

interface CVSSDetails {
    score: Float16Array;
    vector: string;
    version: string;
}
export interface VulnIssue {
    id: number;
    title: string;
    asset_id: number;
    asset_name: string;
    assigned_to?: string;
    verified_by?: string;
    severity: string;
    status: string;
    occurrance_count: number;
    cvss_details: CVSSDetails;
    reproduce_info: ReProduceInfo;
    dates: VulnDates;
    recommendation: string;
}