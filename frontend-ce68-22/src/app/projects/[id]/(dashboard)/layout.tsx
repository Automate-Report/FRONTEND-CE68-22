import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Project } from "@/src/types/project";
import { SideBar } from "@/src/components/SideBar";
import { projectService } from "@/src/services/project.service";
import { ProjectDetailProvider } from "@/src/context/ProjectDetailConext";



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

      if (status === 401) {
        isUnauthorized = true;
    }
  }

  // ห้ามเอา redirect ไว้ใน try-catch เด็ดขาด
  if (isUnauthorized) {
    redirect("/login"); 
  }

  return (
    <ProjectDetailProvider role={role}>
      <div className="flex h-[calc(100vh-74px)] w-full bg-[#0F1518]"> 
        
        {/* Sidebar: ล็อคความสูง h-full ของพื้นที่ที่เหลือ */}
        <SideBar project_id={projectId} project_name={projectName} role={role} />

        {/* Main Content: หัวใจหลักของการเลื่อน */}
        <main className="flex-1 pl-[300px] h-full max-w-screen">
          <div className="px-12 py-6"> {/* เปลี่ยนจาก mx-12 มาใช้ px-12 เพื่อกันขอบล้น */}
              {children}
          </div>
        </main>
      </div>
    </ProjectDetailProvider>
    
  );
}