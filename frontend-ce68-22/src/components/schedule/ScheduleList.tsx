"use client";

import { useState, useEffect } from "react";
import { useSchedule } from "../../hooks/schedule/use-schedule";
import { useTable } from "@/src/hooks/use-table";
import { GenericDeleteModal } from "../Common/GenericDeleteModal";
import { scheduleService } from "@/src/services/schedule.service";
import { ScheduleDisplay, ScheduleCreatePayload, ScheduleDelete } from "@/src/types/schedule";
import { ScheduleTable } from "./ScheduleTable";

//นิยาม Interface สำหรับ Props
interface ScheduleListProps {
    searchQuery: string;
    filterStatus: string;
}


export function ScheduleList({ searchQuery, filterStatus }: ScheduleListProps) {

    const {
        page,
        rowsPerPage,
        sortBy,
        sortOrder,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSort,
    } = useTable<ScheduleDisplay>();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setscheduleToDelete] = useState<ScheduleDelete | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    //(สำคัญ) เมื่อ Search หรือ Filter เปลี่ยน ควร reset page กลับไปหน้าแรก
    useEffect(() => {
        handleChangePage(null, 0);
        // หมายเหตุ: ต้องเช็คว่า handleChangePage ของคุณรองรับ event null หรือไม่ 
        // ถ้าไม่รองรับ อาจต้องใช้ setPage(0) ตรงๆ (ถ้า useTable expose ออกมา)
    }, [searchQuery, filterStatus]);

    // const { data: response, isLoading, isError, refetch } = useSchedule(
    //     page + 1,
    //     rowsPerPage,
    //     sortBy,
    //     sortOrder,
    //     searchQuery,
    //     filterStatus
    // );

    const handleDeleteClick = (schedule: ScheduleDelete) => {
        setscheduleToDelete({ id: schedule.id, name: schedule.name });
        setDeleteModalOpen(true);
    };

    // 2. เมื่อกดยืนยันใน Modal
    const handleConfirmDelete = async () => {
        if (!scheduleToDelete) return;

        setIsDeleting(true);
        try {
            await scheduleService.delete(scheduleToDelete.id);

            // ลบสำเร็จ -> ปิด Modal -> โหลดตารางใหม่
            setDeleteModalOpen(false);
            setscheduleToDelete(null);
            //refetch(); // *สำคัญ* ดึงข้อมูลใหม่

        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete schedule"); // หรือใช้ Snackbar/Toast
        } finally {
            setIsDeleting(false);
        }
    };

    // MOCK DATA
    const mockSchedules: ScheduleDisplay[] = [
        {
            id: 1,
            project_id: 100,
            name: "Daily Security Scan",
            atk_type: "network",
            job_status: { failed: 1, finished: 10, ongoing: 2, scheduled: 3 },
            start_date: new Date("2025-01-01T00:00:00Z"),
            end_date: new Date("2025-01-01T00:00:00Z"),
        },
        {
            id: 2,
            project_id: 100,
            name: "Weekly Web Scan",
            atk_type: "web",
            job_status: { failed: 0, finished: 5, ongoing: 0, scheduled: 1 },
            start_date: new Date("2025-01-05T00:00:00Z"),
            end_date: new Date("2025-12-31T23:59:59Z"),
        },
        {
            id: 3,
            project_id: 101,
            name: "Monthly Infra Audit",
            atk_type: "infra",
            job_status: { failed: 2, finished: 3, ongoing: 0, scheduled: 0 },
            start_date: new Date("2025-01-10T00:00:00Z"),
            end_date: new Date("2025-01-10T00:00:00Z"),
        },
        {
            id: 4,
            project_id: 101,
            name: "API Vulnerability Scan",
            atk_type: "api",
            job_status: { failed: 0, finished: 8, ongoing: 1, scheduled: 2 },
            start_date: new Date("2025-01-15T00:00:00Z"),
            end_date: new Date("2025-01-15T00:00:00Z"),
        },
        {
            id: 5,
            project_id: 102,
            name: "Cloud Asset Scan",
            atk_type: "cloud",
            job_status: { failed: 0, finished: 12, ongoing: 0, scheduled: 0 },
            start_date: new Date("2025-01-20T00:00:00Z"),
            end_date: new Date("2025-01-20T00:00:00Z"),
        },
        {
            id: 6,
            project_id: 102,
            name: "Internal Network Test",
            atk_type: "network",
            job_status: { failed: 3, finished: 4, ongoing: 1, scheduled: 1 },
            start_date: new Date("2025-01-25T00:00:00Z"),
            end_date: new Date("2025-01-25T00:00:00Z"),
        },
        {
            id: 7,
            project_id: 103,
            name: "External Pentest",
            atk_type: "web",
            job_status: { failed: 1, finished: 6, ongoing: 0, scheduled: 0 },
            start_date: new Date("2025-02-01T00:00:00Z"),
            end_date: new Date("2025-06-01T00:00:00Z"),
        },
        {
            id: 8,
            project_id: 103,
            name: "Compliance Scan",
            atk_type: "infra",
            job_status: { failed: 0, finished: 9, ongoing: 0, scheduled: 2 },
            start_date: new Date("2025-02-05T00:00:00Z"),
            end_date: new Date("2025-02-05T00:00:00Z"),
        },
        {
            id: 9,
            project_id: 104,
            name: "Container Image Scan",
            atk_type: "cloud",
            job_status: { failed: 0, finished: 15, ongoing: 0, scheduled: 0 },
            start_date: new Date("2025-02-10T00:00:00Z"),
            end_date: new Date("2025-02-10T00:00:00Z"),
        },
        {
            id: 10,
            project_id: 104,
            name: "Zero Trust Validation",
            atk_type: "network",
            job_status: { failed: 2, finished: 7, ongoing: 1, scheduled: 0 },
            start_date: new Date("2025-02-15T00:00:00Z"),
            end_date: new Date("2025-02-15T00:00:00Z"),
        },
        {
            id: 11,
            project_id: 105,
            name: "Mobile App Security Test",
            atk_type: "mobile",
            job_status: { failed: 0, finished: 4, ongoing: 0, scheduled: 1 },
            start_date: new Date("2025-02-20T00:00:00Z"),
            end_date: new Date("2025-02-20T00:00:00Z"),
        },
        {
            id: 12,
            project_id: 105,
            name: "Red Team Simulation",
            atk_type: "advanced",
            job_status: { failed: 1, finished: 2, ongoing: 1, scheduled: 0 },
            start_date: new Date("2025-03-01T00:00:00Z"),
            end_date: new Date("2025-03-31T23:59:59Z"),
        },
    ];

    // ดึง items และ total จาก response (Handle กรณี response เป็น undefined)
    // const allSchedules = response || [];   // On prod use this one
    const allSchedules = mockSchedules;
    // const totalCnt = response?.length || 0;  // On prod use this one
    const totalCnt = mockSchedules?.length || 0;

    // if (isLoading) {
    //     return (
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //             {/* Skeleton Loader แบบบ้านๆ */}
    //             {[1, 2, 3].map((i) => (
    //                 <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
    //             ))}
    //         </div>
    //     );
    // }

    // if (isError) {
    //     return (
    //         <div className="p-8 border border-red-200 bg-red-50 text-red-600 rounded-lg text-center">
    //             เกิดข้อผิดพลาดในการดึงข้อมูล ไม่สามารถเชื่อมต่อกับ Backend ได้
    //         </div>
    //     );
    // }

    if (totalCnt === 0) {
        // ... แสดงหน้า Empty State ตามเดิม ...
        return <div className="text-center py-10">ไม่พบตารางเวลา</div>;
    }

    return (
        <div>
            <ScheduleTable
                data={allSchedules}           // ข้อมูล Array ของหน้านั้นๆ
                totalCount={totalCnt}   // จำนวนข้อมูลทั้งหมดใน DB (เพื่อคำนวณจำนวนหน้า)

                // State
                page={page}
                rowsPerPage={rowsPerPage}
                sortBy={sortBy}
                sortOrder={sortOrder}

                // Functions (Actions)
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onSort={handleSort}
                onDeleteClick={handleDeleteClick}
            />
            {/* เรียกใช้ Generic Modal */}
            {scheduleToDelete && (
                <GenericDeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}

                    // --- จุดที่ส่งข้อมูล ---
                    entityType="Project"             // บอกว่าเป็น "Project"
                    entityName={scheduleToDelete.name} // ส่งชื่อโปรเจกต์ไป
                    loading={isDeleting}
                />
            )}
        </div>
    );
}