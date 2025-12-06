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
  Box,
} from "@mui/material";

// Icons (Reuse ของเดิม)
import DefaultSortIcon from "../icon/DefaultSort"; 
import AscIcon from "../icon/AscIcon";
import DescIcon from "../icon/DescIcon";

import { TablePaginationActions } from "../projects/TablePaginationAction";

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
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <TableContainer component={Paper}>
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
                  }}
                  onClick={() => col.sortable && onSort(col.id)}
                >
                  <div className={`flex items-center ${col.align === "right" ? "justify-end" : ""}`}>
                    {/* Label */}
                    <span className="text-[#E6F0E6]">{col.label}</span>
                    
                    {/* Sort Icon (แสดงเฉพาะถ้า column นั้น sortable) */}
                    {col.sortable && <div className="pl-2">{sortIndicator(col.id)}</div>}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* --- Table Body (Dynamic) --- */}
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id} // ต้องมั่นใจว่า T มี id
                sx={{
                  backgroundColor: index % 2 === 0 ? "#FBFBFB" : "#EFF1F0",
                }}
              >
                {columns.map((col) => (
                  <TableCell key={`${row.id}-${col.id}`} align={col.align || "left"}>
                    {/* ถ้ามี function render ให้ใช้ render, ถ้าไม่มีให้ดึงค่าจาก object ตรงๆ */}
                    {col.render 
                      ? col.render(row) 
                      : (row as any)[col.id]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}

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
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}