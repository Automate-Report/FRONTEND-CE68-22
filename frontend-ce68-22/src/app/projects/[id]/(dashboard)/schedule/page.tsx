"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useSchedule } from "@/src/hooks/schedule/use-schedule";
import { scheduleService } from "@/src/services/schedule.service";
import { ScheduleDelete } from "@/src/types/schedule";
import { useProjectRole } from "@/src/context/ProjectDetailConext";
import { redirect } from "next/navigation";

//components
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { GenericFilterButton } from "@/src/components/Common/FilterButton";
import SearchBox from "@/src/components/Common/GenericSearchBox";

//icons
import CreateScheduleIcon from "@/src/components/icon/CreateSchedule";
import { ScheduleCard } from "@/src/components/schedule/ScheduleCard";
import { showToast } from "@/src/components/Common/ToastContainer";
import { Close, Delete } from "@mui/icons-material";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectSchedulePage({ params }: PageProps) {
  const { role } = useProjectRole();
  const router = useRouter();
  const resolvePrams = use(params);
  const projectId = parseInt(resolvePrams.id);

  if (role?.toLowerCase() === "developer") {
    redirect(`/projects/${projectId}/overview`)
  }

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const filterOptions = [
    { label: "All Status", value: "ALL" },
    { label: "Not Repeat", value: "not_repeat" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
  ];

  // --- Pagination States ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (newPage: number, newSize: number) => {
    setPage(newPage);
    setRowsPerPage(newSize);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // --- End of Pagination ----

  // Fetch Data
  const { data: project, isLoading, isError } = useProject(projectId);
  const { data: schedules, refetch } = useSchedule(projectId, page + 1, rowsPerPage, searchQuery, statusFilter);

  // --- Delete Related ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setscheduleToDelete] = useState<ScheduleDelete | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      showToast({
        icon: <Delete sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
        message: `Schedule "${scheduleToDelete.name}" deleted successfully!`,
        borderColor: "#8FFF9C",
        duration: 6000,
      });
      // ลบสำเร็จ -> ปิด Modal -> โหลดตารางใหม่
      setDeleteModalOpen(false);
      setscheduleToDelete(null);
      refetch(); // *สำคัญ* ดึงข้อมูลใหม่

    } catch (error) {
      showToast({
        icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
        message: "Failed to delete schedule :(",
        borderColor: "#FE3B46",
        duration: 6000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // --- End of Delete Related ---

  useEffect(() => {
    if (schedules) {
      setTotalItems(schedules.total);
    }
  }, [schedules]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project.name, href: undefined }
  ];

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

  return (
    <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

      {/* Section 1: Breadcrumbs */}
      <div className="w-full">
        <GenericBreadcrums items={breadcrumbItems} />
      </div>

      {/* Section 2: Headline */}
      <div className="w-full flex flex-col gap-3">
        <h1 className="font-bold text-[36px]">
          Schedule
        </h1>
      </div>

      {/* Section 3: Search and Buttons */}
      <div className="my-6 flex justify-between">

        {/* Search bar */}
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Schedules"
          className="w-full max-w-md"
        />

        {/* Buttons */}
        <div className="flex gap-8 items-center">
          <GenericFilterButton
            options={filterOptions}
            currentValue={statusFilter}
            onSelect={handleFilterChange}
          />

          <GenericGreenButton
            name="New Schedule"
            href={`/projects/${projectId}/schedule/create`}
            icon={<CreateScheduleIcon />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-4">
        {schedules?.items.map((schedule, index) => (
          <div
            key={schedule.id}
            onClick={() => router.push(`/projects/${schedule.project_id}/schedule/${schedule.id}`)}
            className="cursor-pointer"
          >
            <ScheduleCard schedule={schedule} onDelete={handleDeleteClick} index={index} />
          </div>
        ))}
      </div>

      <GenericPagination
        count={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={(newSize) => handlePageChange(0, newSize)}
        labelRowsPerPage="Schedules per page:"
      />

      {scheduleToDelete && (
        <GenericDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}

          // --- จุดที่ส่งข้อมูล ---
          entityType="Schedule"
          entityName={scheduleToDelete.name}
          loading={isDeleting}
        />
      )}

    </div>
  );
}
