export interface Worker {
  id: number;
  name: string;
  thread_number: number;
  hostname: string;
  status: string;
  isActive: boolean;
}

export interface CreateWorkerPayload {
  name: string;
  thread_number: number;
}

export interface DownloadReponse {
  blob: Blob;
  filename: string | null;
}