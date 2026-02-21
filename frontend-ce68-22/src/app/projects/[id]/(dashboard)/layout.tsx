import { ReactNode } from "react";

import { SideBar } from "@/src/components/SideBar";

import { projectService } from "@/src/services/project.service";

import { Project } from "@/src/types/project";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface ProjectLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}


export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");


  let projectName = "Unknown Project";
  let isUnauthorized = false;
  let role: Project["role"] = "owner";

  try {
    const customHeaders = {
            "Cookie": `access_token=${token}`,
            "Cache-Control": "no-cache" // ป้องกันการจำค่า 401 เก่า
    };

    const project = await projectService.getById(projectId, customHeaders);
    projectName = project.name;
    role = project.role;
  } catch (error: any) {
      const status = error.response?.status || error.status;
      console.log("DEBUG: Status Code on Server:", status);

      if (status === 401) {
        isUnauthorized = true;
    }
  }

  // ห้ามเอา redirect ไว้ใน try-catch เด็ดขาด
  if (isUnauthorized) {
    redirect("/login"); 
  }

  return (
    // 1. เพิ่ม h-screen เพื่อล็อคความสูงหน้าจอ และป้องกันการ scroll ทั้งหน้า
    <div className="flex h-screen w-full bg-[#0F1518] overflow-hidden"> 
      
      {/* Sidebar: กว้าง 300px และ fixed */}
      <SideBar 
        project_id={projectId} 
        project_name={projectName}
        role={role}
      />

      {/* Main Content: 
         - ml-[300px]: เว้นที่ว่างทางซ้ายให้ Sidebar 
         - w-[calc(100%-300px)]: ใช้ความกว้างที่เหลือทั้งหมด
         - overflow-y-auto: ให้ scroll เฉพาะเนื้อหาตรงนี้
      */}
      <main className="flex-1 ml-[300px] h-full">
        <div className="p-0 mx-12 mt-6"> 
            {children}
        </div>
      </main>
    </div>
  );
}