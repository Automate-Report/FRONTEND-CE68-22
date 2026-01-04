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