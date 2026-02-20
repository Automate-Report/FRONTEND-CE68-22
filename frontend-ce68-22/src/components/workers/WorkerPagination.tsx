"use client";

import { Box, IconButton, Typography, Stack, useTheme } from "@mui/material";
import { 
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from "@mui/icons-material";

interface WorkerPaginationProps {
  totalCount: number;
  page: number; // 0-based index
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export function WorkerPagination({ 
  totalCount, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange 
}: WorkerPaginationProps) {
  
  const theme = useTheme();
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startEntry = page * rowsPerPage + 1;
  const endEntry = Math.min((page + 1) * rowsPerPage, totalCount);

  // นำรูปแบบ Style ที่คุณกำหนดมาใช้
  const actionButtonStyle = {
    color: "#E6F0E6", // สีไอคอนปกติ
    "&:hover": {
      backgroundColor: "rgba(230, 240, 230, 0.1)", // สีพื้นหลังตอนเอาเมาส์ชี้ (จางๆ)
    },
    "&.Mui-disabled": {
      color: "rgba(230, 240, 230, 0.3)", // สีตอนกดไม่ได้ (Disabled) ให้จางลง
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mt: 4, 
      px: 3,
      py: 2,
      bgcolor: '#161B1F', // เข้ากับธีม Dark Card
      borderRadius: '16px',
      border: '1px solid #2D2F39'
    }}>
      {/* ฝั่งซ้าย: แสดงข้อมูลจำนวนรายการ */}
      <Typography variant="body2" sx={{ color: '#9AA6A8', fontWeight: 500 }}>
        Showing <span style={{ color: '#FBFBFB', fontWeight: 'bold' }}>{totalCount === 0 ? 0 : startEntry}-{endEntry}</span> of <span style={{ color: '#FBFBFB', fontWeight: 'bold' }}>{totalCount}</span> Workers
      </Typography>

      <Stack direction="row" spacing={4} alignItems="center">
        {/* ส่วนเลือก Rows per page */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="caption" sx={{ color: '#404F57', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Rows per page:
          </Typography>
          <select 
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            style={{
              backgroundColor: '#1E2429',
              color: '#E6F0E6',
              border: '1px solid #404F57',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {[6, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </Stack>

        {/* ส่วนควบคุมเลขหน้าและไอคอน */}
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" sx={{ color: '#FBFBFB', fontWeight: 'bold', mr: 2 }}>
            {page + 1} <span style={{ color: '#404F57', fontWeight: 'normal' }}>of {totalPages || 1}</span>
          </Typography>

          <Box sx={{ flexShrink: 0 }}>
            <IconButton 
              onClick={() => onPageChange(0)} 
              disabled={page === 0}
              aria-label="first page"
              sx={actionButtonStyle}
            >
              {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>

            <IconButton 
              onClick={() => onPageChange(page - 1)} 
              disabled={page === 0}
              aria-label="previous page"
              sx={actionButtonStyle}
            >
              {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>

            <IconButton 
              onClick={() => onPageChange(page + 1)} 
              disabled={page >= totalPages - 1}
              aria-label="next page"
              sx={actionButtonStyle}
            >
              {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>

            <IconButton 
              onClick={() => onPageChange(totalPages - 1)} 
              disabled={page >= totalPages - 1}
              aria-label="last page"
              sx={actionButtonStyle}
            >
              {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}