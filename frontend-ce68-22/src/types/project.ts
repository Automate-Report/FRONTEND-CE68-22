export interface Project {
  id: number;
  name: string;
  description: string | null;
  role: "owner" | "pentester" | "developer";
  created_at: string;
  updated_at: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  tag_ids?: number[];
}