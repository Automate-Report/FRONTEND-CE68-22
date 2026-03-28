"use client";

import { useReportDownload } from "@/src/hooks/report/use-ReportDownload";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from "../icon/Delete";

interface Props {
  row: any; // หรือใส่ Type Worker ที่ถูกต้อง
  onDeleteClick: (row: any) => void;
  projectId: number;
}

export default function ReportRowActions({ row, onDeleteClick, projectId }: Props) {
  // ✅ เรียก Hook ตรงนี้ได้ เพราะเป็น Component
  const { downloadReport, isLoading } = useReportDownload(projectId);

  return (
    <div className="flex items-center justify-end gap-6 pr-4">
        {/* Download Button */}
        <Button 
            onClick={() => downloadReport(row.id, "pdf", projectId, row.name)} // เรียกฟังก์ชันจาก Hook
            disabled={isLoading}
            sx={{ 
                minWidth: 0,
                padding: 0,
                margin: 0,
                color: "#404F57",
                "&:hover": { backgroundColor: "transparent", color: "#2e7d32" } 
            }}
            disableRipple
        >
            {/* เช็ค Loading เพื่อเปลี่ยนไอคอน */}
            {isLoading ? (
            <CircularProgress size={24} color="inherit" />
            ) : (
                <DownloadIcon />
            )}
        </Button>

      {/* Delete Button */}
      <div 
        className="cursor-pointer"
        onClick={() => onDeleteClick(row)}
        >
            <DeleteIcon />
        </div>

      
      
    </div>
  );
}