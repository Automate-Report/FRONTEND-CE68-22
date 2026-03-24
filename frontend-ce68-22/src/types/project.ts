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

export interface ChangeRole{
  email: string;
  role: string;
}

export interface RecentVulnerability {
  id: number;
  title: string;
  severity: string;
  cvss_score: number;
  affected_asset: string;
  detected_at: string; // เช่น "2 hours ago"
  sla_status: string; // เช่น "18h left" หรือ "OVERDUE"
  is_sla_breached: boolean;
}

export interface ProjectStat {
  total_assets: number;
  vulns_total: number;
  remediation_rate: number;
  severity_counts: { [key: string]: number };
}

export interface ProjectAssetOverview {
  id: number;
  name: string;
  vuln_count: number;
  max_severity: string;
}

export interface ProjectTrendData {
  day: string;
  date: string; 
  detected: number;
  fixed: number;
}

export interface ProjectOverviewResponse {
  project_info: ProjectSummary;
  stats: ProjectStat;
  top_risky_assets: ProjectAssetOverview[];
  trend: ProjectTrendData[];
  recent_vulnerabilities: RecentVulnerability[];
}