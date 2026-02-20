"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Stack, Divider, Chip } from "@mui/material";
import { 
  Language as AssetIcon, 
  BugReport as BugIcon, 
  CheckCircle as FixedIcon, 
  Schedule as PendingIcon,
  PlayCircleOutline as RunningIcon,
  CheckCircleOutline as CompletedIcon,
  TrendingUp as TrendUpIcon
} from "@mui/icons-material";

import { useProject } from "@/src/hooks/project/use-project";
import { useTags } from "@/src/hooks/project/use-Tags";
import { Tag } from "@/src/types/tag";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectsOverviewPage({ params }: PageProps) {
  const resolveParams = use(params);
  const projectId = parseInt(resolveParams.id);

  const { data: project, isLoading, isError } = useProject(projectId);
  const { data: tags } = useTags(projectId);

  if (isLoading) return <div className="p-8 text-[#8FFF9C]">Loading...</div>;
  if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project.name, href: undefined }
  ];

  return (
    <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl p-6 font-sans">
      
      {/* Section 1: Breadcrumbs & Tags */}
      <Box mb={4}>
        <GenericBreadcrums items={breadcrumbItems} />
        {tags && tags.length > 0 && (
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {tags.map((tag: Tag) => (
              <Chip 
                key={tag.id} 
                label={tag.name} 
                variant="outlined" 
                sx={{ color: "#8FFF9C", borderColor: "#8FFF9C", fontWeight: "bold" }} 
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Section 2: Project Header & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <Typography variant="h3" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 2 }}>
            What's this project about?
          </Typography>
          <Box sx={{ bgcolor: "#1E2429", p: 4, borderRadius: "20px", border: "1px solid #404F57" }}>
            <Typography variant="body1" sx={{ color: "#E6F0E6", lineHeight: 1.8 }}>
              {project.description || "No description provided for this project."}
            </Typography>
          </Box>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="flex flex-col gap-4">
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#8FFF9C" }}>Asset Overview</Typography>
          <div className="grid grid-cols-2 gap-4">
            <Box sx={{ bgcolor: "#1E2429", p: 3, borderRadius: "16px", border: "1px solid #404F57", textAlign: 'center' }}>
              <AssetIcon sx={{ color: "#404F57", mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 900 }}>{project.assets_cnt || 0}</Typography>
              <Typography variant="caption" sx={{ color: "#9AA6A8", fontWeight: "bold" }}>TOTAL ASSETS</Typography>
            </Box>
            <Box sx={{ bgcolor: "#1E2429", p: 3, borderRadius: "16px", border: "1px solid #404F57", textAlign: 'center' }}>
              <BugIcon sx={{ color: "#FF3B30", mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#FF3B30" }}>{project.vuln_cnt || 0}</Typography>
              <Typography variant="caption" sx={{ color: "#9AA6A8", fontWeight: "bold" }}>TOTAL VULNS</Typography>
            </Box>
          </div>
        </div>
      </div>

      {/* Section 3: Main Dashboard Metrics */}
      <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 4 }}>Security Dashboard</Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Vulnerabilities", value: 10, color: "#FBFBFB", icon: <BugIcon /> },
          { label: "Critical Issues", value: 2, color: "#FF3B30", icon: <BugIcon /> },
          { label: "Fixed Issues", value: 15, color: "#34C759", icon: <FixedIcon /> },
          { label: "Pending Scans", value: 1, color: "#FFCC00", icon: <PendingIcon /> },
        ].map((item, i) => (
          <Box key={i} sx={{ bgcolor: "#1E2429", p: 3, borderRadius: "16px", border: "1px solid #404F57" }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: item.color }}>{item.value}</Typography>
              <Box sx={{ color: "#404F57" }}>{item.icon}</Box>
            </Stack>
            <Typography variant="caption" sx={{ color: "#9AA6A8", fontWeight: 800, textTransform: 'uppercase' }}>{item.label}</Typography>
          </Box>
        ))}
      </div>

      {/* Section 4: Charts & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* NEW: Vulnerability Trend (Linear Simulation) */}
        <Box className="lg:col-span-4 bg-[#1E2429] p-6 rounded-2xl border border-[#404F57]">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Vulnerability Trend</Typography>
            <TrendUpIcon sx={{ color: "#FF3B30", fontSize: 20 }} />
          </Stack>
          {/* Mock Graph */}
          <div className="h-40 w-full flex items-end gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-[#8FFF9C20] to-[#8FFF9C] rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
          <Stack direction="row" justifyContent="space-between" mt={2} px={1}>
             <Typography variant="caption" sx={{ color: "#404F57" }}>Mon</Typography>
             <Typography variant="caption" sx={{ color: "#404F57" }}>Sun</Typography>
          </Stack>
        </Box>

        {/* Severity Distribution */}
        <Box className="lg:col-span-4 bg-[#1E2429] p-6 rounded-2xl border border-[#404F57]">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 4 }}>Severity Distribution</Typography>
          <div className="flex flex-col gap-4">
            {[
              { label: "Critical", value: "15%", color: "#FF3B30" },
              { label: "High", value: "25%", color: "#FF9500" },
              { label: "Medium", value: "40%", color: "#FFCC00" },
              { label: "Low", value: "20%", color: "#007AFF" },
            ].map((d, i) => (
              <div key={i}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>{d.label}</Typography>
                  <Typography variant="caption" sx={{ color: d.color, fontWeight: "bold" }}>{d.value}</Typography>
                </Stack>
                <div className="w-full h-2 bg-[#0D1014] rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: d.value, backgroundColor: d.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </Box>

        {/* Recent Scans Table (ปรับเป็น 4/12 เพื่อให้เรียงกัน 3 กล่องในหน้าจอใหญ่) */}
        <Box className="lg:col-span-4 bg-[#1E2429] rounded-2xl border border-[#404F57] overflow-hidden">
          <Box p={3} borderBottom="1px solid #404F57">
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Quick Logs</Typography>
          </Box>
          <div className="p-4 space-y-4">
            {[
              { name: "Full Audit", status: "Done", color: "#34C759" },
              { name: "API Scan", status: "Running", color: "#007AFF" },
              { name: "Asset Discovery", status: "Done", color: "#34C759" },
            ].map((log, i) => (
              <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{log.name}</Typography>
                <Chip label={log.status} size="small" sx={{ bgcolor: `${log.color}20`, color: log.color, fontWeight: "bold", fontSize: "10px" }} />
              </Stack>
            ))}
          </div>
        </Box>
      </div>

      {/* Section 5: Full Recent Scans Table */}
      <Box className="bg-[#1E2429] rounded-2xl border border-[#404F57] overflow-hidden">
        <Box p={3} borderBottom="1px solid #404F57">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Detailed Recent Scans</Typography>
        </Box>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#161B1F] text-[#9AA6A8] text-[12px] uppercase">
              <tr>
                <th className="px-6 py-4">Scan Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Findings</th>
                <th className="px-6 py-4">Started At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2F39]">
              {[
                { name: "Full Web Audit", status: "Completed", icon: <CompletedIcon />, color: "#34C759", findings: 12, date: "20 Feb 2026" },
                { name: "Daily API Check", status: "Running", icon: <RunningIcon />, color: "#007AFF", findings: 3, date: "Running Now" },
                { name: "Weekly Asset Scan", status: "Pending", icon: <PendingIcon />, color: "#FFCC00", findings: 0, date: "Scheduled" },
              ].map((scan, i) => (
                <tr key={i} className="hover:bg-[#1A1E23] transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px]">{scan.name}</td>
                  <td className="px-6 py-4">
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: scan.color }}>
                      {scan.icon}
                      <Typography variant="caption" sx={{ fontWeight: "bold" }}>{scan.status}</Typography>
                    </Stack>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{scan.findings} issues</Typography>
                  </td>
                  <td className="px-6 py-4 text-[#9AA6A8] text-[12px]">{scan.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>

    </div>
  );
}