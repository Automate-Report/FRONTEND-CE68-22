import { JobDisplay } from "../../types/schedule";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import Link from "next/link";

type SortOrder = "none" | "asc" | "desc";
type SortColumn = "name" | "updated_at";

interface JobListByScheduleTableProps {
    data: JobDisplay[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    sortBy: string | null;
    sortOrder: SortOrder;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSort: (columnId: string) => void;
}

export function JobListByScheduleTable({
    data,
    totalCount,
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    onPageChange,
    onRowsPerPageChange,
    onSort,
}: JobListByScheduleTableProps) {

    // --- 1. กำหนด Columns Definition ---
    const columns: ColumnDef<JobDisplay>[] = [
        {
            id: "name",
            label: "Job Name",
            align: "left",
            sortable: true,
            // ถ้าไม่ใส่ render มันจะโชว์ row.name ให้เอง
            render: (row) => <div>{row.name}</div>
        },
        {
            id: "worker",
            label: "Worker",
            align: "center",
            sortable: false, 
            render: (row) => (
                <Link
                    href={`/workers/${row.worker_id}`}
                >
                    <div>{row.worker_name}</div>
                </Link>
            )
        }, {
            id: "assigned_at",
            label: "Assigned at",
            align: "center",
            sortable: true,
            render: (row) => {
                const d = new Date(row.created_at);
                return (
                    <div>{d.getDate()}-{d.getMonth() + 1}-{d.getFullYear()}</div>
                )
            }
        },
        {
            id: "status",
            label: "Status", // หัวตารางว่าง
            align: "center",
            sortable: true,
            width: "150px",
            render: (row) => (
                <div className="flex justify-center items-center">
                    {row.status === "failed" && <div className="flex justify-center items-center rounded-lg w-[70px] h-[24px] 
                    text-[#FF4D4F] bg-[#3A1F1F] font-bold">
                        Failed
                    </div>}
                    {row.status === "completed" && <div className="flex justify-center items-center rounded-lg w-[90px] h-[24px] 
                    text-[#4CFF88] bg-[#1E3A2A] font-bold">
                        Finished
                    </div>}
                    {row.status === "running" && <div className="flex justify-center items-center rounded-lg w-[90px] h-[24px] 
                    text-[#FFD666] bg-[#3A3A1E] font-bold">
                        On Going
                    </div>}
                    {row.status === "pending" && <div className="flex justify-center items-center rounded-lg w-[90px] h-[24px] 
                    text-[#7C9CFF] bg-[#1E2A3A] font-bold">
                        Scheduled
                    </div>}
                </div>
            )
        }
    ];

    // --- 2. เรียกใช้ Generic Table ---
    return (
        <GenericTable<JobDisplay>
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