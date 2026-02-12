export interface Asset {
  id: number;
  name: string;
  description?: string;
  project_id: number;
  credential_id?: number;
  target: string;
  type: string;
  updated_at: string;
}

export interface AssetNameAndId {
  name: string;
  id: number;
}

export interface CreateAssetPayload {
  name: string;
  description?: string;
  project_id: number;
  credential_id?: number;
  target: string;
  type: string;
}

export interface Credential {
  id: number;
  asset_id: number;
  username: string;
  password: string;
}

export interface CreateCredentialPayload {
  asset_id: number;
  username: string;
  password: string;
}