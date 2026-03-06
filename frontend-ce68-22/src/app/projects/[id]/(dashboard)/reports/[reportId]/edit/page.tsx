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

import EditIcon from "@/src/components/icon/Edit";

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

  // เพิ่ม state นี้ใน EditReportPage Component
const [activeEditVuln, setActiveEditVuln] = useState<string | null>(null);

  // 1. ดึงข้อมูล Draft (จัดการเรื่อง Nested data Object)
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await penTestReportService.getDraft(Number(reportId));
        // ตรวจสอบโครงสร้าง response.data ตามที่ API ส่งมา
        if (response && response.status === "success") {
          console.log(response.data)
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

  const handleFindingChange = (sectionId: string, vulnId: string, field: 'description' | 'recommendation', newValue: string) => {
    setDraftData((prev: any) => {
      if (!prev) return prev;
      const nextSections = prev.sections.map((sec: any) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: sec.items.map((item: any) => 
              item.vuln_id === vulnId 
                ? { ...item, [`${field}_from_library`]: newValue } // อัปเดตฟิลด์ที่ต้องการ
                : item
            )
          };
        }
        return sec;
      });
      return { ...prev, sections: nextSections };
    });
  };

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
  
              {/* --- 1. หน้าปก (Cover Section) --- */}
              {section.id === "cover" && section.content && (
                <Stack spacing={1} sx={{ p: 2, border: "1px dashed #34D399", borderRadius: "8px" }}>
                  {section.content.map((item: any, idx: number) => (
                    <Stack key={idx} direction="row" spacing={2}>
                      <Typography variant="body2" sx={{ color: "#34D399", width: 180, fontWeight: 700 }}>{item.label}</Typography>
                      <Typography variant="body2" sx={{ color: "#FBFBFB" }}>{item.value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              )}

              {/* --- 2. Rich Text & Sub-sections (Executive Summary) --- */}
              {section.sub_sections?.map((sub: any) => (
                <Box key={sub.id} sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" color="#34D399" mb={1} fontWeight={700}>{sub.title}</Typography>
                  
                  {/* Editor สำหรับเนื้อหาหลัก */}
                  {sub.text !== undefined && (
                    <PentestEditor 
                      value={sub.text || ""} 
                      onChange={(data) => handleSectionChange(section.id, sub.id, data)} 
                    />
                  )}

                  {/* แสดงจำนวนช่องโหว่ (Counts) */}
                  {sub.counts && (
                    <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                      {sub.counts.map((count: string, idx: number) => (
                        <Chip key={idx} label={count} size="small" sx={{ bgcolor: "#1E2429", color: "#9AA6A8", border: "1px solid #2D2F39" }} />
                      ))}
                    </Stack>
                  )}

                  {/* ตารางสรุปสินทรัพย์ (Asset Table) */}
                  {sub.content_type === "table" && sub.rows && (
                    <Box sx={{ mt: 2, overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#FBFBFB', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #2D2F39', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Asset ID</th>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Target</th>
                            <th style={{ padding: '12px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sub.rows.map((row: any) => (
                            <tr key={row.asset_id} style={{ borderBottom: '1px solid #2D2F39' }}>
                              <td style={{ padding: '12px', color: '#34D399' }}>{row.asset_id}</td>
                              <td style={{ padding: '12px' }}>{row.asset_name}</td>
                              <td style={{ padding: '12px', color: '#9AA6A8' }}>{row.target}</td>
                              <td style={{ padding: '12px' }}>
                                <Chip label={row.status} size="small" variant="outlined" sx={{ color: '#34D399', borderColor: '#34D399' }} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  )}

                  {/* รายการข้อเสนอแนะ (Recommendations) */}
                  {sub.recommendations && (
                    <Stack spacing={1} mt={2}>
                      {sub.recommendations.map((rec: string, idx: number) => (
                        <Typography key={idx} variant="body2" sx={{ color: "#9AA6A8", pl: 2, borderLeft: "2px solid #34D399" }}>
                          {rec}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Box>
              ))}

              {/* --- 3. Technical Findings (Card with Edit Toggle) --- */}
              {section.id === "technical_findings" && (
                <Stack spacing={3}>
                  {section.intro && (
                    <Typography variant="body2" color="#9AA6A8" mb={2} sx={{ fontStyle: 'italic' }}>
                      {section.intro}
                    </Typography>
                  )}
                  
                  {section.items?.map((item: any) => {
                    const isEditing = activeEditVuln === item.vuln_id;

                    return (
                      <Paper 
                        key={item.vuln_id} 
                        sx={{ 
                          p: 3, 
                          bgcolor: "#1E2429", 
                          border: isEditing ? "1px solid #34D399" : "1px solid #2D2F39", 
                          borderRadius: "12px",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {/* Header Section */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box>
                            <Stack direction="row" spacing={2} alignItems="center" mb={0.5}>
                              <Typography variant="h6" color="#34D399" fontWeight={800}>
                                {item.vuln_id}: {item.vuln_type}
                              </Typography>
                              <Chip 
                                label={item.severity} 
                                size="small"
                                sx={{ 
                                  bgcolor: item.severity === "CRITICAL" ? "#ef4444" : "#f59e0b", 
                                  color: "white", fontWeight: 900, fontSize: '10px' 
                                }} 
                              />
                            </Stack>
                            <Typography variant="caption" color="#404F57">
                              Target: {item.target} | Parameter: {item.parameter}
                            </Typography>
                          </Box>

                          {/* ปุ่มเปิด/ปิดการแก้ไข */}
                          <Button
                            size="small"
                            variant={isEditing ? "contained" : "outlined"}
                            startIcon={isEditing ? <SavedIcon /> : <EditIcon />}
                            onClick={() => setActiveEditVuln(isEditing ? null : item.vuln_id)}
                            sx={{ 
                              color: isEditing ? "#0D1014" : "#34D399", 
                              bgcolor: isEditing ? "#34D399" : "transparent",
                              borderColor: "#34D399",
                              "&:hover": { bgcolor: isEditing ? "#10B981" : "rgba(52, 211, 153, 0.1)" }
                            }}
                          >
                            {isEditing ? "Finish Editing" : "Edit Content"}
                          </Button>
                        </Stack>

                        <Divider sx={{ my: 2, bgcolor: "#2D2F39" }} />

                        {/* --- Description Area --- */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="#34D399" mb={1} fontWeight={700}>
                            Vulnerability Description:
                          </Typography>
                          {isEditing ? (
                            <PentestEditor 
                              value={item.description_from_library || ""} 
                              onChange={(data) => handleFindingChange(section.id, item.vuln_id, 'description', data)} 
                            />
                          ) : (
                            <Box 
                              sx={{ color: "#FBFBFB", fontSize: "14px", lineHeight: 1.6 }}
                              dangerouslySetInnerHTML={{ __html: item.description_from_library || "No description provided." }}
                            />
                          )}
                        </Box>

                        {/* --- Recommendation Area --- */}
                        <Box>
                          <Typography variant="subtitle2" color="#34D399" mb={1} fontWeight={700}>
                            Recommendation:
                          </Typography>
                          {isEditing ? (
                            <PentestEditor 
                              value={item.reccommendation_from_library || ""} 
                              onChange={(data) => handleFindingChange(section.id, item.vuln_id, 'recommendation', data)} 
                            />
                          ) : (
                            <Box 
                              sx={{ color: "#9AA6A8", fontSize: "14px", lineHeight: 1.6 }}
                              dangerouslySetInnerHTML={{ __html: item.reccommendation_from_library || "No recommendation provided." }}
                            />
                          )}
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
              {/* --- 4. ภาคผนวก (Appendix / Steps) --- */}
              {section.id === "appendix_1" && (
              <Box>
                <Typography variant="body2" color="#9AA6A8" mb={3} sx={{ lineHeight: 1.8 }}>
                  {section.intro}
                </Typography>
                <Stack spacing={3}>
                  {section.methodology?.map((m: any, idx: number) => (
                    <Box key={idx}>
                      <Typography variant="subtitle1" color="#34D399" fontWeight={800} mb={1.5}>
                        {m.step}
                      </Typography>
                      <Stack spacing={1}>
                        {m.details?.map((detail: string, dIdx: number) => (
                          <Paper 
                            key={dIdx} 
                            sx={{ 
                              p: 2, 
                              bgcolor: "#0D1014", 
                              color: "#FBFBFB", 
                              borderLeft: "3px solid #34D399",
                              borderRadius: "4px"
                            }}
                          >
                            <Typography variant="body2">{detail}</Typography>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* --- 🚀 ภาคผนวก 2: Risk Rating (appendix_2) --- */}
            {section.id === "appendix_2" && (
              <Stack spacing={4}>
                <Typography variant="body2" color="#9AA6A8" sx={{ lineHeight: 1.8 }}>
                  {section.intro}
                </Typography>

                {/* OWASP Section */}
                {section.owasp && (
                  <Paper sx={{ p: 3, bgcolor: "#1E2429", border: "1px solid #2D2F39", borderRadius: "12px" }}>
                    <Typography variant="subtitle1" color="#34D399" fontWeight={800} mb={1}>
                      {section.owasp.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#34D399", display: "block", mb: 2, fontStyle: 'italic' }}>
                      สูตรคำนวณ: {section.owasp.formula}
                    </Typography>
                    
                    <Stack spacing={1.5} mb={3}>
                      {section.owasp.factors?.map((factor: string, i: number) => (
                        <Typography key={i} variant="body2" color="#FBFBFB">• {factor}</Typography>
                      ))}
                    </Stack>

                    <Box sx={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#FBFBFB', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#0D1014' }}>
                            {section.owasp.table?.[0].map((head: string, i: number) => (
                              <th key={i} style={{ padding: '12px', textAlign: 'left', border: '1px solid #2D2F39' }}>{head}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.owasp.table?.slice(1).map((row: any, i: number) => (
                            <tr key={i}>
                              <td style={{ padding: '12px', border: '1px solid #2D2F39' }}>{row[0]}</td>
                              <td style={{ padding: '12px', border: '1px solid #2D2F39', color: '#34D399', fontWeight: 700 }}>{row[1]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
                )}

                {/* CVSS Section */}
                {section.cvss && (
                  <Paper sx={{ p: 3, bgcolor: "#1E2429", border: "1px solid #2D2F39", borderRadius: "12px" }}>
                    <Typography variant="subtitle1" color="#34D399" fontWeight={800} mb={1}>
                      {section.cvss.title}
                    </Typography>
                    <Typography variant="body2" color="#9AA6A8" mb={3}>{section.cvss.intro}</Typography>

                    <Box sx={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#FBFBFB', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#0D1014' }}>
                            {section.cvss.table?.[0].map((head: string, i: number) => (
                              <th key={i} style={{ padding: '12px', textAlign: 'left', border: '1px solid #2D2F39' }}>{head}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.cvss.table?.slice(1).map((row: any, i: number) => (
                            <tr key={i}>
                              <td style={{ padding: '12px', border: '1px solid #2D2F39' }}>{row[0]}</td>
                              <td style={{ 
                                padding: '12px', 
                                border: '1px solid #2D2F39', 
                                fontWeight: 700, 
                                color: row[1].includes('สูง') || row[1].includes('วิกฤต') ? '#ef4444' : '#34D399' 
                              }}>
                                {row[1]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
                )}
              </Stack>
            )}

            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}