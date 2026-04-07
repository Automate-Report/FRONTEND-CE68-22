"use client";

import { useState } from "react";
import { Box, Typography, Stack, Button, Paper, CircularProgress, Divider } from "@mui/material";
import { Save as SaveIcon, Visibility as PreviewIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { useProject } from "@/src/hooks/project/use-project";

export default function EditWordReportPage() {
  const router = useRouter();
  const { id: projectId, reportId } = useParams();
  const { data: project, isLoading } = useProject(parseInt(projectId as string));
  const [saving, setSaving] = useState(false);

  // สมมติสถานะเนื้อหา (ในอนาคตจะใช้ Rich Text Editor Library มาแทนที่ช่อง TextArea)
  const [reportContent, setReportContent] = useState({
    executiveSummary: "วัตถุประสงค์หลักเพื่อประเมินระดับความมั่นคงปลอดภัยและค้นหาช่องโหว่...", // [cite: 18, 19]
    recommendations: "มอบหมายผู้รับผิดชอบเข้าแก้ไขช่องโหว่ระดับวิกฤตและระดับสูง...", // [cite: 31, 33]
    conclusion: "สภาวะความมั่นคงปลอดภัยของระบบอยู่ในระดับสูง..." // [cite: 91, 92]
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4, bgcolor: "#0F1518", minHeight: "100vh" }}>
      <GenericBreadcrums 
        items={[
          { label: "Home", href: "/main" },
          { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
          { label: "Report Center", href: `/projects/${projectId}/reports` },
          { label: "Edit Content", href: undefined }
        ]} 
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" my={4}>
        <Typography variant="h4" fontWeight={900} color="#FBFBFB">Editor Mode</Typography>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<PreviewIcon />} sx={{ color: "#8FFF9C" }}>Preview PDF/Word</Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />} 
            sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: 800 }}
            onClick={() => setSaving(true)}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={4}>
        {/* ส่วนที่ 1: บทสรุปผู้บริหาร [cite: 17] */}
        <Paper sx={{ p: 4, bgcolor: "#1E2429", borderRadius: "16px", border: "1px solid #2D2F39" }}>
          <Typography variant="h6" color="#8FFF9C" fontWeight={900} mb={2}>
            บทสรุปผู้บริหาร (EXECUTIVE SUMMARY)
          </Typography>
          <Box sx={{ minHeight: 200, bgcolor: "#0D1014", p: 2, borderRadius: "8px", border: "1px solid #2D2F39" }}>
            {/* ตรงนี้คือจุดที่วาง Rich Text Editor Library */}
            <Typography color="#9AA6A8" variant="caption" display="block" mb={1}>
              Tip: คุณสามารถจัดรูปแบบตัวหนา หรือใส่ Bullet points ได้เหมือนใน Word
            </Typography>
            <textarea 
              style={{ width: '100%', background: 'transparent', color: '#FBFBFB', border: 'none', outline: 'none', minHeight: 150, fontFamily: 'inherit' }}
              value={reportContent.executiveSummary}
              onChange={(e) => setReportContent({...reportContent, executiveSummary: e.target.value})}
            />
          </Box>
        </Paper>

        {/* ส่วนที่ 2: ข้อเสนอแนะ [cite: 31] */}
        <Paper sx={{ p: 4, bgcolor: "#1E2429", borderRadius: "16px", border: "1px solid #2D2F39" }}>
          <Typography variant="h6" color="#8FFF9C" fontWeight={900} mb={2}>
            ข้อเสนอแนะเชิงกลยุทธ์ (STRATEGIC RECOMMENDATIONS)
          </Typography>
          <textarea 
            style={{ width: '100%', background: '#0D1014', color: '#FBFBFB', border: '1px solid #2D2F39', borderRadius: '8px', padding: 16, minHeight: 100 }}
            value={reportContent.recommendations}
            onChange={(e) => setReportContent({...reportContent, recommendations: e.target.value})}
          />
        </Paper>
        
        {/* ส่วนที่แจ้งเตือนว่าข้อมูลอื่นจะดึงมาอัตโนมัติ [cite: 53, 56] */}
        <Box sx={{ p: 3, bgcolor: "rgba(143, 255, 156, 0.05)", borderRadius: "12px", border: "1px dashed #8FFF9C30" }}>
          <Typography variant="body2" color="#8FFF9C">
            💡 <b>Note:</b> ข้อมูลทางเทคนิค (Technical Findings), PoC, cURL และภาพหน้าจอหลักฐาน จะถูกดึงจากระบบมาใส่ใน Template อัตโนมัติ [cite: 50, 54, 72, 77]
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}