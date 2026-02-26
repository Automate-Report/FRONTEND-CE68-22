"use client";

import { use, useState } from "react";
import { Box, Typography, Stack, Divider, Chip, Paper, CircularProgress } from "@mui/material";
import { 
  BugReport as BugIcon, 
  Language as AssetIcon,
  CheckCircle as FixedIcon,
  Timeline as TrendIcon,
  ErrorOutline as CriticalIcon,
  History as RecentIcon
} from "@mui/icons-material";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { useProject } from "@/src/hooks/project/use-project";
import { useTags } from "@/src/hooks/project/use-Tags";
import { useProjectOverview } from "@/src/hooks/project/use-projectOverview";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

interface PageProps { params: Promise<{ id: string }> }

export default function ProjectsOverviewPage({ params }: PageProps) {
  const resolveParams = use(params);
  const projectId = parseInt(resolveParams.id);

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: tags } = useTags(projectId);
  const { data: overview, isLoading: isOverviewLoading } = useProjectOverview(projectId);

  if (isProjectLoading || isOverviewLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: "#0D1014" }}>
      <CircularProgress sx={{ color: "#8FFF9C" }} />
    </Box>
  );

  const stats = overview?.stats;
  const trendData = overview?.trend || [];
  const topAssets = overview?.top_risky_assets || [];
  const recentVulns = overview?.recent_vulnerabilities || [];

  const severityChartData = stats ? [
    { name: 'Critical', value: stats.severity_counts.critical || 0, color: '#FE3B46' },
    { name: 'High', value: stats.severity_counts.high || 0, color: '#FF9500' },
    { name: 'Medium', value: stats.severity_counts.medium || 0, color: '#FFCC00' },
    { name: 'Low', value: stats.severity_counts.low || 0, color: '#007AFF' },
  ].filter(d => d.value > 0) : [];

  return (
    <Box sx={{ bgcolor: "#0D1014", minHeight: "100vh", p: { xs: 2, md: 4 }, color: "#E6F0E6" }}>
      <GenericBreadcrums items={[{ label: "Home", href: "/main" }, { label: project?.name || "Project", href: undefined }]} />

      {/* --- HEADER --- */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={2} mb={6} mt={2}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: "#FBFBFB", letterSpacing: "-0.05em" }}>
            {project?.name} <span style={{ color: "#404F57", fontSize: "24px" }}>#Overview</span>
          </Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            {tags?.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" sx={{ bgcolor: "#8FFF9C15", color: "#8FFF9C", border: "1px solid #8FFF9C40", fontWeight: 800, mb: 1 }} />
            ))}
          </Stack>
        </Box>
        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, letterSpacing: 1 }}>PROJECT RISK RATING</Typography>
          <Typography variant="h2" sx={{ color: (stats?.severity_counts.critical || 0) > 0 ? "#FE3B46" : "#8FFF9C", fontWeight: 900, lineHeight: 1 }}>
            {(stats?.severity_counts.critical || 0) > 0 ? "D" : "A"}
          </Typography>
        </Box>
      </Stack>

      {/* --- SECTION 1: TOP METRICS (Flexbox Row) --- */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={6}>
        {[
          { label: "Total Assets", value: stats?.total_assets, icon: <AssetIcon />, color: "#FBFBFB" },
          { label: "Open Vulns", value: stats?.vulns_total, icon: <BugIcon />, color: "#FE3B46" },
          { label: "Critical Issues", value: stats?.severity_counts.critical, icon: <CriticalIcon />, color: "#FE3B46" },
          { label: "Remediation Rate", value: `${stats?.remediation_rate}`, icon: <FixedIcon />, color: "#8FFF9C" },
        ].map((item, i) => (
          <Paper key={i} sx={{ p: 3, bgcolor: "#161B1F", border: "1px solid #2D2F39", borderRadius: "16px", flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: item.color }}>{item.value ?? 0}</Typography>
                <Typography variant="caption" sx={{ color: "#9AA6A8", fontWeight: 800, textTransform: 'uppercase' }}>{item.label}</Typography>
              </Box>
              <Box sx={{ color: "#404F57" }}>{item.icon}</Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* --- SECTION 2: VISUALIZATION (Flexbox Row) --- */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} mb={6}>
        {/* Discovery Trend */}
        <Paper sx={{ p: 4, bgcolor: "#161B1F", border: "1px solid #2D2F39", borderRadius: "20px", height: "400px", flex: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={4}>
            <TrendIcon sx={{ color: "#8FFF9C" }} />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Vulnerability Pipeline (7 Days)</Typography>
          </Stack>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FE3B46" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FE3B46" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2F39" vertical={false} />
              <XAxis dataKey="day" stroke="#404F57" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#404F57" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2429', border: '1px solid #2D2F39', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="detected" name="New Vulns" stroke="#FE3B46" fillOpacity={1} fill="url(#colorDetected)" strokeWidth={3} />
              <Area type="monotone" dataKey="fixed" name="Fixed" stroke="#8FFF9C" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Severity Distribution */}
        <Paper sx={{ p: 4, bgcolor: "#161B1F", border: "1px solid #2D2F39", borderRadius: "20px", height: "400px", flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Risk Distribution</Typography>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie data={severityChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {severityChartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2} mt={2}>
            {severityChartData.map((d) => (
              <Stack key={d.name} direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: d.color }} />
                <Typography variant="caption" sx={{ color: "#9AA6A8", fontWeight: 700 }}>{d.name}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Stack>

      {/* --- SECTION 3: RECENT VULNS & HIGH RISK ASSETS (Flexbox Row) --- */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
        {/* Recent Vulnerabilities */}
        <Paper sx={{ bgcolor: "#161B1F", border: "1px solid #2D2F39", borderRadius: "20px", overflow: "hidden", flex: 2 }}>
          <Box p={3} borderBottom="1px solid #2D2F39" display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <RecentIcon sx={{ color: "#8FFF9C", fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Recent Vulnerabilities</Typography>
            </Stack>
            <Chip label="Real-time" size="small" variant="outlined" sx={{ color: "#8FFF9C", borderColor: "#8FFF9C", fontSize: '10px' }} />
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table className="w-full text-left">
              <thead className="bg-[#0D1014] text-[#404F57] text-[11px] uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Title / CVE</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">SLA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2F39]">
                {recentVulns.map((vuln) => (
                  <tr key={vuln.id} className="hover:bg-[#FFFFFF05] transition-colors">
                    <td className="px-6 py-4">
                      <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{vuln.title}</Typography>
                      <Typography variant="caption" sx={{ color: "#404F57" }}>{vuln.cve}</Typography>
                    </td>
                    <td className="px-6 py-4 font-mono text-[12px] text-[#9AA6A8]">{vuln.affected_asset}</td>
                    <td className="px-6 py-4">
                       <Chip label={`${vuln.severity} (${vuln.cvss_score})`} size="small" 
                          sx={{ 
                              bgcolor: `${vuln.cvss_score >= 9 ? '#FE3B46' : vuln.cvss_score >= 7 ? '#FF9500' : '#FFCC00'}20`, 
                              color: vuln.cvss_score >= 9 ? '#FE3B46' : vuln.cvss_score >= 7 ? '#FF9500' : '#FFCC00',
                              fontWeight: 900, fontSize: '10px'
                          }} 
                       />
                    </td>
                    <td className="px-6 py-4">
                      <Typography sx={{ color: vuln.is_sla_breached ? "#FE3B46" : "#8FFF9C", fontWeight: 800, fontSize: '12px' }}>
                        {vuln.sla_status}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>

        {/* Top Risky Assets */}
        <Paper sx={{ bgcolor: "#161B1F", border: "1px solid #2D2F39", borderRadius: "20px", overflow: "hidden", flex: 1 }}>
          <Box p={3} borderBottom="1px solid #2D2F39">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Top Risky Assets</Typography>
          </Box>
          <Stack divider={<Divider sx={{ borderColor: "#2D2F39" }} />}>
            {topAssets.map((asset) => (
              <Box key={asset.id} p={2.5} sx={{ '&:hover': { bgcolor: "#FFFFFF05" } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{asset.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#404F57" }}>{asset.vuln_count} vulnerabilities</Typography>
                  </Box>
                  <Chip label={asset.max_severity} size="small" 
                      sx={{ bgcolor: asset.max_severity === 'CRITICAL' ? '#FE3B46' : '#FF9500', color: '#FFF', fontWeight: 900, fontSize: '9px' }} 
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}