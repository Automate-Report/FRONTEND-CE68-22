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

  const { data: project, isLoading: isProjectLoading, isError } = useProject(projectId);

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

  return (
    <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl font-sans pb-10">
      
      {/* Section 1: Breadcrumbs */}
      <GenericBreadcrums items={breadcrumbItems} />

      {/* Section 2: Header */}
      <Box mb={4} mt={2}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 1 }}>All Issues</Typography>
        <Typography variant="body1" sx={{ color: "#9AA6A8" }}>
          Analyze and manage security vulnerabilities detected in this project.
        </Typography>
      </Box>

      {/* Section 3: Overview Cards */}
      <VulnerabilitySummary 
        projectId={projectId} 
        currentFilter={statusFilter}
        onFilterChange={(newFilter: string) => setStatusFilter(newFilter)}
      />

      {/* Section 4: Search and Filter Toolbar */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField 
          placeholder="Search by issue name or URL..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            flex: 2, bgcolor: "#1A1E23", borderRadius: "8px", 
            "& .MuiOutlinedInput-root": { color: "#FBFBFB", "& fieldset": { borderColor: "#404F57" } } 
          }}
          InputProps={{ startAdornment: <SearchIcon sx={{ color: "#404F57", mr: 1 }} /> }}
        />
        
        {/* Status Filter */}
        <Select 
          value={statusFilter} 
          size="small" 
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ flex: 1, bgcolor: "#1A1E23", color: "#FBFBFB", "& fieldset": { borderColor: "#404F57" } }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="tp">True Positive</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="fixed">Fixed</MenuItem>
        </Select>
      </Stack>

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