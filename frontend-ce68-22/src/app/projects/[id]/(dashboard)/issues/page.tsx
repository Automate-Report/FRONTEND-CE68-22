"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, Typography, Stack, Divider, 
  TextField, MenuItem, Select, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, IconButton, Tooltip 
} from "@mui/material";
import { 
  BugReport as BugIcon, 
  Search as SearchIcon,
  Visibility as ViewIcon,
  ErrorOutline as CriticalIcon,
  WarningAmber as HighIcon,
  CheckCircleOutline as FixedIcon,
  FiberManualRecord as OpenIcon
} from "@mui/icons-material";

import { useProject } from "@/src/hooks/project/use-project";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dummy Data สำหรับตาราง
const DUMMY_ISSUES = [
  { id: 1, severity: "Critical", name: "SQL Injection", url: "https://api.example.com/v1/user", payload: "id=1' OR '1'='1", asset: "API Server", status: "Open", firstSeen: "20 Feb 2026" },
  { id: 2, severity: "High", name: "Cross-Site Scripting (XSS)", url: "https://example.com/search", payload: "<script>alert(1)</script>", asset: "Frontend Web", status: "In Progress", firstSeen: "19 Feb 2026" },
  { id: 3, severity: "Medium", name: "Broken Authentication", url: "https://auth.example.com/login", payload: "None", asset: "Auth Service", status: "Fixed", firstSeen: "18 Feb 2026" },
  { id: 4, severity: "Low", name: "Information Disclosure", url: "https://example.com/robots.txt", payload: "None", asset: "Frontend Web", status: "Open", firstSeen: "15 Feb 2026" },
];

export default function ProjectsIssuePage({ params }: PageProps) {
  const router = useRouter();
  const resolveParams = use(params);
  const projectId = parseInt(resolveParams.id);

  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <div className="p-8 text-[#8FFF9C]">Loading...</div>;
  if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project.name, href: `/projects/${projectId}/overview` },
    { label: "All Issues", href: undefined }
  ];

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "Critical": return "#FF3B30";
      case "High": return "#FF9500";
      case "Medium": return "#FFCC00";
      case "Low": return "#007AFF";
      default: return "#9AA6A8";
    }
  };

  return (
    <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl font-sans">
      
      {/* Section 1: Breadcrumbs */}
    <GenericBreadcrums items={breadcrumbItems} />

      
      {/* Section 2: Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 1 }}>All Issues</Typography>
        <Typography variant="body1" sx={{ color: "#9AA6A8" }}>Analyze and manage security vulnerabilities detected in this project.</Typography>
      </Box>

      {/* Section 3: Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
            { label: "Total", count: 5, color: "#8FFF9C", icon: <BugIcon /> },
            { label: "Critical", count: 1, color: "#FF3B30", icon: <CriticalIcon /> },
            { label: "High", count: 2, color: "#FF9500", icon: <HighIcon /> },
            { label: "Open", count: 3, color: "#FFCC00", icon: <OpenIcon /> },
            { label: "Fixed", count: 1, color: "#34C759", icon: <FixedIcon /> },
        ].map((stat, index) => (
            <Box 
            key={index}
            sx={{ 
                bgcolor: "#1E2429", 
                p: 2.5, 
                borderRadius: "16px", 
                border: "1px solid #404F57",
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                borderColor: stat.color,
                bgcolor: "#232A30" 
                }
            }}
            >
            <Box>
                {/* สลับเอาตัวเลขขึ้นก่อน */}
                <Typography variant="h4" sx={{ color: "#FBFBFB", fontWeight: 900, lineHeight: 1 }}>
                {stat.count}
                </Typography>
                <Typography sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mt: 0.5 }}>
                {stat.label}
                </Typography>
            </Box>

            {/* ส่วน Icon ทรงสี่เหลี่ยมมน (Rounded Square) */}
            <Box 
                sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: "12px", // เปลี่ยนเป็นสี่เหลี่ยมมน
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: stat.color, 
                bgcolor: `${stat.color}10`, // พื้นหลังจางๆ
                border: `1px solid ${stat.color}25`,
                }}
            >
                {stat.icon}
            </Box>
            </Box>
        ))}
        </div>

      {/* Section 4: Search and filter */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField 
          placeholder="Search by issue name or URL..."
          size="small"
          sx={{ 
            flex: 2, bgcolor: "#1A1E23", borderRadius: "8px", 
            "& .MuiOutlinedInput-root": { color: "#FBFBFB", "& fieldset": { borderColor: "#404F57" } } 
          }}
          InputProps={{ startAdornment: <SearchIcon sx={{ color: "#404F57", mr: 1 }} /> }}
        />
        <Select 
          defaultValue="all" size="small" 
          sx={{ flex: 1, bgcolor: "#1A1E23", color: "#FBFBFB", "& fieldset": { borderColor: "#404F57" } }}
        >
          <MenuItem value="all">All Severities</MenuItem>
          <MenuItem value="critical">Critical</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
        <Select 
          defaultValue="all" size="small" 
          sx={{ flex: 1, bgcolor: "#1A1E23", color: "#FBFBFB", "& fieldset": { borderColor: "#404F57" } }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="fixed">Fixed</MenuItem>
        </Select>
      </Stack>

      {/* Section 5: Table of Issues */}
      <TableContainer component={Paper} sx={{ bgcolor: "#272D31", borderRadius: "16px", border: "1px solid #404F57", overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: "#1E2429" }}>
            <TableRow>
              <TableCell sx={{ color: "#9AA6A8", fontWeight: "bold", borderBottom: "1px solid #404F57" }}>Severity</TableCell>
              <TableCell sx={{ color: "#9AA6A8", fontWeight: "bold", borderBottom: "1px solid #404F57" }}>Issue Detail</TableCell>
              <TableCell sx={{ color: "#9AA6A8", fontWeight: "bold", borderBottom: "1px solid #404F57" }}>Asset</TableCell>
              <TableCell sx={{ color: "#9AA6A8", fontWeight: "bold", borderBottom: "1px solid #404F57" }}>Status</TableCell>
              <TableCell sx={{ color: "#9AA6A8", fontWeight: "bold", borderBottom: "1px solid #404F57" }}>First Seen</TableCell>
              <TableCell sx={{ color: "#9AA6A8", fontWeight: "bold", borderBottom: "1px solid #404F57" }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DUMMY_ISSUES.map((issue) => (
              <TableRow key={issue.id} sx={{ "&:hover": { bgcolor: "rgba(143, 255, 156, 0.05)" } }}>
                <TableCell sx={{ borderBottom: "1px solid #404F57" }}>
                  <Chip 
                    label={issue.severity} 
                    size="small"
                    sx={{ bgcolor: `${getSeverityColor(issue.severity)}20`, color: getSeverityColor(issue.severity), fontWeight: "bold", borderRadius: "4px" }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #404F57" }}>
                  <Typography variant="subtitle2" sx={{ color: "#FBFBFB", fontWeight: "bold" }}>{issue.name}</Typography>
                  <Typography variant="caption" sx={{ color: "#9AA6A8", display: 'block' }}>{issue.url}</Typography>
                  <Typography variant="caption" sx={{ color: "#8FFF9C", fontFamily: 'monospace' }}>Payload: {issue.payload}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #404F57", color: "#FBFBFB" }}>{issue.asset}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #404F57" }}>
                  <Chip label={issue.status} variant="outlined" size="small" sx={{ color: issue.status === "Fixed" ? "#34C759" : "#FFCC00", borderColor: issue.status === "Fixed" ? "#34C759" : "#FFCC00" }} />
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #404F57", color: "#9AA6A8" }}>{issue.firstSeen}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #404F57" }} align="center">
                  <Tooltip title="View Triage & Fix">
                    <IconButton 
                      onClick={() => router.push(`/projects/${projectId}/triage`)}
                      sx={{ color: "#8FFF9C", "&:hover": { bgcolor: "rgba(143, 255, 156, 0.1)" } }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}