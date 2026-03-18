export type InviteRole = "developer" | "pentester";

export interface Invite {
    project_id: number;
    email: string;
    project_name: string;
    project_owner: string;
    role: InviteRole;
    status: "invited";
    invited_at: string;
} 