"use client";

import { Box, TablePagination } from "@mui/material";

interface GenericPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number, currentRowsPerPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void; 
  rowsPerPageOptions?: number[];
  labelRowsPerPage?: string;
}

export function GenericPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [6, 12, 24],
  labelRowsPerPage = "Items per page:"
}: GenericPaginationProps) {

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    onRowsPerPageChange(newSize);
  };

  return (
    <Box sx={{ 
      mt: 4, 
      display: 'flex', 
      justifyContent: 'flex-end',
      // จัดการกับ Toolbar หลัก
      ".MuiTablePagination-root": {
        color: "#9AA6A8",
        borderBottom: "none",
        fontSize: "13px",
      },
      // จัดการกับปุ่มเปลี่ยนหน้า (ลูกศร)
      ".MuiIconButton-root": {
        color: "#8FFF9C",
        transition: "0.2s",
        "&:hover": {
          bgcolor: "rgba(143, 255, 156, 0.1)",
        },
        "&.Mui-disabled": {
          color: "rgba(154, 166, 168, 0.3)", // สีเทาจางเมื่อกดไม่ได้
        }
      },
      // จัดการกับตัวเลือกจำนวนแถว (Dropdown)
      ".MuiTablePagination-selectIcon": {
        color: "#8FFF9C", // สีลูกศรใน Dropdown
      },
      ".MuiInputBase-root": {
        marginRight: "24px",
        bgcolor: "rgba(255,255,255,0.03)",
        borderRadius: "8px",
        padding: "2px 4px",
        border: "1px solid rgba(64, 79, 87, 0.5)",
      },
      // จัดการกับเมนูที่เด้งขึ้นมา (Menu Paper)
      ".MuiTablePagination-actions": {
        marginLeft: "16px",
      }
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
        // ปรับแต่ง Select Menu เพิ่มเติม (สำคัญมากสำหรับ Dark Mode)
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                bgcolor: "#1A2023", // สีพื้นหลังเมนู
                color: "#E6F0E6",   // สีตัวหนังสือในเมนู
                border: "1px solid #404F57",
                "& .MuiMenuItem-root": {
                  fontSize: "13px",
                  "&:hover": {
                    bgcolor: "rgba(143, 255, 156, 0.1)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(143, 255, 156, 0.2)",
                    "&:hover": {
                      bgcolor: "rgba(143, 255, 156, 0.3)",
                    }
                  }
                }
              }
            }
          }
        }}
      />
    </Box>
  );
}