export interface Project {
  id: number;
  name: string;
  description: string | null;
  user_id: number;
  updated_at: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}