import { ReactNode, use } from "react"; // Next.js 15 ใช้ use() กับ params
import { SideBar } from "@/src/components/SideBar"; // ปรับ path ตามจริง
import { projectService } from "@/src/services/project.service";

interface ProjectLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>; // params ใน Layout เป็น Promise
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  // 1. แกะ params ออกมาเพื่อเอา id
  const resolvedParams = await params; 
  const projectId = parseInt(resolvedParams.id);

  let projectName = "Loading...";
  try {
      const project = await projectService.getById(projectId);
      projectName = project.name; // สมมติว่า return object ที่มี field name
  } catch (error) {
      console.error("Failed to fetch project name", error);
      projectName = "Unknown Project"; // กรณีหาไม่เจอ
  }

  return (
    // จัด Layout ให้ Sidebar อยู่ซ้าย Content อยู่ขวา
    <div className="flex h-full w-full bg-[#0F1518] overflow-hidden"> 
      
      {/* 2. Sidebar จะถูก Render ครั้งเดียวตรงนี้และ Fix อยู่กับที่ */}
      <SideBar 
        project_id={projectId} 
        project_name={projectName}
      />

      {/* 3. ส่วนเนื้อหา (Page) จะเปลี่ยนไปเรื่อยๆ ตรงนี้ */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* อาจจะใส่ wrapper อีกชั้นถ้าต้องการ padding หรือ margin แบบเฉพาะเจาะจง */}
        <div className="mx-12 mt-0"> 
            {children}
        </div>
      </main>
      
    </div>
  );
}