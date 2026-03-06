"use client";

import { useState, useEffect } from "react";
import { 
  Box, Typography, Stack, Button, Paper, 
  CircularProgress, Divider, IconButton, Tooltip 
} from "@mui/material";
import { 
  Save as SaveIcon, 
  ArrowBack as BackIcon, 
  PictureAsPdf as PdfIcon,
  Visibility as PreviewIcon,
  CloudDone as SavedIcon
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import dynamic from 'next/dynamic';
import toast from "react-hot-toast";

// โหลด Editor แบบ Dynamic
const PentestEditor = dynamic(() => import('@/src/components/reports/PentestEditor'), { 
  ssr: false, 
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
      <CircularProgress sx={{ color: "#34D399" }} />
    </Box>
  )
});

export default function EditReportPage() {
  const router = useRouter();
  const { id: projectId, reportId } = useParams();
  
  const [htmlContent, setHtmlContent] = useState("<h1>Executive Summary</h1><p>Loading template...</p>");
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // สมมติการดึงข้อมูล Draft จาก Backend
  useEffect(() => {
    // fetchData(reportId).then(res => setHtmlContent(res.content_html));
  }, [reportId]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // API PATCH: /reports/{reportId} { content_html: htmlContent }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      // API POST: /reports/{reportId}/finalize
      // ส่งคำสั่งให้ Backend นำ HTML ไป Build เป็น PDF จริงลง Storage
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Report finalized and stored as PDF!");
      router.push(`/projects/${projectId}/reports`);
    } catch (error) {
      toast.error("Error generating final PDF");
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#0F1518", minHeight: "100vh" }}>
      {/* Top Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => router.back()} sx={{ color: "#9AA6A8" }}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={900} color="#FBFBFB">
              Edit Report Content
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <SavedIcon sx={{ fontSize: 14, color: "#34D399" }} />
              <Typography variant="caption" color="#404F57">Auto-save enabled</Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<PreviewIcon />}
            sx={{ color: "#34D399", borderColor: "rgba(52, 211, 153, 0.3)" }}
          >
            Preview PDF
          </Button>
          <Button 
            variant="contained" 
            startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSaveDraft}
            sx={{ bgcolor: "rgba(52, 211, 153, 0.1)", color: "#34D399", fontWeight: 800 }}
          >
            Save Draft
          </Button>
          <Button 
            variant="contained" 
            startIcon={isFinalizing ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />}
            onClick={handleFinalize}
            sx={{ bgcolor: "#34D399", color: "#0D1014", fontWeight: 800, "&:hover": { bgcolor: "#10B981" } }}
          >
            Finalize & Save
          </Button>
        </Stack>
      </Stack>

      {/* Editor & Sidebar Layout */}
      <Stack direction="row" spacing={3} alignItems="flex-start">
        {/* Main Editor Paper */}
        <Paper sx={{ 
          flex: 1, p: 4, bgcolor: "#1E2429", borderRadius: "16px", border: "1px solid #2D2F39",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)" 
        }}>
          <PentestEditor value={htmlContent} onChange={setHtmlContent} />
        </Paper>

        {/* Right Sidebar: Guide & Variables */}
        <Box sx={{ width: 300, display: { xs: 'none', lg: 'block' } }}>
          <Paper sx={{ p: 3, bgcolor: "#151B1F", borderRadius: "12px", border: "1px solid #2D2F39" }}>
            <Typography variant="subtitle2" color="#34D399" fontWeight={800} mb={2}>
              REPORT GUIDELINES
            </Typography>
            <Typography variant="body2" color="#9AA6A8" mb={2}>
              เขียนบทสรุปสำหรับผู้บริหารที่ครอบคลุมวัตถุประสงค์, ขอบเขต และภาพรวมความเสี่ยงที่พบในโปรเจกต์นี้
            </Typography>
            <Divider sx={{ bgcolor: "#2D2F39", my: 2 }} />
            <Typography variant="subtitle2" color="#34D399" fontWeight={800} mb={1}>
              QUICK TIPS
            </Typography>
            <ul style={{ color: "#404F57", fontSize: '12px', paddingLeft: '16px' }}>
              <li>ใช้ตารางเพื่อสรุปช่องโหว่</li>
              <li>เน้นคำแนะนำที่ทำได้จริง (Actionable)</li>
              <li>แนบ PoC สำหรับช่องโหว่ระดับ High</li>
            </ul>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}