"use client";

import { use, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useProject } from "@/src/hooks/project/use-project";
import { useTags } from "@/src/hooks/project/use-Tags";
import { useProjectOverview } from "@/src/hooks/project/use-projectOverview";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import CardWithIcon from "@/src/components/Common/CardWithIcon";
import AssetIcon from "@/src/components/icon/AssetIcon";
import { BugReport, MedicalServices, Warning, WarningAmberRounded } from "@mui/icons-material";

interface PageProps { params: Promise<{ id: string }> }

export default function ProjectsOverviewPage({ params }: PageProps) {
  const resolveParams = use(params);
  const projectId = parseInt(resolveParams.id);

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: tags } = useTags(projectId);
  const { data: overview, isLoading: isOverviewLoading } = useProjectOverview(projectId);

  if (isProjectLoading || isOverviewLoading) return (
    <div className="flex justify-center items-center h-screen bg-[#0D1014]">
      <div className="w-10 h-10 border-4 border-[#8FFF9C] border-t-transparent rounded-full animate-spin" />
    </div>
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

  const hasCritical = (stats?.severity_counts.critical || 0) > 0;

  return (
    <div className="min-h-screen text-[#E6F0E6]">
      <GenericBreadcrums items={[{ label: "Home", href: "/main" }, { label: project?.name || "Project", href: undefined }]} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 mt-4">
        <div>
          <h1 className="font-bold text-[36px]">
            {project?.name}{" "}
            <span className="text-[#404F57] text-xl font-bold">#Overview</span>
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags?.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-xs font-bold rounded-full border text-[#8FFF9C] border-[#8FFF9C40] bg-[#8FFF9C15]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-end items-end h-full">
          <p className="text-[10px] font-black tracking-widest text-[#404F57] uppercase">Project Risk Rating</p>
          <p className={`text-6xl font-black leading-none ${hasCritical ? 'text-[#FE3B46]' : 'text-[#8FFF9C]'}`}>
            {hasCritical ? "D" : "A"}
          </p>
        </div>
      </div>

      {/* SECTION 1: TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Assets", value: stats?.total_assets ?? 0, color: "#FBFBFB", icon: <AssetIcon /> },
          { label: "Open Vulns", value: stats?.vulns_total ?? 0, color: "#FE3B46", icon: <BugReport sx={{ fontSize: "30px" }} /> },
          { label: "Critical Issues", value: stats?.severity_counts.critical ?? 0, color: "#FE3B46", icon: <WarningAmberRounded sx={{ fontSize: "30px" }} /> },
          { label: "Remediation Rate", value: stats?.remediation_rate ?? 0, color: "#8FFF9C", icon: <MedicalServices sx={{ fontSize: "30px" }} /> },
        ].map((item, i) => (
          <CardWithIcon
            key={i}
            icon={item.icon}
            title={item.label}
            dataDisplay={item.value}
            dataDisplayColor={item.color}
            iconColor={item.color}
            dataDisplaySize="24px"
            description=""
          />
        ))}
      </div>

      {/* SECTION 2: CHARTS */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Trend Chart */}
        <div className="border border-[#2D2F39] rounded-2xl h-[400px] flex-[2]">
          <div className="bg-[#1A2025] flex items-center gap-2 mb-6 p-5 rounded-t-2xl">
            <svg className="w-5 h-5 text-[#8FFF9C]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
            <h2 className="text-lg font-bold">Vulnerability Pipeline (7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height="80%" className="pb-6 pr-6">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FE3B46" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FE3B46" stopOpacity={0} />
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
        </div>

        {/* Pie Chart */}
        <div className="border border-[#2D2F39] rounded-2xl h-[400px] flex-1">
          <div className="bg-[#1A2025] flex items-center gap-2 mb-6 p-5 rounded-t-2xl">
            <h2 className="text-lg font-bold">Risk Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie data={severityChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {severityChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {severityChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-bold text-[#9AA6A8]">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT VULNS & RISKY ASSETS */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Recent Vulnerabilities */}
        <div className="border border-[#2D2F39] rounded-2xl overflow-hidden flex-[2]">
          <div className="bg-[#1A2025] flex justify-between items-center gap-2 mb-6 p-5 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#8FFF9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h2 className="text-lg font-bold">Recent Vulnerabilities</h2>
            </div>
            <span className="text-[10px] font-bold text-[#8FFF9C] border border-[#8FFF9C] rounded-full px-2 py-0.5">Real-time</span>
          </div>
          <div className="overflow-x-auto">
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
                {recentVulns.map((vuln) => {
                  const scoreColor = vuln.cvss_score >= 9 ? '#FE3B46' : vuln.cvss_score >= 7 ? '#FF9500' : '#FFCC00';
                  return (
                    <tr key={vuln.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-sm">{vuln.title}</p>
                        <p className="text-xs text-[#404F57]">{vuln.cve}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#9AA6A8]">{vuln.affected_asset}</td>
                      <td className="px-6 py-4">
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{ color: scoreColor, backgroundColor: `${scoreColor}20` }}
                        >
                          {vuln.severity} ({vuln.cvss_score})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-extrabold ${vuln.is_sla_breached ? 'text-[#FE3B46]' : 'text-[#8FFF9C]'}`}>
                          {vuln.sla_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Risky Assets */}
        <div className="border border-[#2D2F39] rounded-2xl overflow-hidden flex-1">
          <div className="bg-[#1A2025] flex justify-between items-center gap-2 mb-6 p-5 rounded-t-2xl">
            <h2 className="text-lg font-bold">Top Risky Assets</h2>
          </div>
          <div className="divide-y divide-[#2D2F39]">
            {topAssets.map((asset) => (
              <div key={asset.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-extrabold">{asset.name}</p>
                    <p className="text-xs text-[#404F57]">{asset.vuln_count} vulnerabilities</p>
                  </div>
                  <span
                    className="text-[9px] font-black text-white px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: asset.max_severity === 'CRITICAL' ? '#FE3B46' : '#FF9500' }}
                  >
                    {asset.max_severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}