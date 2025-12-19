export interface Worker {
  id: number;
  name: string;
  status: string;
}

export interface CreateWorkerPayload {
  name: string;
}