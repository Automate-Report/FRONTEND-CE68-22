"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Box, Typography, Stack, Button, Paper, CircularProgress, IconButton,
  Divider, Accordion, AccordionSummary, AccordionDetails, Chip, Skeleton
} from "@mui/material";
import { 
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon, 
  ArrowBack as BackIcon, 
  PictureAsPdf as PdfIcon,
  CloudDone as SavedIcon
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import dynamic from 'next/dynamic';
import toast from "react-hot-toast";

// Service
import { penTestReportService } from "@/src/services/penTestReport.service";

// โหลด Editor แบบ Dynamic พร้อมปิด SSR และตั้งค่า Loading state
const PentestEditor = dynamic(() => import('@/src/components/reports/PentestEditor'), { 
  ssr: false, 
  loading: () => <Box sx={{ py: 2 }}><CircularProgress size={20} sx={{ color: "#34D399" }} /></Box> 
});

export default function EditReportPage() {
  const router = useRouter();
  const { id: projectId, reportId } = useParams();
  
  const [draftData, setDraftData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. ดึงข้อมูล Draft (จัดการเรื่อง Nested data Object)
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await penTestReportService.getDraft(Number(reportId));
        // ตรวจสอบโครงสร้าง response.data ตามที่ API ส่งมา
        if (response && response.status === "success") {
          setDraftData(response.data);
        } else {
          setDraftData(response);
        }
      } catch (error) {
        toast.error("Failed to load report draft");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDraft();
  }, [reportId]);

  // 2. ฟังก์ชันอัปเดตข้อมูลใน State (Immutability Pattern)
  const handleSectionChange = useCallback((sectionId: string, subSectionId: string | null, newText: string) => {
    setDraftData((prev: any) => {
      if (!prev) return prev;
      const nextSections = prev.sections.map((sec: any) => {
        if (sec.id === sectionId) {
          if (subSectionId && sec.sub_sections) {
            return {
              ...sec,
              sub_sections: sec.sub_sections.map((sub: any) =>
                sub.id === subSectionId ? { ...sub, text: newText } : sub
              ),
            };
          }
          return { ...sec, text: newText };
        }
        return sec;
      });
      return { ...prev, sections: nextSections };
    });
  }, []);

  // 3. บันทึกข้อมูลกลับไปยัง Backend (HTML Draft)
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // สมมติชื่อฟังก์ชัน updateDraft ใน service
      // await penTestReportService.updateDraft(Number(reportId), draftData);
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Loading State (Skeleton) ---
  if (isLoading || !draftData) {
    return (
      <Box sx={{ p: 4, bgcolor: "#0F1518", minHeight: "100vh" }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="30%" height={40} sx={{ bgcolor: "#1E2429" }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ bgcolor: "#1E2429", borderRadius: "12px" }} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#0F1518", minHeight: "100vh" }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => router.back()} sx={{ color: "#9AA6A8" }}><BackIcon /></IconButton>
          <Box>
            <Typography variant="h5" fontWeight={900} color="#FBFBFB">
              {draftData.report_metadata?.report_name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <SavedIcon sx={{ fontSize: 14, color: "#34D399" }} />
              <Typography variant="caption" color="#404F57">
                Project: {draftData.context?.project_name} | {draftData.context?.total_vulns} Findings
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
            onClick={handleSaveDraft}
            sx={{ bgcolor: "rgba(52, 211, 153, 0.1)", color: "#34D399", fontWeight: 700 }}
          >
            Save Draft
          </Button>
          <Button variant="contained" startIcon={<PdfIcon />} sx={{ bgcolor: "#34D399", color: "#0D1014", fontWeight: 800 }}>
            Finalize PDF
          </Button>
        </Stack>
      </Stack>

      {/* Render Sections (Accordion based) */}
      <Stack spacing={2}>
        {draftData?.sections?.map((section: any) => (
          <Accordion 
            key={section.id} 
            // ✅ ใช้ TransitionProps เพื่อสั่ง unmount เนื้อหาข้างในเมื่อปิด Accordion
            TransitionProps={{ unmountOnExit: true }}
            sx={{ 
              bgcolor: "#1E2429", 
              color: "#FBFBFB", 
              border: "1px solid #2D2F39", 
              borderRadius: "12px !important",
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#34D399" }} />}>
              <Typography fontWeight={700} sx={{ color: section.is_editable ? "#34D399" : "#9AA6A8" }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            
            <AccordionDetails sx={{ bgcolor: "#151B1F", p: 3, borderTop: "1px solid #2D2F39" }}>
              
              {/* 1. Rich Text Section (Editor) */}
              {section.content_type === "rich_text" && (
                <Stack spacing={4}>
                  {section.sub_sections?.map((sub: any) => (
                    <Box key={sub.id}>
                      <Typography variant="subtitle2" color="#9AA6A8" mb={1}>{sub.title}</Typography>
                      <PentestEditor 
                        value={sub.text || ""} 
                        onChange={(data) => handleSectionChange(section.id, sub.id, data)} 
                      />
                    </Box>
                  ))}
                </Stack>
              )}

              {/* 2. Finding List (Read Only Cards) */}
              {section.content_type === "finding_list" && (
                <Stack spacing={2}>
                  {section.items?.map((item: any) => (
                    <Paper key={item.vuln_id} sx={{ p: 2, bgcolor: "#1E2429", border: "1px solid #2D2F39" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body1" fontWeight={700} color="#FBFBFB">
                            {item.vuln_id}: {item.vuln_type}
                          </Typography>
                          <Typography variant="caption" color="#404F57">Target: {item.target}</Typography>
                        </Box>
                        <Chip 
                          label={item.severity} 
                          size="small" 
                          sx={{ 
                            bgcolor: item.severity === "CRITICAL" ? "#ef4444" : "#f59e0b", 
                            color: "white", fontWeight: 700 
                          }} 
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}

              {/* 3. Static / Fixed Template */}
              {(section.content_type === "static_reference" || section.content_type === "fixed_template") && (
                <Typography variant="body2" color="#9AA6A8" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
                  {section.text || section.data?.title}
                </Typography>
              )}

              {/* 4. Table Placeholder (Summary of Assets) */}
              {section.content_type === "table" && (
                <Box sx={{ p: 2, bgcolor: "#1E2429", borderRadius: "8px", textAlign: 'center', border: '1px dashed #404F57' }}>
                   <Typography variant="caption" color="#404F57">
                     Table data will be rendered in Final PDF (Assets: {section.sub_sections?.[0]?.rows?.length || 0})
                   </Typography>
                </Box>
              )}

            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}