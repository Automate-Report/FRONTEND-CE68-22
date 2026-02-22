"use client";

import { Box, TablePagination } from "@mui/material";

interface GenericPaginationProps {
    count: number;         // total items จาก API
    page: number;          // หน้าปัจจุบัน (0-based จาก MUI)
    rowsPerPage: number;   // size
    onPageChange: (newPage: number, newSize: number) => void; 
    rowsPerPageOptions?: number[];
    labelRowsPerPage?: string;
}

export function GenericPagination({
    count,
    page,
    rowsPerPage,
    onPageChange,
    rowsPerPageOptions = [6, 12, 24],
    labelRowsPerPage = "Projects per page:"
}: GenericPaginationProps) {

    const handleChangePage = (_: unknown, newPage: number) => {
        // ส่งค่า newPage + 1 ไปให้ API (เพราะ API เริ่มนับ 1)
        onPageChange(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        // เมื่อเปลี่ยน size มักจะเริ่มที่หน้าแรกเสมอ (หน้า 0 ใน UI / หน้า 1 ใน API)
        onPageChange(0, newSize);
    };

    return (
        <Box sx={{ 
            mt: 4, 
            display: 'flex', 
            justifyContent: 'flex-end',
            ".MuiTablePagination-root": { color: "#9AA6A8", borderBottom: "none" },
            ".MuiIconButton-root": { 
                color: "#8FFF9C",
                "&.Mui-disabled": { color: "rgba(143, 255, 156, 0.3)" }
            },
            ".MuiSelect-icon": { color: "#404F57" }
        }}>
            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                labelRowsPerPage={labelRowsPerPage}
            />
        </Box>
    );
}