"use client";

import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { Schedule as PendingIcon } from "@mui/icons-material";
import { JobItemCard } from "./JobItemCard";
import { GenericPagination } from "@/src/components/Common/GenericPagination";

interface WorkerAssignedJobsProps {
    jobs: any;
    isLoading: boolean;
    projectId: number;
    onPageChange: (page: number, size: number) => void; 
}

export function WorkerAssignedJobs({ jobs, isLoading, projectId, onPageChange }: WorkerAssignedJobsProps) {
    // ดึงข้อมูลจาก props jobs ที่ส่งมาจาก useGetJobByWorker
    const jobItems = jobs?.items || [];
    const totalItems = jobs?.total || 0;
    
    // สำคัญ: ดึงค่าหน้าปัจจุบันและขนาดจาก API Response 
    // (API ส่วนใหญ่ส่งมาเป็น 1-based เราจึงลบ 1 เพื่อให้ MUI แสดงผลหน้า 0-based ได้ถูกต้อง)
    const currentPage = jobs?.page ? jobs.page - 1 : 0;
    const currentSize = jobs?.size || 5;

    if (isLoading) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress size={32} sx={{ color: "#8FFF9C" }} />
                <Typography sx={{ color: "#404F57", mt: 2, fontSize: "14px" }}>Fetching jobs...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 6 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ color: "#E6F0E6", fontWeight: "bold" }}>
                    Job Assigned
                </Typography>
                {totalItems > 0 && (
                    <Typography sx={{ color: "#404F57", fontSize: "14px" }}>
                        Total {totalItems} jobs found
                    </Typography>
                )}
            </Stack>

            <Stack spacing={2}>
                {jobItems.length > 0 ? (
                    <>
                        {jobItems.map((job: any) => (
                            <JobItemCard key={job.id} job={job} projectId={projectId} />
                        ))}
                        
                        {/* ปรับให้ตรงกับ Interface ใหม่ของ GenericPagination */}
                        <GenericPagination 
                            count={totalItems}
                            page={currentPage}
                            rowsPerPage={currentSize}
                            // เมื่อเปลี่ยนหน้า: ส่งหน้าใหม่ และใช้ขนาดเดิม
                            onPageChange={(newPage) => onPageChange(newPage, currentSize)}
                            // เมื่อเปลี่ยนขนาด: ให้กลับไปหน้า 0 และใช้ขนาดใหม่
                            onRowsPerPageChange={(newSize) => onPageChange(0, newSize)}
                            labelRowsPerPage="Jobs per page:"
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </>
                ) : (
                    <Box sx={{ 
                        bgcolor: "#1E2429", p: 8, borderRadius: "20px", border: "1px dashed #404F57", 
                        textAlign: 'center', color: '#404F57' 
                    }}>
                        <PendingIcon sx={{ fontSize: 48, mb: 2, opacity: 0.2 }} />
                        <Typography>No active jobs currently assigned to this worker.</Typography>
                    </Box>
                )}
            </Stack>
        </Box>
    );
}