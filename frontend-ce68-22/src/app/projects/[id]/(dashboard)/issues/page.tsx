"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Typography, Stack,
  TextField, MenuItem, Select,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

import { useProject } from "@/src/hooks/project/use-project";
import { useVulns } from "@/src/hooks/vuln/use-vulns";
import { useDebounce } from "@/src/hooks/use-debounce";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { VulnIssueTable } from "@/src/components/vulns/VulnIssueTable";
import { VulnerabilitySummary } from "@/src/components/vulns/VulnerabilitySummary";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { INPUT_BOX_WITH_ICON_STYLE_DIV, INPUT_BOX_WITH_ICON_STYLE_INPUT } from "@/src/styles/inputBoxStyle";
import MagIcon from "@/src/components/icon/MagnifyingGlass";
import { FILTER_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import FilterIcon from "@/src/components/icon/Filter";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectsIssuePage({ params }: PageProps) {
  const resolveParams = use(params);
  const projectId = parseInt(resolveParams.id);

  // --- Pagination & Filter States ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12); // ตั้งค่าเริ่มต้น 12 ตามความกว้างหน้าจอ
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: project, isLoading: isProjectLoading, isError } = useProject(projectId);

  const filterOptions = [
    { label: "All Issues", value: "ALL" },
    { label: "Open", value: "open" },
    { label: "True Positive", value: "tp" },
    { label: "In Progress", value: "in_progress" },
    { label: "Fixed", value: "fixed" },
  ];

  // --- Data Fetching ---
  const { data, isLoading: isVulnLoading } = useVulns(
    projectId,
    page + 1, // API รับ 1-based index
    rowsPerPage,
    "updated_at",
    "desc",
    debouncedSearch,
    statusFilter
  );

  const issues = data?.items || [];
  const totalCount = data?.total || 0;

  // --- Handlers ---
  const handlePageChange = (newPage: number, currentRowsPerPage: number) => {
    setPage(newPage);
    setRowsPerPage(currentRowsPerPage);
  };

  const handleRowsPerPageChange = (newSize: number) => {
    setRowsPerPage(newSize);
    setPage(0); // กลับไปหน้าแรกเมื่อเปลี่ยนจำนวนแถว
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (value?: string) => {
    if (value) {
      setStatusFilter(value);
    }
    setAnchorEl(null);
  };

  // รีเซ็ตหน้ากลับไปที่หน้าแรกเมื่อค้นหาหรือกรองข้อมูลใหม่
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, statusFilter]);

  if (isProjectLoading) return <div className="p-8 text-[#8FFF9C]">Loading...</div>;
  if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project.name, href: `/projects/${projectId}/overview` },
    { label: "All Issues", href: undefined }
  ];

  return (
    <div className="flex flex-col w-full text-[#E6F0E6]">

      {/* Section 1: Breadcrumbs */}
      <GenericBreadcrums items={breadcrumbItems} />

      {/* Section 2: Header */}
      <div className="w-full flex flex-col mb-6">
        <h1 className="font-bold text-[36px]">
          All Issues
        </h1>
        <p className="text-[#9AA6A8]">Analyze and manage security vulnerabilities detected in this project.</p>
      </div>

      {/* Section 3: Overview Cards */}
      <VulnerabilitySummary
        projectId={projectId}
        currentFilter={statusFilter}
        onFilterChange={(newFilter: string) => setStatusFilter(newFilter)}
      />

      {/* Section 4: Search and Filter Toolbar */}
      <div className="mb-6 flex justify-between">

        {/* Search bar */}
        <div className={INPUT_BOX_WITH_ICON_STYLE_DIV}>
          <MagIcon />
          <input
            type="text"
            placeholder="Search Projects"
            className={INPUT_BOX_WITH_ICON_STYLE_INPUT}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="relative">
          {/* Trigger */}
          <button
            onClick={handleFilterClick}
            className={`${FILTER_BUTTON_STYLE} whitespace-nowrap min-w-[130px] justify-center`}
          >
            {filterOptions.find(opt => opt.value === statusFilter)?.label || "Filter"}
            <FilterIcon />
          </button>

          {/* Dropdown Menu */}
          {Boolean(anchorEl) && (
            <div className="absolute z-10 mt-1 w-full bg-[#0F1518] border-[2px] border-[#404F57]
                                rounded-xl shadow max-h-48 overflow-auto">
              {filterOptions.map(opt => (
                <div
                  key={String(opt.value)}
                  onClick={() => {
                    handleFilterClose(opt.value)
                  }}
                  className={`relative flex items-center h-[42px] rounded-xl pl-3 shadow-sm transition text-[#E6F0E6] placeholder-[#9AA6A8] focus:outline-none
                                        hover:bg-[#1D2226] cursor-pointer
                                        ${statusFilter === opt.value
                      ? "bg-[#2D353B] font-semibold hover:bg-[#2D353B]"
                      : ""
                    }`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 5: Table of Issues */}
      <VulnIssueTable
        issues={issues}
        projectId={projectId}
        isLoading={isVulnLoading}
      />

      {/* Section 6: Pagination */}
      {totalCount > 0 && (
        <GenericPagination
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[12, 24, 48]}
          labelRowsPerPage="Issues per page:"
        />
      )}
    </div>
  );
}