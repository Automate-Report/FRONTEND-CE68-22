"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip,
  Divider,
  Button
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  OpenInNew as OpenIcon, 
  AccessTime as TimeIcon 
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Project } from "@/src/types/project";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number, name: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();
  
  // ตรวจสอบสิทธิ์: เฉพาะ owner เท่านั้นที่มีสิทธิ์ลบหรือแก้ไข
  const isOwner = project.role === "owner";

  // กำหนดสไตล์ Chip ตาม Role
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "owner": return { color: "#8FFF9C", label: "Owner" };
      case "pentester": return { color: "#A78BFA", label: "Pentester" };
      case "developer": return { color: "#60A5FA", label: "Developer" };
      default: return { color: "#AAAAAA", label: role };
    }
  };

  const roleStyle = getRoleStyle(project.role);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: "#1A1F24",
        border: "1px solid #2D353B",
        borderRadius: "16px",
        transition: "0.2s",
        "&:hover": {
          borderColor: "#8FFF9C",
          transform: "translateY(-4px)"
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" sx={{ color: "#E6F0E6", fontWeight: "bold", fontSize: "1.1rem" }}>
            {project.name}
          </Typography>
          <Chip 
            label={roleStyle.label} 
            size="small"
            variant="outlined"
            sx={{ 
              color: roleStyle.color, 
              borderColor: `${roleStyle.color}40`, 
              fontSize: "0.7rem",
              fontWeight: "bold"
            }} 
          />
        </Box>

        <Typography variant="body2" sx={{ color: "#9AA6A8", mb: 3, minHeight: 40 }} className="line-clamp-2">
          {project.description || "No description provided."}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} sx={{ color: "#666666" }}>
          <TimeIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">
            Updated: {new Date(project.updated_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: "#2D353B", mx: 3 }} />

      <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1.5 }}>
        {/* ทุก Role สามารถกด Open Project ได้ */}
        <Button 
          size="small" 
          startIcon={<OpenIcon />} 
          onClick={() => router.push(`/projects/${project.id}/overview`)}
          sx={{ 
            color: "#8FFF9C", 
            textTransform: "none", 
            fontWeight: "bold",
            "&:hover": { bgcolor: "rgba(143, 255, 156, 0.08)" }
          }}
        >
          Open Project
        </Button>

        {/* ส่วน Action Buttons: จะแสดงผลเฉพาะเมื่อ user เป็น Owner เท่านั้น */}
        <Box>
          {isOwner ? (
            <Box display="flex">
              <Tooltip title="Edit Project">
                <IconButton 
                  size="small" 
                  onClick={() => router.push(`/projects/${project.id}/edit`)}
                  sx={{ color: "#AAAAAA", "&:hover": { color: "white" } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Project">
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(project.id, project.name)}
                  sx={{ color: "#AAAAAA", "&:hover": { color: "#FF3B30" } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            /* กรณีไม่ใช่ Owner สามารถใส่ Badge หรือข้อความเล็กๆ ว่า Read Only ได้ (ถ้าต้องการ) */
            <Typography variant="caption" sx={{ color: "#666666", pr: 1, fontSize: "0.65rem" }}>
              VIEW ONLY
            </Typography>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}