"use client";

import { use, useState } from "react";
import { Box, Typography, List, ListItemButton, ListItemText, Stack } from "@mui/material";
import { ArrowForwardIos as ArrowIcon } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { VulnerabilitySummary } from "@/src/components/vulns/VulnerabilitySummary";
import { useProject } from "@/src/hooks/project/use-project";

// สมมติว่าดึงมาจาก API (ในที่นี้ใช้ Dummy ก่อน)
const DUMMY_TRIAGE_LIST = [
  { id: 1, name: "Broken Access Control", severity: "Critical", asset: "Internal HR Portal" },
  { id: 2, name: "Improper Input Validation", severity: "High", asset: "Main Gateway" },
  { id: 3, name: "Insecure Deserialization", severity: "Critical", asset: "Payment Service" },
];

export default function TriageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const currentVulnId = params.vulnId as string;
  
  const { data: project } = useProject(parseInt(projectId));

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
    { label: "Triage & Fix", href: undefined }
  ];

  return (
    <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl font-sans">
      <Box mb={4}>
        <GenericBreadcrums items={breadcrumbItems} />
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mt: 2, mb: 1 }}>Triage & Fix</Typography>
        <Typography variant="body2" sx={{ color: "#9AA6A8" }}>Review evidence and update issue status.</Typography>
      </Box>

      <VulnerabilitySummary projectId={parseInt(projectId)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] mt-2">
        {/* รายการช่องโหว่ (4/12) */}
        <Box className="lg:col-span-4 bg-[#1E2429] rounded-2xl border border-[#404F57] overflow-hidden flex flex-col h-fit">
          <Box p={2} borderBottom="1px solid #404F57" bgcolor="#232A30">
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#9AA6A8" }}>UNRESOLVED ISSUES</Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {DUMMY_TRIAGE_LIST.map((issue) => (
              <ListItemButton 
                key={issue.id} 
                selected={currentVulnId === issue.id.toString()}
                onClick={() => router.push(`/projects/${projectId}/triage/${issue.id}`)}
                sx={{ 
                  borderBottom: "1px solid #2D353B", py: 2,
                  "&.Mui-selected": { bgcolor: "rgba(143, 255, 156, 0.08)", borderLeft: "4px solid #8FFF9C" },
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.03)" }
                }}
              >
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: "bold", color: "#FBFBFB", fontSize: "14px" }}>{issue.name}</Typography>}
                  secondary={<Typography sx={{ fontSize: "12px", color: issue.severity === "Critical" ? "#FF3B30" : "#FF9500" }}>{issue.severity} • {issue.asset}</Typography>}
                />
                <ArrowIcon sx={{ fontSize: 14, color: "#404F57" }} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* ส่วนรายละเอียด (8/12) - จะโหลดเนื้อหาจาก [vulnId]/page.tsx มาลงตรงนี้ */}
        <Box className="lg:col-span-8">
          {children}
        </Box>
      </div>
    </div>
  );
}