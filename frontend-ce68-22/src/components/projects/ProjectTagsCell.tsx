import { Box, Chip, CircularProgress } from "@mui/material";

import { useProjectsTag } from "@/src/hooks/project/use-projectTags";

import { Tag } from "@/src/types/tag";


interface ProjectTagsCellProps {
  projectId: number;
}

export const ProjectTagsCell = ({ projectId }: ProjectTagsCellProps) => {
  // เรียก Hook ได้แล้ว เพราะนี่คือ React Component
  const { data: tags, isLoading } = useProjectsTag(projectId); 

  if (isLoading) {
    return <CircularProgress size={14} color="inherit" />;
  }

  if (!tags || tags.length === 0) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <Box sx={{ 
      display: "flex", 
      flexWrap: "wrap", // หัวใจสำคัญ: สั่งให้ปัดบรรทัดใหม่ถ้าพื้นที่ไม่พอ
      gap: 1,           // ระยะห่างระหว่าง Tag
      alignItems: "center"
    }}>
      {tags.map((tag: Tag) => {
        return (<Box
          key={tag.id}
          sx={{
            backgroundColor: "#272D31", // สีพื้นหลัง Tag (ปรับตาม Theme)
            color: "#6EDD99",           // สีตัวอักษร
            borderRadius: "8px",        // ความมน
            padding: "6px 12px",         // ระยะห่างภายในเพื่อให้กล่องพอดีตัวอักษร
            fontSize: "16px",
            fontWeight: 600,
            whiteSpace: "nowrap",       // ห้ามตัดคำใน Tag เดียวกัน
            maxWidth: "100%",           // กัน Tag ยาวเกิน
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {tag.name}
        </Box>);
      })}
    </Box>
  );
};