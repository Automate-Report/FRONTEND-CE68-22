"use client";

import { useState, useEffect } from "react";
import { useTable } from "@/src/hooks/use-table";
import { JobDisplay } from "@/src/types/schedule";
import { useGetJobByScheduleID } from "@/src/hooks/schedule/use-getJobByScheduleID";
import { JobListByScheduleTable } from "./JobListByScheduleTable";

//นิยาม Interface สำหรับ Props
interface ScheduleListProps {
    schedule_id: number;
}

export function JobListByScheduleID({ schedule_id }: ScheduleListProps) {

    const {
        page,
        rowsPerPage,
        sortBy,
        sortOrder,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSort,
    } = useTable<JobDisplay>();


    //(สำคัญ) เมื่อ Search หรือ Filter เปลี่ยน ควร reset page กลับไปหน้าแรก
    useEffect(() => {
        handleChangePage(null, 0);
        // หมายเหตุ: ต้องเช็คว่า handleChangePage ของคุณรองรับ event null หรือไม่ 
        // ถ้าไม่รองรับ อาจต้องใช้ setPage(0) ตรงๆ (ถ้า useTable expose ออกมา)
    }, [schedule_id]);

    const { data: response, isLoading, isError } = useGetJobByScheduleID(
        schedule_id,
        page + 1,
        rowsPerPage,
        sortBy,
        sortOrder,
    );

    // ดึง items และ total จาก response (Handle กรณี response เป็น undefined)
    const allJobs = response?.items || [];  
    const totalCnt = response?.total || 0; 

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Skeleton Loader แบบบ้านๆ */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 border border-red-200 bg-red-50 text-red-600 rounded-lg text-center">
                เกิดข้อผิดพลาดในการดึงข้อมูล ไม่สามารถเชื่อมต่อกับ Backend ได้
            </div>
        );
    }

    if (totalCnt === 0) {
        // ... แสดงหน้า Empty State ตามเดิม ...
        return <div className="text-center py-10">ไม่พบตารางเวลา</div>;
    }

    return (
        <div>
            <JobListByScheduleTable
                data={allJobs}           // ข้อมูล Array ของหน้านั้นๆ
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
            />

        </div>
    );
}