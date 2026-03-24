import { PenTestLog } from "@/src/types/pentest_log";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import ReportRowActions from "./LogRowAction";
import Link from "next/link";


type SortOrder = "none" | "asc" | "desc";
type SortColumn = "name" | "updated_at";

interface PenTestLogTableProps {
  project_id: number;
  role?: string;
  data: PenTestLog[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortBy: string | null;
  sortOrder: SortOrder;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (columnId: string) => void;
  onDeleteClick: (report: PenTestLog) => void;
}

export function PenTestLogTable({
  project_id,
  role,
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
}: PenTestLogTableProps) {

  // --- 1. กำหนด Columns Definition ---
  const columns: ColumnDef<PenTestLog>[] = [
    {
      id: "name",
      label: "Log Name",
      align: "left",
      sortable: true,
      width: "3%",
      render: (row) => (
        <div>
          {row.file_name}
        </div>
      )
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: false,
      width: "1%",
      render: (row) => (
        <div className="flex justify-center items-center">
            {row.job_status === "failed" && 
              <div className="flex justify-center items-center rounded-lg w-[70px] h-[24px] 
                    text-[#FF4D4F] bg-[#3A1F1F] font-bold">
                Failed
              </div>
            }
            {row.job_status === "completed" && 
              <div className="flex justify-center items-center rounded-lg w-[90px] h-[24px] 
                    text-[#4CFF88] bg-[#1E3A2A] font-bold">
                Success
              </div>
            }
            {row.job_status === "running" && 
              <div className="flex justify-center items-center rounded-lg w-[90px] h-[24px] 
                    text-[#FFD666] bg-[#3A3A1E] font-bold">
                On Going
              </div>
            }
            {row.job_status === "pending" && 
              <div className="flex justify-center items-center rounded-lg w-[90px] h-[24px] 
                    text-[#7C9CFF] bg-[#1E2A3A] font-bold">
                Scheduled
              </div>
            }
        </div>
      )
    },
    {
      id: "job",
      label: "Job",
      align: "center",
      sortable: false,
      width: "1%",
      render: (row) => (
        <Link
          href={`/projects/${project_id}/schedule/${row.schedule_id}`}
        >
          <div>
            {row.job_name}
          </div>
        </Link>
        
      )
    },
    {
        id: "schedule",
        label: "Schedule",
        align: "center",
        width: "1%",
        render: (row) => (
          <Link
            href={`/projects/${project_id}/schedule/${row.schedule_id}`}
          >
            <div>
              {row.schedule_name}
            </div>
          </Link>
        
      )
    },
    {
        id: "file_size",
        label: "File Size",
        align: "center",
        sortable: true,
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
        <ReportRowActions 
          row={row}
          onDeleteClick={onDeleteClick}
          projectId={project_id}
        />
      )
    }
  ];

  // --- 2. เรียกใช้ Generic Table ---
  return (
    <GenericTable<PenTestLog>
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