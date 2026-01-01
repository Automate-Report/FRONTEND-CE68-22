
import { Worker } from "../../types/worker";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import Link from "next/link";

import { useWorkerDownload } from "@/src/hooks/worker/use-WorkerDownload";

// Worker Row Action
import WorkerRowActions from "./WorkerRowAction";

type SortOrder = "none" | "asc" | "desc";
type SortColumn = "name" | "Status";

interface WorkerTableProps {
  data: Worker[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortBy: string | null;
  sortOrder: SortOrder;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (columnId: string) => void;
  onDeleteClick: (project: Worker) => void;
}

export function WorkerTable({
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
}: WorkerTableProps) {

  // Download Worker
  const { downloadWorker, isLoading, error } = useWorkerDownload();

  // --- กำหนด Columns Definition ---
  const columns: ColumnDef<Worker>[] = [
    {
      id: "name",
      label: "Worker Name",
      align: "left",
      sortable: true,
      // ถ้าไม่ใส่ render มันจะโชว์ row.name ให้เอง
      render: (row) => (
        <Link
          href={`/workers/${row.id}`}
        >
          <div>
            {row.name}
          </div>
        </Link>
      )
    },
    {
      id: "hostname",
      label: "Hostname",
      align: "center",
      sortable: true,
      width: "1%",
      render: (row) => {
        if (row.hostname !== null){
          return (
            <div className="text-[16px] px-3 py-1.5">
              {row.hostname}
            </div>
          );
        }
      }
    },
    {
      id: "activate",
      label: "Activated",
      align: "center",
      sortable: false,
      width: "1%", // ให้หดเหลือพื้นที่เท่าที่จำเป็น
      render: (row) => {
        if (row.isActive === false){
          return (
            <div className="text-[#DD6E6E] text-[16px] font-semibold px-3 py-1.5 bg-[#FFDEDE] rounded-lg">
              Not Activated
            </div>
          );
        }
        else{
          return (
            <div className="text-[#6EDD99] text-[16px] font-semibold px-3 py-1.5 bg-[#DEFFE2] rounded-lg">
              Activated
            </div>
          );
        }
      }
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: true,
      width: "1%", // ให้หดเหลือพื้นที่เท่าที่จำเป็น
      render: (row) => {
        if (row.status === 'offline'){
          return (
            <div className="text-[#DD6E6E] text-[16px] font-semibold px-3 py-1.5 bg-[#FFDEDE] rounded-lg">
              Offline
            </div>
          );
        }
        else if (row.status === 'online'){
          return (
            <div className="text-[#6EDD99] text-[16px] font-semibold px-3 py-1.5 bg-[#DEFFE2] rounded-lg">
              Online
            </div>
          );
        }
        else if (row.status === 'Revoked'){
          return (
            <div className="text-[#6B7280] text-[16px] font-semibold px-3 py-1.5 bg-[#F3F4F6] rounded-lg">
                Revoke Key
            </div>
          );
        }
        else{
          return (
            <div className="text-[#D97706] text-[16px] font-semibold px-3 py-1.5 bg-[#FEF3C7] rounded-lg">
                Unknow
            </div>
          );
        }
      }
    },
    {
      id: "actions",
      label: "", // หัวตารางว่าง
      align: "right",
      sortable: false,
      width: "10%",
      render: (row) => (
        <WorkerRowActions 
          row={row}
          onDeleteClick={onDeleteClick}
        />
      )
    }
  ];


  // --- เรียกใช้ Generic Table ---
  return (
    <GenericTable<Worker>
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