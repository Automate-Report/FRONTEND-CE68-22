"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericFilterButton } from "@/src/components/Common/FilterButton";
import SearchBox from "@/src/components/Common/GenericSearchBox";

import { PenTestLogList } from "@/src/components/logs/LogList";


import SearchIcon from '@mui/icons-material/Search';

interface PageProps{
    params: Promise<{ id: string}>;
}

export default function ProjectsLogsPage({ params }: PageProps) {
    // Search
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const filterOptions = [
      { label: "All Status", value: "ALL" },
      { label: "Success", value: "success" },
      { label: "Failed", value: "fail" },
    ];

    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);

    const { data: project, isLoading, isError} = useProject(projectId);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Log not found</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/main"},
        { label: project.name , href: undefined}
    ];

    const handleFilterChange = (value: string) => {
      setStatusFilter(value);
    };

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">
            
            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            <div className="font-bold text-[36px]">
              Log
            </div>

            <div className="my-6 flex justify-between">
              <div className="relative w-2/4">
                <SearchBox 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                  placeholder="Search Logs"
                  className="w-full max-w-md"
                />
              </div>
              <div className="flex gap-8 items-center">
                <GenericFilterButton 
                  options={filterOptions} 
                  currentValue={statusFilter} 
                  onSelect={handleFilterChange}
                />
              </div>
            </div>

            <PenTestLogList 
              searchQuery={searchQuery}
              filterStatus={statusFilter}
              project_id={projectId}
            />
        </div>
  );
}
