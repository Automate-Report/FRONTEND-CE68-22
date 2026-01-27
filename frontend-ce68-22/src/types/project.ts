export interface Project {
  id: number;
  name: string;
  description: string | null;
  updated_at: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  tag_ids?: number[];
}