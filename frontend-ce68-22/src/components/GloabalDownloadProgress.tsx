// ใน components/Common/GlobalDownloadProgress.tsx
import { useDownloadStore } from "../hooks/worker/use-WorkerDownloadStore";
import { Box, LinearProgress, Typography, Stack } from "@mui/material";

export function GlobalDownloadProgress() {
  const { isDownloading, progress, currentWorkerName } = useDownloadStore();

  if (!isDownloading) return null;

  return (
    <Box sx={{ 
      position: 'fixed', bottom: 20, right: 20, 
      width: 300, bgcolor: '#161B1F', p: 2, 
      borderRadius: '12px', border: '1px solid #2D2F39',
      zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <Stack spacing={1}>
        <Typography variant="caption" sx={{ color: '#8FFF9C', fontWeight: 'bold' }}>
          Downloading: {currentWorkerName}
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ 
          height: 8, borderRadius: 4, bgcolor: '#0B0F12',
          '& .MuiLinearProgress-bar': { bgcolor: '#8FFF9C' }
        }} />
        <Typography variant="caption" sx={{ color: '#9AA6A8', textAlign: 'right' }}>
          {progress}%
        </Typography>
      </Stack>
    </Box>
  );
}