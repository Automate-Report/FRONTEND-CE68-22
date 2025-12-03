import { Project } from "../../types/project";
import Link from "next/link";
// import { Eye, Trash2 } from "lucide-react";

interface ProjectTableProps {
  data: Project[];
}

export function ProjectTable({ data = []}: ProjectTableProps) {

  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">ไม่มีข้อมูลโปรเจกต์</div>;
  }

  return (
    // 1. Wrapper: overflow-x-auto ช่วยให้เลื่อนซ้ายขวาได้ในมือถือ
    <div className="overflow-x-auto border rounded-2xl border-[#E6F0E6] shadow-sm">
      <table className=" text-left text-[24px]">

        {/* กำหนดความกว้างในแต่ละ column */}
        <colgroup>
          <col className="w-[65%]" /><col className="w-[25%] md:table-column hidden" /><col className="w-[10%]" />
        </colgroup>
        
        {/* --- Header --- */}
        <thead className=" text-[#EDF6EE]  bg-[#0F1518] border-b">
          <tr>
            <th  className="px-6 py-3d">
              <div className="flex">
                <div>Project Name</div>
                <div>icon</div>
              </div>
            </th>
            {/* ซ่อนในมือถือ แสดงเมื่อจอ md ขึ้นไป */}

            <th  className="px-6 py-3">
              <div className="flex text-center">
                <div>Last Updated</div>
                <div>icon</div>
              </div>   
            </th>
            <th className="px-6 py-3 text-right">
              
            </th>
          </tr>
        </thead>

        {/* --- Body --- */}
        <tbody className="bg-[#FBFBFB] text-[#404F57] divide-y divide-gray-200">
          {data.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50 transition-colors">
        

              {/* Name Column */}
              <td className="px-6 py-4">
                <div>{project.name}</div>
                {/* Mobile description (แสดงเฉพาะจอมือถือ) */}
                {/* <div className="md:hidden text-xs text-gray-400 mt-1 truncate max-w-[120px]">
                  {project.description}
                </div> */}
              </td>


              {/* Date Column */}
              <td className="text-center px-6 py-4 whitespace-nowrap">
                {new Date(project.updated_at).toLocaleDateString("th-TH")}
              </td>

              {/* Action Column */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <div>Edit Icon</div>
                  <div>Delete Icon</div>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}