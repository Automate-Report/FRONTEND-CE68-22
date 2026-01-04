export interface Asset {
  id: number;
  name: string;
  description?: string;
  project_id: number;
  target: string;
  type: string;
  updated_at: string;
}

export interface CreateAssetPayload {
  name: string;
  description?: string;
  project_id: number;
  target: string;
  type: string;
}

