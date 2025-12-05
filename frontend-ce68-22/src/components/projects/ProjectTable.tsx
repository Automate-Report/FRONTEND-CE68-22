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
    <div className="overflow-x-auto rounded-2xl border border-[#E6F0E6] shadow-sm">
      <table className="w-full text-left text-[24px]">

        {/* Column width rules */}
        <colgroup>
          <col className="w-[65%]" />
          <col className="w-[25%] hidden md:table-column" />
          <col className="w-[10%]" />
        </colgroup>

        {/* Header */}
        <thead className="bg-[#0F1518] text-[#EDF6EE] border-b">
          <tr>
            <th className="px-6 py-3">
              <div className="flex items-center gap-2">
                <span>Project Name</span>
                <span>icon</span>
              </div>
            </th>

            <th className="px-6 py-3 hidden md:table-cell">
              <div className="flex items-center justify-center gap-2">
                <span>Last Updated</span>
                <span>icon</span>
              </div>
            </th>

            <th className="px-6 py-3 text-right"></th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-[#FBFBFB] text-[#404F57] divide-y divide-gray-200">
          {data.map((project) => (
            <tr
              key={project.id}
              className="transition-colors hover:bg-gray-50"
            >
              {/* Name */}
              <td className="px-6 py-4">
                <div>{project.name}</div>
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-center whitespace-nowrap hidden md:table-cell">
                {new Date(project.updated_at).toLocaleDateString("th-TH")}
              </td>

              {/* Actions */}
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