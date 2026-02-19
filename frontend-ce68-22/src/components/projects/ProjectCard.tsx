"use client";

import React from "react";
import { 
  Card, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip,
  Divider,
  Stack
} from "@mui/material";
import { 
  AccessTime as TimeIcon,
  Storage as AssetIcon,
  ReportProblem as VulnIcon 
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ProjectSummary } from "@/src/types/project";

import EditIcon from "../icon/Edit";
import DeleteProjectIcon from "../icon/Delete";

interface ProjectCardProps {
  project: ProjectSummary;
  onDelete: (id: number, name: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const isOwner = project.role === "owner";

  const handleOpenProject = () => {
    router.push(`/projects/${project.id}/overview`);
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "owner": return { color: "#8FFF9C", bg: "rgba(143, 255, 156, 0.1)", border: "rgba(143, 255, 156, 0.3)" };
      case "pentester": return { color: "#D49CFF", bg: "rgba(212, 156, 255, 0.1)", border: "rgba(212, 156, 255, 0.3)" };
      case "developer": return { color: "#70CFFF", bg: "rgba(112, 207, 255, 0.1)", border: "rgba(112, 207, 255, 0.3)" };
      default: return { color: "#EDF6EE", bg: "rgba(237, 246, 238, 0.1)", border: "rgba(237, 246, 238, 0.2)" };
    }
  };

  const roleStyle = getRoleStyle(project.role);

  return (
    <Card 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: "#272D31", 
        border: "1px solid #404F57",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative", 
        transition: "all 0.2s ease-in-out",
        cursor: 'pointer',
        "&:hover": {
          borderColor: roleStyle.color,
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px ${roleStyle.bg.replace('0.1', '0.4')}`
        }
      }}
      onClick={handleOpenProject}
    >
      {/* --- Role Badge: มุมขวาบนสุดของ Card --- */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
        <Chip 
          label={project.role.toUpperCase()} 
          sx={{ 
            bgcolor: roleStyle.bg, 
            color: roleStyle.color, 
            fontWeight: 900, 
            fontSize: "10px", 
            borderRadius: "6px",
            border: `1px solid ${roleStyle.border}`,
            height: '22px',
          }} 
        />
      </Box>

      {/* --- ฝั่งซ้าย: ข้อมูลเนื้อหาหลัก (สัดส่วน 2) --- */}
      <Box sx={{ flex: 2, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <Box>
          {/* 1. ชื่อ Project */}
          <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: "bold", lineHeight: 1.2, mb: 0.5, pr: 10 }} noWrap>
            {project.name}
          </Typography>

          {/* 2. Tags อยู่ใต้ชื่อ Project */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2} alignItems="center">
            {project.tags?.slice(0, 5).map((tag, index) => (
              <Chip
                key={`tag-${index}`}
                label={tag.name}
                size="small"
                sx={{
                  height: '18px',
                  fontSize: '9px',
                  fontWeight: 800,
                  bgcolor: tag.bg_color || "#404F57",
                  color: tag.text_color || "#EDF6EE",
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            ))}
            {project.tags && project.tags.length > 5 && (
              <Typography variant="caption" sx={{ color: "#404F57", fontWeight: "bold", fontSize: '10px' }}>
                +{project.tags.length - 5}
              </Typography>
            )}
          </Stack>

          {/* 3. Description */}
          <Typography variant="body2" sx={{ color: "#9AA6A8", mb: 2, lineHeight: 1.6 }} className="line-clamp-2">
            {project.description || "Establish a robust security baseline with automated testing."}
          </Typography>
        </Box>

        {/* Last Updated */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "rgba(143, 255, 156, 0.7)" }}>
          <TimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Last Updated: {new Date(project.updated_at).toLocaleDateString()}
          </Typography>
        </Stack>
      </Box>

      {/* --- ฝั่งขวา: Stats และ Actions (สัดส่วน 1) --- */}
      <Box 
        sx={{ 
          flex: 1, 
          bgcolor: "#1E2429", 
          borderLeft: { md: "1px solid #404F57" },
          p: 3, 
          pt: 6, // เว้นที่ให้ Role Badge ด้านบน
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: { md: '180px' } 
        }}
      >
        {/* Stats Pocket */}
        <Box 
          sx={{ 
            width: '100%',
            bgcolor: "#0F1518", 
            border: "1px solid rgba(64, 79, 87, 0.4)", 
            borderRadius: "12px", 
            display: 'flex', 
            py: 2
          }}
        >
          <Box flex={1} textAlign="center">
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, letterSpacing: 1, display: 'block', mb: 0.5 }}>ASSETS</Typography>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
              <AssetIcon sx={{ fontSize: 16, color: "#404F57" }} />
              <Typography variant="h5" sx={{ color: "#EDF6EE", fontWeight: "bold" }}>{project.assets_cnt}</Typography>
            </Stack>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#404F57", opacity: 0.5, height: 32, my: 'auto' }} />
          <Box flex={1} textAlign="center">
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, letterSpacing: 1, display: 'block', mb: 0.5 }}>VULNS</Typography>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
              <VulnIcon sx={{ fontSize: 16, color: project.vuln_cnt > 0 ? "#FF3B30" : "#8FFF9C" }} />
              <Typography variant="h5" sx={{ color: project.vuln_cnt > 0 ? "#FF3B30" : "#8FFF9C", fontWeight: "bold" }}>{project.vuln_cnt}</Typography>
            </Stack>
          </Box>
        </Box>

        {/* Action Buttons Zone */}
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          sx={{ height: '40px', width: '100%', mt: 1 }}
        >
          {isOwner ? (
            <Stack direction="row" spacing={2}>
              <Tooltip title="Edit Project">
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); router.push(`/projects/${project.id}/edit`); }}
                  sx={{ color: "#F8F8F8", "&:hover": { color: "#8FFF9C", bgcolor: "rgba(143, 255, 156, 0.1)" } }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Project">
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); onDelete(project.id, project.name); }}
                  sx={{ color: "#F8F8F8", "&:hover": { color: "#FF3B30", bgcolor: "rgba(255,59,48,0.1)" } }}
                >
                  <DeleteProjectIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Typography variant="caption" sx={{ color: "rgba(143, 255, 156, 0.5)", fontWeight: 800, letterSpacing: 1 }}>
              VIEW ONLY
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}