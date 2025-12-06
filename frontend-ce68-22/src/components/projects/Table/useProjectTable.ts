// src/components/ProjectTable/useProjectTable.ts
import { useState, useMemo } from "react";
import { Project } from "../../../types/project";

export type SortOrder = "none" | "asc" | "desc";
export type SortColumn = "name" | "updated_at";

// รับ data เข้ามา (data นี้คือ data ของหน้านั้นๆ ที่ API ส่งมาแล้ว)
export function useProjectTable(data: Project[]) {
  const [page, setPage] = useState(0); // MUI เริ่มนับหน้า 0
  const [rowsPerPage, setRowsPerPage] = useState(10); // ตั้ง Default ให้ตรงกับ API
  const [sortBy, setSortBy] = useState<SortColumn | null>(null);
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const cycleSort = (column: SortColumn) => {
    if (sortBy !== column) {
      setSortBy(column);
      setSortOrder("asc");
      return;
    }
    setSortOrder((prev) =>
      prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"
    );
  };

  // --- จุดสำคัญที่แก้ไข ---
  // ไม่ต้อง .slice() แล้ว เพราะ data ที่เข้ามามีแค่ 10 ตัวตามที่ขอไป
  const visibleRows = useMemo(() => {
    const sortedData = [...data]; // copy array เพื่อไม่ให้กระทบตัวแปรหลัก

    // Logic การ Sort (Client-side Sort เฉพาะหน้าปัจจุบัน)
    if (sortOrder !== "none" && sortBy) {
      sortedData.sort((a, b) => {
        const valueA = sortBy === "updated_at" ? new Date(a.updated_at).getTime() : a[sortBy];
        const valueB = sortBy === "updated_at" ? new Date(b.updated_at).getTime() : b[sortBy];

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortedData; 
    // ^^^ ส่งคืน sortedData ทั้งก้อนเลย ไม่ต้อง .slice(page * rowsPerPage, ...)
  }, [data, sortBy, sortOrder]);

  return {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    visibleRows,
    handleChangePage,
    handleChangeRowsPerPage,
    cycleSort,
  };
}