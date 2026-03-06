"use client";

import { Box, Typography, Stack, Button, IconButton, Chip, Tooltip } from "@mui/material";
import { 
  Description as ReportIcon, 
  CalendarMonth as CalendarIcon, 
  Download as DownloadIcon, 
  DeleteOutline as DeleteIcon,
  CheckCircle as ReadyIcon,
  EditOutlined as EditIcon,
  PersonOutline as PersonIcon
} from "@mui/icons-material";
import { UsernameDisplay } from "../users/UsernameDisplay";

interface ReportCardProps {
  report: any;
  onEdit: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (report: any) => void;
}

export function ReportCard({ report, onEdit, onDownload, onDelete }: ReportCardProps) {
  const isFinal = report.status === 'final';

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderRadius: "12px",
        bgcolor: "rgba(16, 185, 129, 0.02)", 
        border: "1px solid rgba(16, 185, 129, 0.1)", 
        transition: "0.2s",
        "&:hover": { 
          bgcolor: "rgba(16, 185, 129, 0.05)",
          borderColor: "rgba(16, 185, 129, 0.3)",
          transform: "translateX(4px)"
        }
      }}
    >
      {/* Left: Icon & Info Section */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Box 
          sx={{ 
            width: 48, height: 48, borderRadius: "10px", 
            bgcolor: "rgba(16, 185, 129, 0.1)", 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          <ReportIcon sx={{ color: "#34D399", fontSize: 26 }} />
        </Box>
        
        <Box>
          <Typography sx={{ color: "#FBFBFB", fontWeight: 600, fontSize: '0.95rem' }}>
            {report.file_name || report.name}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
            <Chip 
              label="Executive Summary" 
              size="small" 
              sx={{ 
                height: 20, fontSize: '10px', fontWeight: 600,
                bgcolor: "rgba(154, 166, 168, 0.1)", color: "#9AA6A8", borderRadius: '6px' 
              }} 
            />
            {/* ✅ แสดงชื่อผู้สร้างด้วย UsernameDisplay */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonIcon sx={{ fontSize: 14, color: "#404F57" }} />
              <UsernameDisplay 
                userId={report.created_by} 
                onClick={(e) => e.stopPropagation()} 
                color="#9AA6A8"
              />
            </Stack>
            <Typography variant="caption" sx={{ color: "#404F57", display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 14 }} /> 
              {report.created_at || "Just now"}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* Right: Status & Action Buttons */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip 
          icon={<ReadyIcon sx={{ fontSize: '14px !important', color: isFinal ? '#34D399 !important' : '#FFCC00 !important' }} />}
          label={isFinal ? "Ready" : "Draft"} 
          size="small" 
          sx={{ 
            bgcolor: isFinal ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 204, 0, 0.1)", 
            color: isFinal ? "#34D399" : "#FFCC00", 
            fontWeight: 700, borderRadius: '6px'
          }} 
        />

        {!isFinal && (
          <IconButton 
            size="small" 
            onClick={() => onEdit(report.id)}
            sx={{ color: "#34D399", "&:hover": { bgcolor: "rgba(16, 185, 129, 0.1)" } }}
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        <Button 
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => onDownload(report.id)}
          sx={{ 
            color: "#34D399", borderColor: "rgba(5, 150, 105, 0.4)", 
            fontSize: '12px', textTransform: 'none', fontWeight: 700,
            borderRadius: '8px', px: 1.5,
            "&:hover": { bgcolor: "rgba(6, 78, 59, 0.3)", borderColor: "#34D399" }
          }}
        >
          Download
        </Button>

        <IconButton 
          size="small" 
          onClick={() => onDelete(report)}
          sx={{ color: "#F87171", "&:hover": { bgcolor: "rgba(248, 113, 113, 0.1)" } }}
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Box>
  );
}