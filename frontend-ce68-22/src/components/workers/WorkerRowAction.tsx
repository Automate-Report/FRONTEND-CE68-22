"use client";

import Link from "next/link";
import { useWorkerDownload } from "@/src/hooks/use-WorkerDownload";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from "../icon/Edit";
import DeleteIcon from "../icon/Delete";

interface Props {
  row: any; // หรือใส่ Type Worker ที่ถูกต้อง
  onDeleteClick: (row: any) => void;
}

export default function WorkerRowActions({ row, onDeleteClick }: Props) {
  // ✅ เรียก Hook ตรงนี้ได้ เพราะเป็น Component
  const { downloadWorker, isLoading } = useWorkerDownload();

  return (
    <div className="flex items-center justify-end gap-6 pr-4">
      
      {/* Edit Link */}
      <Link href={`/workers`} className="cursor-pointer"><EditIcon /></Link>

      {/* Delete Button */}
      <div 
        className="cursor-pointer"
        onClick={() => onDeleteClick(row)}
        >
            <DeleteIcon />
        </div>

      {/* Download Button */}
      <Button 
        onClick={() => downloadWorker(row.id, row.name)} // เรียกฟังก์ชันจาก Hook
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
      
    </div>
  );
}