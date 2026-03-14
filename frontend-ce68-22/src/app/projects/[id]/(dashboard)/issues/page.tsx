"use client";

import { use, useState, useEffect } from "react";

import { useProject } from "@/src/hooks/project/use-project";
import { useVulns } from "@/src/hooks/vuln/use-vulns";
import { useDebounce } from "@/src/hooks/use-debounce";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { GenericFilterButton } from "@/src/components/Common/FilterButton";
import SearchBox from "@/src/components/Common/GenericSearchBox";

import { VulnIssueTable } from "@/src/components/vulns/VulnIssueTable";
import { VulnerabilitySummary } from "@/src/components/vulns/VulnerabilitySummary";

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

  const { data: project, isLoading: isProjectLoading, isError } = useProject(projectId);

  const [statusFilter, setStatusFilter] = useState("ALL");
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

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

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
        <SearchBox 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search Issues"
          className="w-full max-w-md"
        />

        {/* Filter */}
        <GenericFilterButton 
          options={filterOptions} 
          currentValue={statusFilter} 
          onSelect={handleFilterChange} 
        />
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