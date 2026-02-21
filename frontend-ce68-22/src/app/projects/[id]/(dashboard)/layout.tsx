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
    // ใช้ h-[calc(100vh-navbarHeight)] ถ้ามี navbar หรือใช้ h-screen ถ้า navbar อยู่ในหน้า
    // ในกรณีของคุณ navbar อยู่ใน RootLayout ดังนั้นใช้ h-[calc(100vh-74px)] (สมมติ navbar สูง 74px)
    <div className="flex h-[calc(100vh-74px)] w-full overflow-hidden bg-[#0F1518]"> 
      
      {/* Sidebar: ล็อคความสูง h-full ของพื้นที่ที่เหลือ */}
      <SideBar project_id={projectId} project_name={projectName} role={role} />

      {/* Main Content: หัวใจหลักของการเลื่อน */}
      <main className="flex-1 ml-[300px] h-full overflow-y-auto custom-scrollbar">
        <div className="px-12 py-6"> {/* เปลี่ยนจาก mx-12 มาใช้ px-12 เพื่อกันขอบล้น */}
            {children}
        </div>
      </main>
    </div>
  );
}