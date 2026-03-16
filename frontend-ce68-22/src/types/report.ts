export interface Report {
    id: number;
    name: string;
    asset: string;
    createdDate: string;
    createdBy: string;
    username: string;
    startDate: string;
    endDate: string;
    filePathPDF: string;
    filePathWord: string;
}

export interface CreateReportPayload {
    reportName: string;
    assetIds?: number[];
    startDate: string;
    endDate: string;
}
    