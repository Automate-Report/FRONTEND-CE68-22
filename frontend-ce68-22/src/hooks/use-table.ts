import { useState, useMemo } from "react";

export type SortOrder = "asc" | "desc" | "none";

// ใช้ T แทน Project เพื่อให้ใช้กับ Type อะไรก็ได้
export function useTable<T>(data: T[], defaultRowsPerPage = 10) {
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
    setRowsPerPage(parseInt(event.target.value, 10));
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

  // --- Generic Sort Logic ---
  const visibleRows = useMemo(() => {
    const sortedData = [...data];

    if (sortOrder !== "none" && sortBy) {
      sortedData.sort((a, b) => {
        // ดึงค่ามาเทียบกัน
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        // ตรวจสอบว่าเป็น Date String หรือไม่ (แบบ Generic)
        // (Optional: ถ้าต้องการ Sort วันที่ให้แม่นยำขึ้น อาจต้อง parse Date)
        // แต่ปกติ ISO String ("2023-12-01") สามารถ Sort แบบ String ได้ถูกต้องอยู่แล้ว
        
        if (aValue < bValue) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedData;
  }, [data, sortBy, sortOrder]);

  return {
    page,
    rowsPerPage,
    sortBy: sortBy as string, // cast กลับเป็น string เพื่อให้ง่ายต่อการส่งไป UI
    sortOrder,
    visibleRows,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort, // เปลี่ยนชื่อจาก cycleSort เป็น handleSort ให้สื่อความหมายกลางๆ
  };
}