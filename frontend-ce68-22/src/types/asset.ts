export interface Asset {
  id: number;
  name: string;
  description?: string;
  project_id: number;
  credential_id?: number;
  target: string;
  type: string;
}

export interface CreateAssetPayload {
  name: string;
  description?: string;
  project_id: number;
  credential_id?: number;
  target: string;
  type: string;
}

