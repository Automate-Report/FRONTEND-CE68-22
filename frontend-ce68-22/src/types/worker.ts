export interface Worker {
  id: number;
  name: string;
  status: string;
  isActive: boolean;
  access_key_id: number;
}

export interface CreateWorkerPayload {
  name: string;
}