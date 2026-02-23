"use client";

import { use, useState } from "react";
import { 
  Box, Typography, Stack, Divider, Chip, 
  Button, List, ListItemButton, ListItemText 
} from "@mui/material";
import { 
  CheckCircleOutline as FixedIcon,
  ErrorOutline as CriticalIcon,
  WarningAmber as HighIcon,
  BuildCircle as TriageIcon,
  ArrowForwardIos as ArrowIcon,
  BugReport as BugIcon,
  Code as CodeIcon,
  Schedule as TimeIcon
} from "@mui/icons-material";

import { useProject } from "@/src/hooks/project/use-project";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

import { VulnerabilitySummary } from "@/src/components/vulns/VulnerabilitySummary";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dummy Data สำหรับรายการช่องโหว่
const DUMMY_TRIAGE_LIST = [
  { id: 1, name: "Broken Access Control", severity: "Critical", asset: "Internal HR Portal", status: "To Fix", firstSeen: "10 Feb 2026", count: 3 },
  { id: 2, name: "Improper Input Validation", severity: "High", asset: "Main Gateway", status: "To Fix", firstSeen: "12 Feb 2026", count: 1 },
  { id: 3, name: "Insecure Deserialization", severity: "Critical", asset: "Payment Service", status: "To Fix", firstSeen: "15 Feb 2026", count: 5 },
];

export default function TriageFixPage({ params }: PageProps) {
  const resolveParams = use(params);
  const projectId = parseInt(resolveParams.id);
  const { data: project, isLoading, isError } = useProject(projectId);
  
  const [selectedIssue, setSelectedIssue] = useState(DUMMY_TRIAGE_LIST[0]);

  if (isLoading) return <div className="p-8 text-[#8FFF9C]">Loading...</div>;
  if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project.name, href: `/projects/${projectId}/overview` },
    { label: "Triage & Fix", href: undefined }
  ];

  return (
    <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl font-sans">
      
      {/* ส่วนที่ 1: Breadcrumbs & Header */}
      <Box mb={4}>
        <GenericBreadcrums items={breadcrumbItems} />
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mt: 2, mb: 1 }}>
          Triage & Fix
        </Typography>
        <Typography variant="body2" sx={{ color: "#9AA6A8" }}>
          Review evidence, prioritize remediation, and update issue status.
        </Typography>
      </Box>

      {/* ส่วนที่ 2: Overview Cards (4 ใบ) - ใช้ CSS Grid */}
      <VulnerabilitySummary 
        projectId={projectId}
      />

      {/* ส่วนที่ 3: รายการ และ รายละเอียด (Split Layout) - ใช้ CSS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* รายการช่องโหว่ (4/12) */}
        <Box className="lg:col-span-4 bg-[#1E2429] rounded-2xl border border-[#404F57] overflow-hidden flex flex-col">
          <Box p={2} borderBottom="1px solid #404F57" bgcolor="#232A30">
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#9AA6A8" }}>UNRESOLVED ISSUES</Typography>
          </Box>
          <List sx={{ p: 0, overflowY: 'auto' }}>
            {DUMMY_TRIAGE_LIST.map((issue) => (
              <ListItemButton 
                key={issue.id} 
                selected={selectedIssue.id === issue.id}
                onClick={() => setSelectedIssue(issue)}
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

        {/* รายละเอียด (8/12) */}
        <Box className="lg:col-span-8 bg-[#161B1F] rounded-2xl border border-[#404F57] p-6 flex flex-col">
          {/* Issue Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
            <Box>
              <Chip 
                label={selectedIssue.severity.toUpperCase()} 
                size="small" 
                sx={{ 
                  bgcolor: selectedIssue.severity === "Critical" ? "#FF3B3020" : "#FF950020", 
                  color: selectedIssue.severity === "Critical" ? "#FF3B30" : "#FF9500", 
                  fontWeight: 900, mb: 2 
                }} 
              />
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#FBFBFB", mb: 1 }}>{selectedIssue.name}</Typography>
              <Typography sx={{ color: "#9AA6A8", display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon sx={{ fontSize: 16 }} /> First detected on {selectedIssue.firstSeen}
              </Typography>
            </Box>
            <Button variant="contained" sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: "bold", "&:hover": { bgcolor: "#AFFFB9" } }}>
              Mark as Fixed
            </Button>
          </Stack>

          {/* Technical Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* ฝั่งซ้าย: Details (7/12) */}
            <div className="md:col-span-7 space-y-6">
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#8FFF9C", fontWeight: "bold", mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugIcon sx={{ fontSize: 18 }} /> Technical Detail
                </Typography>
                <div className="bg-[#1E2429] p-4 rounded-xl border border-[#404F57] border-l-4 border-l-[#8FFF9C]">
                  <Typography variant="body2" sx={{ color: "#E6F0E6", lineHeight: 1.8 }}>
                    พบช่องโหว่ประเภท {selectedIssue.name} ที่เครื่องเซิร์ฟเวอร์หลัก ({selectedIssue.asset}) 
                    ซึ่งอาจส่งผลให้แฮกเกอร์สามารถเข้าถึงข้อมูลที่สำคัญโดยไม่ได้รับอนุญาตผ่านทาง HTTP Request โดยตรง...
                  </Typography>
                </div>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: "#8FFF9C", fontWeight: "bold", mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CodeIcon sx={{ fontSize: 18 }} /> Proof of Concept (Evidence)
                </Typography>
                <pre className="bg-[#0D1014] p-4 rounded-xl border border-[#404F57] overflow-x-auto custom-scrollbar">
                  <code className="text-[#FFCC00] text-xs font-mono">
                    GET /api/v1/user?id=1' OR '1'='1 HTTP/1.1{"\n"}
                    Host: {selectedIssue.asset}{"\n"}
                    User-Agent: PentestBot/1.0{"\n"}
                    Accept: application/json
                  </code>
                </pre>
              </Box>
            </div>

            {/* ฝั่งขวา: Summary & Remediation (5/12) */}
            <div className="md:col-span-5">
              <Box className="bg-[#1E2429] p-5 rounded-xl border border-[#404F57] space-y-5">
                <div>
                  <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 0.5 }}>RECURRENCE</Typography>
                  <Typography variant="body1" sx={{ color: "#FBFBFB", fontWeight: "bold" }}>พบซ้ำ {selectedIssue.count} ครั้ง</Typography>
                </div>
                
                <div>
                  <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 1 }}>REMEDIATION STEPS</Typography>
                  <ul className="list-disc pl-4 space-y-2">
                    {["Validate all user inputs", "Use Parameterized Queries", "Implement strict WAF rules"].map((step, i) => (
                      <li key={i}><Typography variant="body2" sx={{ color: "#E6F0E6" }}>{step}</Typography></li>
                    ))}
                  </ul>
                </div>
                
                <Divider sx={{ borderColor: "#404F57", opacity: 0.5 }} />
                
                <div>
                  <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, mb: 1.5, display: 'block' }}>ACTIVITY LOG</Typography>
                  <Stack spacing={2}>
                    {[
                      { date: "Feb 10", event: "Detected by Pentester", user: "system" },
                      { date: "Feb 12", event: "Status changed to Triage", user: "admin" }
                    ].map((log, i) => (
                      <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#8FFF9C', mt: 1 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#FBFBFB", fontWeight: "bold", display: 'block' }}>{log.date}</Typography>
                          <Typography variant="caption" sx={{ color: "#9AA6A8" }}>{log.event}</Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </div>
              </Box>
            </div>
          </div>
        </Box>
      </div>

    </div>
  );
}