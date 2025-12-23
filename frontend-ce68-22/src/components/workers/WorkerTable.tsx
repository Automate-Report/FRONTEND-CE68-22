
import { Worker } from "../../types/worker";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import Link from "next/link";



// Icons 
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from "../icon/Edit";
import DeleteIcon from "../icon/Delete";
import { Button } from "@mui/material";

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
        else{
          return (
            <div className="text-[#6EDD99] text-[16px] font-semibold px-3 py-1.5 bg-[#DEFFE2] rounded-lg">
              Online
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
        <div className="flex items-center justify-end gap-6 pr-4">
           {/* ตรงนี้คุณอาจจะใส่ onClick handler ในอนาคต */}
          <Link href={`/workers`} className="cursor-pointer"><EditIcon /></Link>
          <div 
            className="cursor-pointer"
            onClick={() => onDeleteClick(row)}
          >
            <DeleteIcon />
          </div>
          <Button 
            sx={{ 
              minWidth: 0,
              padding: 0,
              margin: 0,
              
              color: "#404F57",
              "&:hover": { backgroundColor: "transparent" } 
            }}
            disableRipple
          >
            <DownloadIcon />
          </Button>
        </div>
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