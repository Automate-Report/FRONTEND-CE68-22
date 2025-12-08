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
    <div className="flex min-h-screen bg-[#0F1518]"> 
      
      {/* 2. Sidebar จะถูก Render ครั้งเดียวตรงนี้และ Fix อยู่กับที่ */}
      <SideBar project_id={projectId} />

      {/* 3. ส่วนเนื้อหา (Page) จะเปลี่ยนไปเรื่อยๆ ตรงนี้ */}
      <main className="flex-1 p-6 overflow-y-auto h-screen">
        {children}
      </main>
      
    </div>
  );
}