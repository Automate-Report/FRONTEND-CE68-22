import { PenTestReport } from "@/src/types/report";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import Link from "next/link";


// Icons (สำหรับใช้ใน render)
import DownloadIcon from '@mui/icons-material/Download';
import DeleteProjectIcon from "../icon/Delete";

type SortOrder = "none" | "asc" | "desc";
type SortColumn = "name" | "updated_at";

interface PenTestReportTableProps {
  data: PenTestReport[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortBy: string | null;
  sortOrder: SortOrder;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (columnId: string) => void;
  onDeleteClick: (report: PenTestReport) => void;
}

export function PenTestReportTable({
  data,
  totalCount,
  page,
  rowsPerPage,
  sortBy,
  sortOrder,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onDeleteClick,
}: PenTestReportTableProps) {

  // --- 1. กำหนด Columns Definition ---
  const columns: ColumnDef<PenTestReport>[] = [
    {
      id: "name",
      label: "Report Name",
      align: "left",
      sortable: true,
      // ถ้าไม่ใส่ render มันจะโชว์ row.name ให้เอง
      render: (row) => (
        <Link
          href={`/projects/report/`}
        >
          <div>
            {row.file_name}
          </div>
        </Link>
      )
    },
    {
      id: "job",
      label: "Job",
      align: "center",
      sortable: true,
      width: "1%",
      render: (row) => (
        <div>
          {row.job_name}
        </div>
      )
    },
    {
        id: "schedule",
        label: "Schedule",
        align: "center",
        width: "1%",
        render: (row) => (
        <div>
            {row.schedule_name}
        </div>
      )
    },
    {
        id: "file_size",
        label: "File Size",
        align: "center",
        width: "1%",
        render: (row) => (
        <div>
            {row.file_size}
        </div>
       )
    },
    {
      id: "create_at",
      label: "Create Date",
      align: "center",
      sortable: true,
      width: "1%", // ให้หดเหลือพื้นที่เท่าที่จำเป็น
      render: (row) => {
        const d = new Date(row.created_at);
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
        <div className="flex justify-around pr-2 gap-6">
           {/* ตรงนี้คุณอาจจะใส่ onClick handler ในอนาคต */}
          <div><DownloadIcon /></div>
          <div 
            className="cursor-pointer"
            onClick={() => onDeleteClick(row)}
          >
            <DeleteProjectIcon />
          </div>
        </div>
      )
    }
  ];

  // --- 2. เรียกใช้ Generic Table ---
  return (
    <GenericTable<PenTestReport>
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