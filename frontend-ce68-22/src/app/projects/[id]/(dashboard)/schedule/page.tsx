"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { ScheduleList } from "@/src/components/schedule/ScheduleList";
import { INPUT_BOX_WITH_ICON_STYLE_DIV, INPUT_BOX_WITH_ICON_STYLE_INPUT } from "@/src/styles/inputBoxStyle";
import { FILTER_BUTTON_STYLE } from "@/src/styles/buttonStyle";

//icons
import CreateScheduleIcon from "@/src/components/icon/CreateSchedule";
import MagIcon from "@/src/components/icon/MagnifyingGlass";
import FilterIcon from "@/src/components/icon/Filter";
import { ScheduleCard } from "@/src/components/schedule/ScheduleCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectSchedulePage({ params }: PageProps) {
  const router = useRouter();

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const resolvePrams = use(params);
  const projectId = parseInt(resolvePrams.id);

  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project.name, href: undefined }
  ];

  const showFilter = () => {
    // Logic to show filter options (e.g., open a modal or dropdown)
    alert("Show filter options");
  }

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
        <div className="flex gap-8 items-center">
          <button
            onClick={showFilter}
            className={FILTER_BUTTON_STYLE}
          >
            Filter <FilterIcon />
          </button>

          <GenericGreenButton
            name="New Schedule"
            href={`/projects/${projectId}/schedule/create`}
            icon={<CreateScheduleIcon />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <ScheduleCard />
      </div>

      {/* Section 4: Table */}
      {/* <ScheduleList
        project_id={projectId}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
      /> */}

    </div>
  );
}
