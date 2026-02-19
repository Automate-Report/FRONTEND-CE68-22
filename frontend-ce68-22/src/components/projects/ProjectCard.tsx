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
  AccessTime as TimeIcon,
  Storage as AssetIcon,
  BugReport as VulnIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ProjectSummary } from "@/src/types/project";

interface ProjectCardProps {
  project: ProjectSummary;
  onDelete: (id: number, name: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();
  
  // ตรวจสอบสิทธิ์: เฉพาะ owner เท่านั้นที่มีสิทธิ์ลบหรือแก้ไข
  const isOwner = project.role === "owner";

  // กำหนดสไตล์ตาม Role โดยอิงจากชุดสีที่ให้มา
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "owner": return { color: "#8FFF9C", label: "Owner" };
      case "pentester": return { color: "#AFFFB9", label: "Pentester" };
      case "developer": return { color: "#EDF6EE", label: "Developer" };
      default: return { color: "#9AA6A8", label: role };
    }
  };

  const roleStyle = getRoleStyle(project.role);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: "#0B0F12",       // พื้นหลังการ์ดหลัก
        border: "1px solid #404F57", // สีขอบเทาเข้ม
        borderRadius: "16px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#8FFF9C", // เรืองแสงเขียวเมื่อ Hover
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3, pb: 1 }}>
        {/* Header: Project Name & Role Badge */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: "bold", fontSize: "1.15rem", lineHeight: 1.2 }}>
            {project.name}
          </Typography>
          <Chip 
            label={roleStyle.label.toUpperCase()} 
            size="small"
            variant="outlined"
            sx={{ 
              color: roleStyle.color, 
              borderColor: `${roleStyle.color}40`, 
              fontSize: "0.6rem", 
              fontWeight: 800,
              height: '20px',
              bgcolor: "#0F1518"
            }} 
          />
        </Box>

        {/* Tags Section: Limit to 5 tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, minHeight: '24px' }}>
          {project.tags?.slice(0, 5).map((tag, index) => (
          <Chip
            key={`tag-${index}`} // ถ้าไม่มี id ให้ใช้ index แทน
            label={tag.name}
            size="small"
            sx={{
              height: '18px',
              fontSize: '0.6rem',
              bgcolor: tag.bg_color,
              color: tag.text_color,
              border: '1px solid #404F57',
              borderRadius: '4px',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        ))}
          {project.tags && project.tags.length > 5 && (
            <Typography variant="caption" sx={{ color: "#404F57", ml: 0.5, fontSize: '0.65rem' }}>
              +{project.tags.length - 5}
            </Typography>
          )}
        </Box>

        {/* Description */}
        <Typography variant="body2" sx={{ color: "#9AA6A8", mb: 3, minHeight: 40, lineHeight: 1.5 }} className="line-clamp-2">
          {project.description || "No description provided for this project."}
        </Typography>

        {/* Stats Pocket: Assets & Vulnerabilities */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 2.5, 
            p: 2, 
            bgcolor: "#0F1518", // พื้นหลังส่วน Stats
            borderRadius: '12px',
            border: '1px solid #404F5740'
          }}
        >
          {/* Asset Count */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800, letterSpacing: 0.5 }}>ASSETS</Typography>
            <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={0.5}>
              <AssetIcon sx={{ fontSize: 16, color: "#404F57" }} />
              <Typography variant="h6" sx={{ color: "#EDF6EE", fontWeight: 'bold', lineHeight: 1 }}>
                {project.assets_cnt}
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "#404F57", opacity: 0.5 }} />

          {/* Vulnerability Count */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800, letterSpacing: 0.5 }}>VULNS</Typography>
            <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={0.5}>
              <VulnIcon sx={{ 
                fontSize: 16, 
                color: project.vuln_cnt > 0 ? "#FF3B30" : "#8FFF9C" 
              }} />
              <Typography variant="h6" sx={{ 
                color: project.vuln_cnt > 0 ? "#FF3B30" : "#8FFF9C", 
                fontWeight: 'bold', 
                lineHeight: 1 
              }}>
                {project.vuln_cnt}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Updated Timestamp */}
        <Box display="flex" alignItems="center" gap={1} sx={{ color: "#404F57", mb: 1 }}>
          <TimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            LAST UPDATED: {new Date(project.updated_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: "#404F57", mx: 3, opacity: 0.5 }} />

      <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1.5 }}>
        {/* Navigation Button */}
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

        {/* Management Actions: Restricted to Owner */}
        <Box>
          {isOwner ? (
            <Box display="flex" gap={0.5}>
              <Tooltip title="Edit Project">
                <IconButton 
                  size="small" 
                  onClick={() => router.push(`/projects/${project.id}/edit`)}
                  sx={{ color: "#404F57", "&:hover": { color: "#FBFBFB" } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Project">
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(project.id, project.name)}
                  sx={{ color: "#404F57", "&:hover": { color: "#FF3B30" } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box px={1.5}>
              <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800, fontSize: '0.6rem' }}>
                VIEW ONLY
              </Typography>
            </Box>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}