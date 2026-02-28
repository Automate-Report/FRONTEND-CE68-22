export interface Worker {
  id: number;
  name: string;
  thread_number: number;
  current_load?: number;
  hostname: string;
  internal_ip: string;
  access_key_id: number;
  status: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  last_heartbeat: string;
  project_id: number;
  owner?: string;
  owner_name?: string;
}

export interface CreateWorkerPayload {
  name: string;
  thread_number: number;
}

export interface DownloadReponse {
  blob: Blob;
  filename: string | null;
}