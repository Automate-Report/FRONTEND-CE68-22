export interface Credential {
    id: number;
    username: string;
    password: string;
}

export interface CreateCredentialPayload {
    username: string;
    password: string;
}