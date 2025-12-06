// src/components/ProjectTable/index.tsx
import { Project } from "../../types/project";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import Link from "next/link";


// Icons (สำหรับใช้ใน render)
import EditProjectIcon from "../icon/Edit";
import DeleteProjectIcon from "../icon/Delete";

type SortOrder = "none" | "asc" | "desc";
type SortColumn = "name" | "updated_at";

interface ProjectTableProps {
  data: Project[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortBy: string | null;
  sortOrder: SortOrder;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (columnId: string) => void;
}

export function ProjectTable({
  data,
  totalCount,
  page,
  rowsPerPage,
  sortBy,
  sortOrder,
  onPageChange,
  onRowsPerPageChange,
  onSort,
}: ProjectTableProps) {

  // --- 1. กำหนด Columns Definition ---
  const columns: ColumnDef<Project>[] = [
    {
      id: "name",
      label: "Project Name",
      align: "left",
      sortable: true,
      // ถ้าไม่ใส่ render มันจะโชว์ row.name ให้เอง
      render: (row) => (
        <Link
          href={`/projects/overview/${row.id}`}
        >
          <div>
            {row.name}
          </div>
        </Link>
      )
    },
    {
      id: "updated_at",
      label: "Last Updated",
      align: "center",
      sortable: true,
      width: "1%", // ให้หดเหลือพื้นที่เท่าที่จำเป็น
      render: (row) => {
        const d = new Date(row.updated_at);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    {
      id: "actions",
      label: "", // หัวตารางว่าง
      align: "right",
      sortable: false,
      width: "1%",
      render: (row) => (
        <div className="flex justify-around pr-2">
           {/* ตรงนี้คุณอาจจะใส่ onClick handler ในอนาคต */}
          <div className="pl-6 cursor-pointer"><EditProjectIcon /></div>
          <div className="pl-6 cursor-pointer"><DeleteProjectIcon /></div>
        </div>
      )
    }
  ];

  // --- 2. เรียกใช้ Generic Table ---
  return (
    <GenericTable<Project>
      columns={columns}
      data={data}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      sortBy={sortBy as string} // Cast type นิดหน่อยให้ Generic รับได้
      sortOrder={sortOrder}
      onSort={(id) => onSort(id as SortColumn)}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
}