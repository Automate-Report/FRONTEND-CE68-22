import { useState, useMemo } from "react";

export type SortOrder = "none" | "asc" | "desc";

// <T> คือ Generic Type (จะเป็น Project หรือ User หรืออะไรก็ได้)
export function useTable<T>(data: T[], filterField: keyof T, defaultSortBy: keyof T | null = null) {
  
  // --- States ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState("");
  
  // State สำหรับ Sort
  const [sortBy, setSortBy] = useState<keyof T | null>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // --- Handlers ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0); // รีเซ็ตไปหน้าแรกเสมอเมื่อค้นหา
  };

  const handleRequestSort = (property: keyof T) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  // --- Logic 1: Filter ---
  const filteredData = useMemo(() => {
    if (!filterName) return data;

    return data.filter((item) => {
      // ดึงค่าจาก field ที่กำหนด (เช่น item['name'])
      const value = item[filterField];
      
      // แปลงเป็น string แล้วเช็คว่ามีคำค้นหาไหม
      return String(value).toLowerCase().includes(filterName.toLowerCase());
    });
  }, [data, filterName, filterField]);

  // --- Logic 2: Sort ---
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    
    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        // ดึงค่ามาเทียบกัน
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        // ตรวจสอบว่าเป็นวันที่หรือไม่ (ถ้าเป็น string ISO-8601 เช่น '2023-10-01' สามารถเทียบ string ได้เลย)
        // แต่ถ้าต้องการ parse Date จริงๆ อาจต้องเพิ่ม Logic เช็ค type ตรงนี้
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortBy, sortOrder]);

  // --- Logic 3: Pagination ---
  const visibleRows = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  return {
    page,
    rowsPerPage,
    filterName,
    sortBy,
    sortOrder,
    visibleRows,         // ข้อมูลที่ตัดมาแล้วพร้อมโชว์
    totalCount: filteredData.length, // จำนวนทั้งหมดหลังกรอง (สำหรับ Pagination)
    handleChangePage,
    handleChangeRowsPerPage,
    handleFilter,
    handleRequestSort
  };
}