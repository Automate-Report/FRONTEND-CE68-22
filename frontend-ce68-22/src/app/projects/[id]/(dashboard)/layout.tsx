import { ReactNode } from "react";
import { SideBar } from "@/src/components/SideBar";
import { projectService } from "@/src/services/project.service";
import { redirect } from "next/navigation";
import { getMe } from "@/src/services/auth.service";

interface ProjectLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}


export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  
  let projectName = "Unknown Project";
  let unauthorized = false;

  try {
    const project = await projectService.getById(projectId);
    projectName = project.name;
  } catch (error: any) {
    const status = error.response?.status || error.status;
    if (status === 401) {
      unauthorized = true; // ตั้ง Flag ไว้
    }
  }

  // ห้ามเอา redirect ไว้ใน try-catch เด็ดขาด
  if (unauthorized) {
    redirect("/login"); 
  }

  return (
    <div className="flex h-full w-full bg-[#0F1518] overflow-hidden">
      <SideBar project_id={projectId} project_name={projectName} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-12 mt-0">{children}</div>
      </main>
    </div>
  );
}