import { ReactNode, use } from "react"; // Next.js 15 ใช้ use() กับ params
import { SideBar } from "@/src/components/SideBar"; // ปรับ path ตามจริง

interface ProjectLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>; // params ใน Layout เป็น Promise
}

export default function ProjectLayout({ children, params }: ProjectLayoutProps) {
  // 1. แกะ params ออกมาเพื่อเอา id
  const { id } = use(params);
  const projectId = parseInt(id);

  return (
    // จัด Layout ให้ Sidebar อยู่ซ้าย Content อยู่ขวา
    <div className="flex h-screen w-full bg-[#0F1518] overflow-hidden"> 
      
      {/* 2. Sidebar จะถูก Render ครั้งเดียวตรงนี้และ Fix อยู่กับที่ */}
      <SideBar project_id={projectId} />

      {/* 3. ส่วนเนื้อหา (Page) จะเปลี่ยนไปเรื่อยๆ ตรงนี้ */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* อาจจะใส่ wrapper อีกชั้นถ้าต้องการ padding หรือ margin แบบเฉพาะเจาะจง */}
        <div className="mr-6 mt-0"> 
            {children}
        </div>
      </main>
      
    </div>
  );
}