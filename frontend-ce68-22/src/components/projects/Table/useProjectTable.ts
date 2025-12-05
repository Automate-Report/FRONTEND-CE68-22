// src/components/ProjectTable/useProjectTable.ts
import { useState, useMemo } from "react";
import { Project } from "../../../types/project"; 

export type SortOrder = "none" | "asc" | "desc";
export type SortColumn = "name" | "updated_at";

export function useProjectTable(data: Project[]) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  // ใช้ useMemo เพื่อไม่ให้ sort ใหม่ทุกครั้งถ้า data หรือ sort state ไม่เปลี่ยน
  const visibleRows = useMemo(() => {
    const sortedData = [...data];

    if (sortOrder !== "none" && sortBy) {
      sortedData.sort((a, b) => {
        const valueA = sortBy === "updated_at" ? new Date(a.updated_at).getTime() : a[sortBy];
        const valueB = sortBy === "updated_at" ? new Date(b.updated_at).getTime() : b[sortBy];

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [data, sortBy, sortOrder, page, rowsPerPage]);

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