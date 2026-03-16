export interface Report {
    id: number;
    name: string;
    asset: string;
    created_date: string;
    created_by: string;
    username: string;
    start_date: string;
    end_date: string;
    file_path_pdf: string;
    file_path_word: string;
}

export interface CreateReportPayload {
    reportName: string;
    assetIds?: number[];
    startDate: string;
    endDate: string;
}
    