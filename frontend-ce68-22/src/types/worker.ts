export interface Worker {
  id: number;
  name: string;
  thread_number: number;
  current_load?: number;
  hostname: string;
  internal_ip: string;
  status: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  last_heartbeat: string;
}

export interface CreateWorkerPayload {
  name: string;
  thread_number: number;
}

export interface DownloadReponse {
  blob: Blob;
  filename: string | null;
}