"use client";

import { Box, Typography, Stack, Chip, Button, Divider } from "@mui/material";
import { BugReport as BugIcon, Code as CodeIcon, Schedule as TimeIcon } from "@mui/icons-material";

export default function VulnDetailPage() {
  // ในหน้าจริง คุณจะใช้ useQuery ดึงข้อมูลโดยใช้ vulnId จาก params
  return (
    <Box className="bg-[#161B1F] rounded-2xl border border-[#404F57] p-6 flex flex-col h-full animate-in fade-in duration-500">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Chip label="CRITICAL" size="small" sx={{ bgcolor: "#FF3B3020", color: "#FF3B30", fontWeight: 900, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#FBFBFB", mb: 1 }}>Broken Access Control</Typography>
          <Typography sx={{ color: "#9AA6A8", display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px' }}>
            <TimeIcon sx={{ fontSize: 16 }} /> First detected on 10 Feb 2026
          </Typography>
        </Box>
        <Button variant="contained" sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: "bold", "&:hover": { bgcolor: "#AFFFB9" } }}>
          Mark as Fixed
        </Button>
      </Stack>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Technical Details */}
        <div className="md:col-span-7 space-y-6">
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#8FFF9C", fontWeight: "bold", mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BugIcon sx={{ fontSize: 18 }} /> Technical Detail
            </Typography>
            <div className="bg-[#1E2429] p-4 rounded-xl border border-[#404F57] border-l-4 border-l-[#8FFF9C]">
              <Typography variant="body2" sx={{ color: "#E6F0E6", lineHeight: 1.8 }}>
                Detailed technical explanation would go here...
              </Typography>
            </div>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: "#8FFF9C", fontWeight: "bold", mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CodeIcon sx={{ fontSize: 18 }} /> Proof of Concept
            </Typography>
            <pre className="bg-[#0D1014] p-4 rounded-xl border border-[#404F57] overflow-x-auto">
              <code className="text-[#FFCC00] text-xs font-mono">
                GET /api/v1/user?id=1 HTTP/1.1{"\n"}
                Host: payment-service.internal
              </code>
            </pre>
          </Box>
        </div>

        {/* Right: Remediation & Log */}
        <div className="md:col-span-5">
           <Box className="bg-[#1E2429] p-5 rounded-xl border border-[#404F57] space-y-5">
              {/* ... โค้ด Remediation & Activity Log เหมือนเดิม ... */}
           </Box>
        </div>
      </div>
    </Box>
  );
}