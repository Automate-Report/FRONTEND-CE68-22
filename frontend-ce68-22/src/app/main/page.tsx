"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import CreateProjectIcon from "@/src/components/icon/CreateProject";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import SearchBox from "@/src/components/Common/GenericSearchBox";
import { GenericFilterButton } from "@/src/components/Common/FilterButton";

import { useDebounce } from "@/src/hooks/use-debounce";
import { getMe } from "@/src/services/auth.service";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { projectService } from "@/src/services/project.service";
import { ProjectSummary } from "@/src/types/project";
import { Box, CircularProgress, Typography } from "@mui/material";


export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [displayName, setDisplayName] = useState<string>("");

  // --- Pagination States ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalItems, setTotalItems] = useState(0);


  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const filterOptions = [
    { label: "All Role", value: "ALL" },
    { label: "Owner", value: "owner" },
    { label: "Pentester", value: "pentester" },
    { label: "Developer", value: "developer" },
  ];

  const debouncedSearch = useDebounce(searchQuery, 500);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: 0, name: "" });

  // ดึงข้อมูลโปรเจกต์
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      // ใช้ page + 1 สำหรับ API Call เสมอ
      const data = await projectService.getAll(
        page + 1,
        rowsPerPage,
        "updated_at",
        "desc",
        debouncedSearch,
        statusFilter
      );
      setProjects(data.items || []);
      setTotalItems(data.total || 0);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page, rowsPerPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // รีเซ็ตหน้ากลับไปที่หน้าแรกเมื่อค้นหาหรือกรองข้อมูลใหม่
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response && response.name) setDisplayName(response.name);
      } catch (error) {
        setDisplayName("Guest User");
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  // เลื่อนขึ้นบนสุดเมื่อเปลี่ยนหน้า
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    handlePageChange(0, rowsPerPage); // รีเซ็ตไปหน้าแรกเสมอเมื่อฟิลเตอร์เปลี่ยน
  };

  const openDeleteConfirm = (id: number, name: string) => {
    setDeleteModal({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    try {
      await projectService.delete(deleteModal.id);
      setDeleteModal({ ...deleteModal, open: false });
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  // จัดการการเปลี่ยนหน้าผ่าน GenericPagination
  const handlePageChange = (newPage: number, newSize: number) => {
    setPage(newPage);
    setRowsPerPage(newSize);
  };

  return (
    <div className="bg-[#0F1518] mt-6 mx-12 min-h-screen flex flex-col">
      {/* Welcome Header */}
      <div className="text-4xl text-[#E6F0E6] font-bold pb-10">
        {displayName ? (
          <>Welcome Back, <span className="text-[#8FFF9C]">{displayName}</span>!</>
        ) : (
          <span className="opacity-50 animate-pulse">Setting up your workspace...</span>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 text-[#E6F0E6]">
        <div className="flex justify-between items-center pr-5 flex-1">

          {/* Search bar */}
          <SearchBox 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search Projects"
            className="w-full max-w-md"
          />

          <GenericFilterButton 
            options={filterOptions} 
            currentValue={statusFilter} 
            onSelect={handleFilterChange} 
          />
        </div>

        <GenericGreenButton name="New Project" href="/projects/create" icon={<CreateProjectIcon />} />
      </div>

      {/* Content */}
      <div className="flex-1">
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: "#8FFF9C" }} />
          </Box>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} onDelete={openDeleteConfirm} index={index} />
              ))}
            </div>

            {/* ใช้อินเทอร์เฟซที่คุยกันไว้ใน GenericPagination */}
            <GenericPagination
              count={totalItems}
              page={page}
              rowsPerPage={rowsPerPage}

              // 1. ส่งฟังก์ชันเปลี่ยนหน้า (รับ 2 args: newPage และ currentRowsPerPage)
              onPageChange={handlePageChange}

              // 2. ส่งฟังก์ชันเปลี่ยนขนาด (รับ 1 arg: newSize แล้วเราสั่งให้ Reset หน้าไป 0)
              onRowsPerPageChange={(newSize) => handlePageChange(0, newSize)}

              labelRowsPerPage="Projects per page:"
            />
          </>
        ) : (
          <Box textAlign="center" py={10} sx={{ border: "1px dashed #2D353B", borderRadius: 4 }}>
            <Typography sx={{ color: "#9AA6A8" }}>No projects found matching your criteria.</Typography>
          </Box>
        )}
      </div>

      <GenericDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ ...deleteModal, open: false })}
        onConfirm={handleConfirmDelete}
        entityType="Project"
        entityName={deleteModal.name}
      />
    </div>
  );
}