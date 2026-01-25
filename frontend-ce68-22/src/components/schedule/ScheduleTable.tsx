import { ScheduleDisplay, ScheduleDelete } from "../../types/schedule";
import { GenericTable, ColumnDef } from "../Common/GenericTable"; // Import ตัวใหม่
import Link from "next/link";

// Icons (สำหรับใช้ใน render)
import EditIcon from "../icon/Edit";
import DeleteIcon from "../icon/Delete";

type SortOrder = "none" | "asc" | "desc";
type SortColumn = "name" | "updated_at";

interface ScheduleTableProps {
    data: ScheduleDisplay[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    sortBy: string | null;
    sortOrder: SortOrder;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSort: (columnId: string) => void;
    onDeleteClick: (schedule: ScheduleDelete) => void;
}

export function ScheduleTable({
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
}: ScheduleTableProps) {

    // --- 1. กำหนด Columns Definition ---
    const columns: ColumnDef<ScheduleDisplay>[] = [
        {
            id: "name",
            label: "Schedule Name",
            align: "left",
            sortable: true,
            // ถ้าไม่ใส่ render มันจะโชว์ row.name ให้เอง
            render: (row) => (
                <Link
                    href={`/projects/${row.id}/overview`}
                >
                    <div>
                        {row.name}
                    </div>
                </Link>
            )
        },
        {
            id: "job_status",
            label: "Job Status",
            align: "center",
            sortable: false,
            width: "160px", // ให้หดเหลือพื้นที่เท่าที่จำเป็น
            render: (row) => (
                <Link
                    href={`/schedule/${row.id}/overview`}
                >
                    <div className="flex justify-center gap-4">
                        <div className="flex justify-center items-center rounded-lg w-[28px] h-[24px] text-[#6EDD99] bg-[#DEFFE2] font-bold">
                            {row.job_status.finished}
                        </div>
                        <div className="flex justify-center items-center rounded-lg w-[28px] h-[24px] text-[#DD6E6E] bg-[#FFDEDE] font-bold">
                            {row.job_status.failed}
                        </div>
                        <div className="flex justify-center items-center rounded-lg w-[28px] h-[24px] text-[#DDA96E] bg-[#FDFFDE] font-bold">
                            {row.job_status.ongoing}
                        </div>
                        <div className="flex justify-center items-center rounded-lg w-[28px] h-[24px] text-[#6E9ADD] bg-[#DEFFFD] font-bold">
                            {row.job_status.scheduled}
                        </div>
                    </div>
                </Link>
            )
        }, {
            id: "start_date",
            label: "Start",
            align: "center",
            sortable: true,
            width: "127px", // ให้หดเหลือพื้นที่เท่าที่จำเป็น
            render: (row) => (
                <Link
                    href={`/schedule/${row.id}/overview`}
                >
                    <div>
                        {row.start_date.toLocaleDateString("en-GB")}
                    </div>
                </Link>
            )
        }, {
            id: "end_date",
            label: "End",
            align: "center",
            sortable: true,
            width: "127px", // ให้หดเหลือพื้นที่เท่าที่จำเป็น
            render: (row) => (
                <Link
                    href={`/schedule/${row.id}/overview`}
                >
                    <div>
                        {row.end_date?.toLocaleDateString("en-GB")}
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
                    <Link href={`/projects/${row.id}/edit`} className="cursor-pointer"><EditIcon /></Link>
                    <div
                        className="cursor-pointer"
                        onClick={() => onDeleteClick(row)}
                    >
                        <DeleteIcon />
                    </div>
                </div>
            )
        }
    ];

    // --- 2. เรียกใช้ Generic Table ---
    return (
        <GenericTable<ScheduleDisplay>
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