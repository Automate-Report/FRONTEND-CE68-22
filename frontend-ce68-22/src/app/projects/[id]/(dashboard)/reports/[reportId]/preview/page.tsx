"use client";

import { Box, Paper, Typography, Stack, Button, Divider } from "@mui/material";
import { GetApp as DownloadIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function PreviewReportPage() {
  const router = useRouter();

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Stack direction="row" justifyContent="space-between" width="100%" maxWidth="800px" mb={3}>
        <Button startIcon={<BackIcon />} onClick={() => router.back()} sx={{ color: "#9AA6A8" }}>Back to Edit</Button>
        <Button variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: "#8FFF9C", color: "#0D1014" }}>Download Sample PDF</Button>
      </Stack>

      {/* จำลองกระดาษ A4 */}
      <Paper sx={{ 
        width: '100%', maxWidth: '800px', minHeight: '1000px', 
        bgcolor: '#FBFBFB', p: 8, color: '#0D1014',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column'
      }}>
        <Typography variant="h3" fontWeight={900} textAlign="center" mt={10} mb={2}>Penetration Testing Report</Typography>
        <Typography variant="h6" textAlign="center" color="textSecondary" mb={10}>Confidential Assessment</Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h5" fontWeight={800} mb={2}>1. Executive Summary</Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
          [เนื้อหาที่พิมพ์จากหน้า Editor จะมาโผล่ตรงนี้...] 
          พบความเสี่ยงระดับสูงในระบบประมวลผลข้อมูล ซึ่งอาจทำให้ผู้ไม่หวังดีสามารถเข้าถึงฐานข้อมูลลูกค้าได้...
        </Typography>

        <Typography variant="h5" fontWeight={800} mb={2}>2. Vulnerability Statistics</Typography>
        {/* กราฟหรือตารางสรุปจำนวน Severity */}
        <Box sx={{ p: 4, bgcolor: '#f0f0f0', borderRadius: '8px', textAlign: 'center', mb: 4 }}>
          [Chart: Critical 2, High 5, Medium 10]
        </Box>

        <Typography variant="h5" fontWeight={800} mb={2}>3. Technical Findings</Typography>
        <Typography variant="body2" color="textSecondary">รายชื่อช่องโหว่ทั้งหมดที่ผ่านการ Verify แล้วจะเรียงลำดับจาก Critical ลงไป...</Typography>
      </Paper>
    </Box>
  );
}