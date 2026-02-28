"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Box, Typography, Stack, Button, TextField, 
  Paper, Divider, CircularProgress 
} from "@mui/material";
import { 
  Save as SaveIcon, 
  Visibility as PreviewIcon, 
  ArrowBack as BackIcon,
  Description as ReportIcon
} from "@mui/icons-material";

// Components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { useProject } from "@/src/hooks/project/use-project";

export default function EditPentestReportPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const reportId = params.reportId as string;

  const { data: project, isLoading: isProjectLoading } = useProject(parseInt(projectId));
  const [saving, setSaving] = useState(false);

  // --- State สำหรับเนื้อหาตามหัวข้อหลักใน Template [cite: 8, 31, 91] ---
  const [reportContent, setReportContent] = useState({
    executiveSummary: "", // บทสรุปผู้บริหาร [cite: 8, 17]
    managementRecommendations: {
      shortTerm: "มอบหมายผู้รับผิดชอบเข้าแก้ไขช่องโหว่ระดับวิกฤตและระดับสูง...", // [cite: 33]
      mediumTerm: "บูรณาการระบบตรวจสอบความปลอดภัยอัตโนมัติเข้ากับ CI/CD...", // [cite: 34]
      longTerm: "พัฒนาทักษะบุคลากรด้าน Security Coding..." // [cite: 35]
    },
    overallConclusion: "" // บทสรุปภาพรวมความปลอดภัย [cite: 91]
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulation API call
    setTimeout(() => {
      setSaving(false);
      alert("Draft saved successfully!");
    }, 1000);
  };

  if (isProjectLoading) return <CircularProgress />;

  return (
    <Box sx={{ pb: 10, px: 4, bgcolor: "#0F1518", minHeight: "100vh" }}>
      {/* Navigation Breadcrumbs */}
      <GenericBreadcrums 
        items={[
          { label: "Home", href: "/main" },
          { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
          { label: "Report Center", href: `/projects/${projectId}/reports` },
          { label: "Edit Pentest Report", href: undefined }
        ]} 
      />

      {/* Header Actions Stack */}
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", md: "center" }} 
        spacing={2}
        my={4}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <ReportIcon sx={{ color: "#8FFF9C", fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB" }}>
            Edit Report Content
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button 
            startIcon={<PreviewIcon />} 
            onClick={() => router.push(`/projects/${projectId}/reports/${reportId}/preview`)}
            sx={{ color: "#8FFF9C", fontWeight: 700 }}
          >
            Live Preview
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: 800, px: 4 }}
          >
            {saving ? "Saving..." : "Save Draft"}
          </Button>
        </Stack>
      </Stack>

      {/* Main Layout Container (Flexbox) */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
        
        {/* Left Side: Editor Form (Flex: 2) */}
        <Box sx={{ flex: 2 }}>
          <Stack spacing={4}>
            
            {/* Section 1: Executive Summary [cite: 8, 17] */}
            <Paper sx={{ p: 4, bgcolor: "#1E2429", border: "1px solid #2D2F39", borderRadius: "16px" }}>
              <Typography variant="h6" color="#8FFF9C" fontWeight={900} mb={2}>
                1. EXECUTIVE SUMMARY (บทสรุปผู้บริหาร)
              </Typography>
              <TextField 
                fullWidth multiline rows={10}
                placeholder="ระบุวัตถุประสงค์และภาพรวมการดำเนินงานของโครงการ..."
                value={reportContent.executiveSummary}
                onChange={(e) => setReportContent({...reportContent, executiveSummary: e.target.value})}
                sx={{ 
                  bgcolor: "#0D1014", borderRadius: "8px", 
                  "& .MuiInputBase-input": { color: "#FBFBFB", lineHeight: 1.7 } 
                }}
              />
            </Paper>

            {/* Section 2: Management Recommendations [cite: 31, 32] */}
            <Paper sx={{ p: 4, bgcolor: "#1E2429", border: "1px solid #2D2F39", borderRadius: "16px" }}>
              <Typography variant="h6" color="#8FFF9C" fontWeight={900} mb={3}>
                2. STRATEGIC RECOMMENDATIONS (ข้อเสนอแนะเชิงกลยุทธ์)
              </Typography>
              <Stack spacing={3}>
                <TextField 
                  label="ระยะสั้น (Short-term)" fullWidth multiline rows={2}
                  value={reportContent.managementRecommendations.shortTerm}
                  onChange={(e) => setReportContent({
                    ...reportContent, 
                    managementRecommendations: {...reportContent.managementRecommendations, shortTerm: e.target.value}
                  })}
                  InputLabelProps={{ sx: { color: '#404F57' } }}
                  sx={{ bgcolor: "#0D1014", borderRadius: "8px", "& .MuiInputBase-input": { color: "#FBFBFB" } }}
                />
                <TextField 
                  label="ระยะกลาง (Medium-term)" fullWidth multiline rows={2}
                  value={reportContent.managementRecommendations.mediumTerm}
                  InputLabelProps={{ sx: { color: '#404F57' } }}
                  sx={{ bgcolor: "#0D1014", borderRadius: "8px", "& .MuiInputBase-input": { color: "#FBFBFB" } }}
                />
                <TextField 
                  label="ระยะยาว (Long-term)" fullWidth multiline rows={2}
                  value={reportContent.managementRecommendations.longTerm}
                  InputLabelProps={{ sx: { color: '#404F57' } }}
                  sx={{ bgcolor: "#0D1014", borderRadius: "8px", "& .MuiInputBase-input": { color: "#FBFBFB" } }}
                />
              </Stack>
            </Paper>

            {/* Section 3: Overall Conclusion [cite: 90, 91] */}
            <Paper sx={{ p: 4, bgcolor: "#1E2429", border: "1px solid #2D2F39", borderRadius: "16px" }}>
              <Typography variant="h6" color="#8FFF9C" fontWeight={900} mb={2}>
                3. OVERALL CONCLUSION (บทสรุปภาพรวมความปลอดภัย)
              </Typography>
              <TextField 
                fullWidth multiline rows={4}
                placeholder="ระบุสภาวะความมั่นคงปลอดภัยโดยรวมของโครงการ {project_name}..."
                value={reportContent.overallConclusion}
                onChange={(e) => setReportContent({...reportContent, overallConclusion: e.target.value})}
                sx={{ bgcolor: "#0D1014", borderRadius: "8px", "& .MuiInputBase-input": { color: "#FBFBFB" } }}
              />
            </Paper>
          </Stack>
        </Box>

        {/* Right Side: Read-only Info (Flex: 1) [cite: 53] */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Paper sx={{ p: 3, bgcolor: "#111518", border: "1px solid #2D2F39", borderRadius: "16px" }}>
              <Typography variant="subtitle2" color="#404F57" fontWeight={900} mb={2}>
                AUTO-GENERATED SECTIONS
              </Typography>
              <Stack spacing={1.5}>
                {[
                  "Vulnerability Profile (CVSS v3.1 Chart)", // [cite: 20, 135]
                  "Asset-Based Risk Summary Table", // [cite: 28, 29]
                  "Audit Methodology (OWASP/NIST)", // [cite: 102, 103]
                  "Technical Findings (Details & PoC)", // [cite: 51, 56]
                  "Vulnerability Lifecycle Tracking" // [cite: 81, 82]
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 6, height: 6, bgcolor: "#8FFF9C", borderRadius: '50%' }} />
                    <Typography variant="caption" color="#9AA6A8">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: 2, borderColor: "#2D2F39" }} />
              <Typography variant="caption" color="#404F57" fontStyle="italic">
                * ข้อมูลในส่วนนี้จะถูกจัดทำโดยอัตโนมัติตามผลการทดสอบเชิงเทคนิค [cite: 53]
              </Typography>
            </Paper>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}