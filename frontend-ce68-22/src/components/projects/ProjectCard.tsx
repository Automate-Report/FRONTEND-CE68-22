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
  Lan as AssetIcon,
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
  const isOwner = project.role === "owner";

  // ฟังก์ชันเลือกสี Role ตามชุดสีที่ให้มา
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "owner": return { color: "#8FFF9C", bg: "rgba(143, 255, 156, 0.1)" };
      case "pentester": return { color: "#AFFFB9", bg: "rgba(175, 255, 185, 0.1)" };
      default: return { color: "#9AA6A8", bg: "rgba(154, 166, 168, 0.1)" };
    }
  };

  const roleStyle = getRoleStyle(project.role);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: "#0B0F12", // Theme Color 1
        border: "1px solid #404F57", // Border Color
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "#8FFF9C",
          transform: "translateY(-5px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header: Name & Role */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
          <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: 700, lineHeight: 1.2 }}>
            {project.name}
          </Typography>
          <Chip 
            label={project.role.toUpperCase()} 
            size="small"
            sx={{ 
              color: roleStyle.color, 
              bgcolor: roleStyle.bg,
              border: `1px solid ${roleStyle.color}40`,
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: 1
            }} 
          />
        </Box>

        {/* Description */}
        <Typography variant="body2" sx={{ color: "#9AA6A8", mb: 3, height: 40 }} className="line-clamp-2">
          {project.description || "No project description available."}
        </Typography>

        {/* Stats Section: Assets & Vulnerabilities */}
        <Box 
          sx={{ 
            display: 'flex', 
            bgcolor: "#0F1518", // Darker pocket for stats
            borderRadius: "8px",
            p: 1.5,
            mb: 2.5,
            border: "1px solid #404F5750"
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 700, display: 'block' }}>ASSETS</Typography>
            <Box display="flex" justifyContent="center" alignItems="center" gap={0.5}>
              <AssetIcon sx={{ fontSize: 16, color: "#9AA6A8" }} />
              <Typography variant="body1" sx={{ color: "#EDF6EE", fontWeight: 700 }}>
                {project.assets_cnt || 0}
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "#404F57", opacity: 0.5 }} />

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 700, display: 'block' }}>VULNS</Typography>
            <Box display="flex" justifyContent="center" alignItems="center" gap={0.5}>
              <VulnIcon sx={{ 
                fontSize: 16, 
                color: (project.vuln_cnt || 0) > 0 ? "#FF3B30" : "#8FFF9C" 
              }} />
              <Typography variant="body1" sx={{ 
                color: (project.vuln_cnt || 0) > 0 ? "#FF3B30" : "#8FFF9C",
                fontWeight: 700 
              }}>
                {project.vuln_cnt || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Updated Info */}
        <Box display="flex" alignItems="center" gap={1} sx={{ color: "#404F57" }}>
          <TimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            LAST UPDATED: {new Date(project.updated_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: "#404F57", opacity: 0.3 }} />

      <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1.5, bgcolor: "rgba(15, 21, 24, 0.5)" }}>
        <Button 
          size="small" 
          startIcon={<OpenIcon />} 
          onClick={() => router.push(`/projects/${project.id}/overview`)}
          sx={{ 
            color: "#8FFF9C", 
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#8FFF9C10" }
          }}
        >
          Explore
        </Button>

        <Box>
          {isOwner ? (
            <>
              <IconButton 
                size="small" 
                onClick={() => router.push(`/projects/${project.id}/edit`)}
                sx={{ color: "#9AA6A8", "&:hover": { color: "#EDF6EE" } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDelete(project.id, project.name)}
                sx={{ color: "#9AA6A8", "&:hover": { color: "#FF3B30" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Chip 
              label="READ ONLY" 
              variant="outlined" 
              size="small" 
              sx={{ height: 20, fontSize: '0.6rem', color: '#404F57', borderColor: '#404F57' }} 
            />
          )}
        </Box>
      </CardActions>
    </Card>
  );
}