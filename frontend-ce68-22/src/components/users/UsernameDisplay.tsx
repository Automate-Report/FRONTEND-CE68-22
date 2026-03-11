"use client";

import { Typography, Skeleton } from "@mui/material";
import { useUsername } from "@/src/hooks/user/use-Username";

interface UsernameDisplayProps {
  userId: string;
  onClick: (e: React.MouseEvent) => void;
  color?: string;
}

export function UsernameDisplay({ userId, onClick, color = "#FBFBFB" }: UsernameDisplayProps) {
  const { data: rawFullName, isLoading } = useUsername(userId);

  // ฟังก์ชันสำหรับจัดการ "FirstName LastName" -> "FirstName Las."
  const formatName = (fullName: string | undefined) => {
    if (!fullName) return userId; // สำรองเป็น ID ถ้าไม่มีข้อมูล

    const parts = fullName.trim().split(/\s+/);
    
    // กรณีมีทั้งชื่อและนามสกุล
    if (parts.length >= 2) {
      const firstName = parts[0];
      const lastName = parts[parts.length - 1];
      const shortLastName = lastName.substring(0, 3);
      return `${firstName} ${shortLastName}.`;
    }

    // กรณีมีแค่ชื่อเดียว
    return parts[0];
  };

  if (isLoading) return <Skeleton width={60} sx={{ bgcolor: "rgba(64, 79, 87, 0.2)" }} />;
  
  return (
    <Typography 
      onClick={onClick}
      sx={{ 
        fontSize: '13px', 
        color: color, 
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        "&:hover": { color: "#8FFF9C" } 
      }}
    >
      {formatName(rawFullName)}
    </Typography>
  );
}