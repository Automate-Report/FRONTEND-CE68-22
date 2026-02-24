export interface Project {
  id: number;
  name: string;
  description: string | null;
  role: "owner" | "pentester" | "developer";
  created_at: string;
  updated_at: string;
}

interface TagSummary {
  name: string;
  text_color: string;
  bg_color: string
}

export interface ProjectSummary {
  id: number;
  name: string;
  description: string | null;
  role: "owner" | "pentester" | "developer";
  assets_cnt: number;
  vuln_cnt: number;
  tags?: TagSummary[];
  created_at: string;
  updated_at: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  tag_ids?: number[];
}

export interface Member {
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  joinned_at: string;
}