export interface Worker {
  id: number;
  name: string;
  hostname: string;
  status: string;
  isActive: boolean;
}

export interface CreateWorkerPayload {
  name: string;
}

export interface DownloadReponse {
  blob: Blob;
  filename: string | null;
}