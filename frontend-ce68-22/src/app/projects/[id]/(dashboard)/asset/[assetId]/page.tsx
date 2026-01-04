"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  Paper, 
  IconButton, 
  Tooltip, 
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Hooks & Components
import { useProject } from "@/src/hooks/use-project";
import { useAsset } from "@/src/hooks/use-asset";
import { useCredentialByAsset } from "@/src/hooks/use-credential";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

// Types (Import ให้ถูกต้องตามที่คุณมี)
import { Asset } from "@/src/types/asset";
import { Credential } from "@/src/types/credential";

export default function ViewAssetPage() {
  const router = useRouter();
  const params = useParams<{ id: string; assetId: string }>();
  const projectId = parseInt(params.id);
  const assetId = parseInt(params.assetId);

  // States
  const [showPassword, setShowPassword] = useState(false);
  
  // Fetch Data
  const { data: project } = useProject(projectId);
  const { data: assetData, isLoading: isAssetLoading } = useAsset(assetId);
  const { data: credData, isLoading: isCredLoading } = useCredentialByAsset(assetId);

  // Helper: Copy to Clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // คุณอาจจะเพิ่ม Toast/Snackbar แจ้งเตือนตรงนี้ว่า "Copied!"
    alert("Copied to clipboard!"); 
  };

  if (isAssetLoading || isCredLoading) {
     return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (!assetData) {
      return <Typography color="#E6F0E6">Asset not found</Typography>;
  }

  const asset = assetData as Asset;
  // Handle Credential Data (เผื่อเป็น Array หรือ Object)
  const credential = Array.isArray(credData) ? credData[0] : (credData as Credential | undefined);

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
    { label: "Asset", href: `/projects/${projectId}/asset` },
    { label: asset.name, href: undefined }
  ];

  // Common Styles
  const labelStyle = { color: "#9AA6A8", fontSize: "14px", mb: 0.5 };
  const valueStyle = { color: "#E6F0E6", fontSize: "16px", fontWeight: "medium" };
  const sectionBoxStyle = { 
      p: 3, 
      bgcolor: "rgba(255,255,255,0.02)", 
      border: "1px solid rgba(255,255,255,0.1)", 
      borderRadius: "12px" 
  };

  return (
    <Box sx={{ pb: 4 }}>
      <GenericBreadcrums items={breadcrumbItems} />

      {/* --- Header --- */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" gap={2}>
            <IconButton onClick={() => router.back()} sx={{ color: "#E6F0E6" }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: "#E6F0E6", fontWeight: "bold" }}>
            {asset.name}
            </Typography>
            <Chip 
                label={asset.type} 
                sx={{ 
                    bgcolor: asset.type === "IP" ? "rgba(143, 255, 156, 0.2)" : "rgba(144, 202, 249, 0.2)", 
                    color: asset.type === "IP" ? "#8FFF9C" : "#90caf9",
                    fontWeight: "bold"
                }} 
            />
        </Stack>
        
        <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)} // ลิงก์ไปหน้า Edit
            sx={{ 
                bgcolor: "#FBFBFB", color: "#0B0F12", textTransform: "none", fontWeight: "bold",
                "&:hover": { bgcolor: "#E0E0E0" }
            }}
        >
            Edit Asset
        </Button>
      </Stack>

      <Stack spacing={3}>
        {/* --- Section 1: Asset Information --- */}
        <Paper sx={sectionBoxStyle}>
            <Typography variant="h6" sx={{ color: "#E6F0E6", mb: 2, fontWeight: "bold" }}>
                Asset Information
            </Typography>
            
            <Stack direction="row" spacing={8}>
                <Box>
                    <Typography sx={labelStyle}>Target ({asset.type})</Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Typography sx={valueStyle}>{asset.target}</Typography>
                        <Tooltip title="Copy">
                            <IconButton size="small" onClick={() => handleCopy(asset.target)} sx={{ color: "#9AA6A8" }}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                {asset.description && (
                    <Box>
                        <Typography sx={labelStyle}>Description</Typography>
                        <Typography sx={valueStyle}>{asset.description}</Typography>
                    </Box>
                )}

                 <Box>
                        <Typography sx={labelStyle}>Last Updated</Typography>
                        <Typography sx={valueStyle}>
                            {new Date(asset.updated_at).toLocaleDateString()} 
                            {/* หรือใช้ library เช่น dayjs */}
                        </Typography>
                    </Box>
            </Stack>
        </Paper>

        {/* --- Section 2: Credentials (แสดงเฉพาะเมื่อมีข้อมูล) --- */}
        {credential ? (
             <Paper sx={sectionBoxStyle}>
                <Typography variant="h6" sx={{ color: "#E6F0E6", mb: 2, fontWeight: "bold" }}>
                    Credentials
                </Typography>

                <Stack direction="row" spacing={8} alignItems="center">
                    {/* Username */}
                    <Box>
                        <Typography sx={labelStyle}>Username</Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography sx={valueStyle}>{credential.username}</Typography>
                            <Tooltip title="Copy Username">
                                <IconButton size="small" onClick={() => handleCopy(credential.username)} sx={{ color: "#9AA6A8" }}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>

                    {/* Password */}
                    <Box>
                        <Typography sx={labelStyle}>Password</Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography sx={{ ...valueStyle, fontFamily: showPassword ? "inherit" : "monospace" }}>
                                {showPassword ? credential.password : "••••••••••••"}
                            </Typography>
                            
                            <Tooltip title={showPassword ? "Hide Password" : "Show Password"}>
                                <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: "#9AA6A8" }}>
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Copy Password">
                                <IconButton size="small" onClick={() => handleCopy(credential.password || "")} sx={{ color: "#9AA6A8" }}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                </Stack>
             </Paper>
        ) : (
            // กรณีไม่มี Credential
            <Paper sx={{ ...sectionBoxStyle, borderStyle: "dashed", textAlign: "center", py: 4 }}>
                <Typography sx={{ color: "#9AA6A8" }}>No credentials linked to this asset.</Typography>
                <Button 
                    variant="text" 
                    sx={{ mt: 1, color: "#8FFF9C", textTransform: "none" }}
                    onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)}
                >
                    Add Credentials
                </Button>
            </Paper>
        )}
      </Stack>
    </Box>
  );
}