export interface PenTestReport {
    id: number;
    projectId: number;
    fileName: string;
    fileSize: number;
    createdBy: string;
    createdAt: string;
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

export interface CreateReportPayload {
    reportName: string;
    assetIds?: number[];
    startDate: string;
    endDate: string;
}
    