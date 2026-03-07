"use client";

import { useState } from "react";

export type SortOrder = "asc" | "desc" | "none";

// ใช้ T แทน Project เพื่อให้ใช้กับ Type อะไรก็ได้
export function useTable<T>(defaultRowsPerPage = 6) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  
  // sortBy เก็บ key ของ T (เช่น "name", "id", "email")
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 6));
    setPage(0);
  };

  const handleSort = (column: keyof T | string) => {
    const colKey = column as keyof T;
    
    // ถ้ากดซ้ำคอลัมน์เดิม ให้สลับ asc -> desc -> none
    if (sortBy !== colKey) {
      setSortBy(colKey);
      setSortOrder("asc");
      return;
    }
    
    // Logic สลับสถานะ: asc -> desc -> none
    setSortOrder((prev) =>
      prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"
    );
  };

  return {
    page,
    rowsPerPage,
    sortBy: sortBy as string, // cast กลับเป็น string เพื่อให้ง่ายต่อการส่งไป UI
    sortOrder,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort, // เปลี่ยนชื่อจาก cycleSort เป็น handleSort ให้สื่อความหมายกลางๆ
  };
}