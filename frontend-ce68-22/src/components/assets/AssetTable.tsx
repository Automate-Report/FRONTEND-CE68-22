import { Asset } from "@/src/types/asset";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import Link from "next/link";


// Icons (สำหรับใช้ใน render)
import EditProjectIcon from "../icon/Edit";
import DeleteProjectIcon from "../icon/Delete";

type SortOrder = "none" | "asc" | "desc";
type SortColumn = "name" | "updated_at";

interface AssetTableProps {
  data: Asset[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortBy: string | null;
  sortOrder: SortOrder;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (columnId: string) => void;
  onDeleteClick: (asset: Asset) => void;
}

export function AssetTable({
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
}: AssetTableProps) {

  // --- 1. กำหนด Columns Definition ---
  const columns: ColumnDef<Asset>[] = [
    {
      id: "name",
      label: "Asset Name",
      align: "left",
      sortable: true,
      // ถ้าไม่ใส่ render มันจะโชว์ row.name ให้เอง
      render: (row) => (
        <Link
          href={`/projects/${row.project_id}/assets/${row.id}`}
        >
          <div>
            {row.name}
          </div>
        </Link>
      )
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
          <Link href={`/projects/${row.project_id}/assets/${row.id}/edit`} className="cursor-pointer"><EditProjectIcon /></Link>
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
    <GenericTable<Asset>
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