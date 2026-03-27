"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box
} from "@mui/material";

// Icons (Reuse ของเดิม)
import DefaultSortIcon from "../icon/DefaultSort"; 
import AscIcon from "../icon/AscIcon";
import DescIcon from "../icon/DescIcon";

import { TablePaginationActions } from "./TablePaginationAction";

// --- Type Definitions ---

// 1. กำหนดหน้าตาของ Column
export interface ColumnDef<T> {
  id: string;              // Key สำหรับ Sort หรือ อ้างอิง
  label: string | React.ReactNode;
  align?: "left" | "right" | "center";
  width?: string;          // กำหนดความกว้าง (optional)
  sortable?: boolean;      // คอลัมน์นี้ Sort ได้ไหม?
  
  // ฟังก์ชันสำหรับ Custom การแสดงผล (ถ้าไม่ใส่จะแสดงค่าจาก key id ตรงๆ)
  render?: (row: T) => React.ReactNode; 
}

// 2. Props ของ Generic Table
interface GenericTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  
  // Sorting
  sortBy: string | null;
  sortOrder: "asc" | "desc" | "none";
  onSort: (columnId: string) => void;
  
  // Pagination Actions
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// --- Component ---
export function GenericTable<T extends { id: number | string }>({
  columns,
  data,
  totalCount,
  page,
  rowsPerPage,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onRowsPerPageChange,
}: GenericTableProps<T>) {

  const sortIndicator = (columnId: string) => {
    if (sortBy !== columnId) return <DefaultSortIcon />;
    if (sortOrder === "asc") return <AscIcon />;
    if (sortOrder === "desc") return <DescIcon />;
    return <DefaultSortIcon />;
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "2px solid rgba(64,79,87,0.4)", bgcolor: "#0F1518", color: "#9ca3af" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* --- Table Head (Dynamic) --- */}
          <TableHead className="bg-[#0F1518]">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  width={col.width}
                  sx={{
                    whiteSpace: "nowrap",
                    cursor: col.sortable ? "pointer" : "default",
                    borderBottom: "none"
                  }}
                  onClick={() => col.sortable && onSort(col.id)}
                >
                  <div className={`flex items-center ${
                      col.align === "center" ? "justify-center" : 
                      col.align === "right" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Label */}
                    <span className="text-[#9ca3af]">{col.label}</span>
                    
                    {/* Sort Icon (แสดงเฉพาะถ้า column นั้น sortable) */}
                    {col.sortable && <div className="pl-2 text-[#9ca3af]">{sortIndicator(col.id)}</div>}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* --- Table Body (Dynamic) --- */}
          <TableBody>
            {data.map((row, index) => {
              const rowKey = row.id ? row.id : `row-${index}`;
              return (
                <TableRow
                  key={rowKey} 
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#192024" : "#151b1d",
                    border: 0
                  }}
                >
                  {columns.map((col) => (
                    <TableCell 
                      key={`${row.id}-${col.id}`} 
                      align={col.align || "left"}
                      sx = {{ color: "#E6F0E6", borderBottom: "none"}}
                      
                    >
                      {/* ถ้ามี function render ให้ใช้ render, ถ้าไม่มีให้ดึงค่าจาก object ตรงๆ */}
                      {col.render 
                        ? col.render(row) 
                        : (row as any)[col.id]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {/* Empty State */}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: "#9ca3af" }}>
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Reuse */}
      {/* --- แทนที่ TablePagination เดิมด้วยส่วนนี้ --- */}
      <Box sx={{
        display: 'flex', 
        justifyContent: 'flex-end',
        bgcolor: "#0F1518", // ให้สีพื้นหลังกลืนไปกับตาราง
        borderTop: "1px solid rgba(64,79,87,0.2)",
        // จัดการกับ Toolbar หลัก
        ".MuiTablePagination-root": {
          color: "#9AA6A8",
          borderBottom: "none",
          fontSize: "13px",
        },
        // จัดการกับปุ่มเปลี่ยนหน้า (Actions)
        ".MuiIconButton-root": {
          color: "#8FFF9C",
          transition: "0.2s",
          "&:hover": {
            bgcolor: "rgba(143, 255, 156, 0.1)",
          },
          "&:disabled": {
            color: "rgba(154, 166, 168, 0.3)",
          }
        },
        // จัดการกับ Dropdown ตัวเลือกจำนวนแถว
        ".MuiTablePagination-selectIcon": {
          color: "#8FFF9C",
        },
        ".MuiInputBase-root": {
          marginRight: "24px",
          bgcolor: "rgba(255,255,255,0.03)",
          borderRadius: "8px",
          padding: "2px 4px",
          border: "1px solid rgba(64, 79, 87, 0.5)",
          color: "#E6F0E6",
        },
        ".MuiTablePagination-actions": {
          marginLeft: "16px",
        }
      }}>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Items per page:"
          // ส่งต่อ ActionsComponent เดิมที่คุณมี
          ActionsComponent={TablePaginationActions}
          // ปรับแต่ง Menu ตอนกดเลือก rowsPerPage
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  bgcolor: "#1A2023",
                  color: "#E6F0E6",
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
    </Paper>
  );
}