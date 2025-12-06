"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/use-project";

interface PageProps{
    params: Promise<{ id: string}>;
}

export default function ProjectsDetailsPage({ params }: PageProps) {
    const router = useRouter();

    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);

    const { data: project, isLoading, isError} = useProject(projectId);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

    return (
        <div className="mx-auto w-11/12 bg-[#0F1518] text-[#E6F0E6]">
            <div>
                header
            </div>
        {project.name}
        </div>
  );
}
