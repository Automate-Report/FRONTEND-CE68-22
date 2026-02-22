"use client";

import { useState } from "react";
import { Box, Typography, Stack, CircularProgress, TablePagination } from "@mui/material";
import { Schedule as PendingIcon } from "@mui/icons-material";
import { JobItemCard } from "./JobItemCard";

interface WorkerAssignedJobsProps {
    jobs: any; // รับเป็น Object ที่มี items และ total
    isLoading: boolean;
    projectId: number;
    // รับฟังก์ชันสำหรับเปลี่ยนหน้า
    onPageChange: (page: number, size: number) => void; 
}

export function WorkerAssignedJobs({ jobs, isLoading, projectId, onPageChange }: WorkerAssignedJobsProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const jobItems = jobs?.items || [];
    const totalItems = jobs?.total || 0;

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
        onPageChange(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
        onPageChange(0, newSize);
    };

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
                        
                        {/* Pagination Component */}
                        <Box sx={{ 
                            mt: 2, 
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            ".MuiTablePagination-root": { color: "#9AA6A8" },
                            ".MuiIconButton-root": { color: "#8FFF9C" },
                            ".MuiSelect-icon": { color: "#404F57" }
                        }}>
                            <TablePagination
                                component="div"
                                count={totalItems}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                                labelRowsPerPage="Jobs per page:"
                            />
                        </Box>
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