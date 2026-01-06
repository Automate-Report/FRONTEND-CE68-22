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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress
} from "@mui/material";

// Icons
import EditIcon from "@/src/components/icon/Edit"; // ตรวจสอบ Path นี้ว่าถูกต้อง
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Services
import { assetService } from "@/src/services/asset.service";
import { credentialService } from "@/src/services/credential.service";

// Hooks & Components
import { useProject } from "@/src/hooks/project/use-project";
import { useAsset } from "@/src/hooks/asset/use-asset";
import { useCredentialByAsset } from "@/src/hooks/use-credential";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";

// Types
import { Asset } from "@/src/types/asset";
import { Credential } from "@/src/types/asset";

export default function ViewAssetPage() {
  const router = useRouter();
  const params = useParams<{ id: string; assetId: string }>();
  const projectId = parseInt(params.id);
  const assetId = parseInt(params.assetId);

  // --- States ---
  const [showPassword, setShowPassword] = useState(false);
  
  // Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State เพื่อบอกว่าเรากำลังจะลบอะไร (Asset หรือ Credential)
  const [deleteTarget, setDeleteTarget] = useState<{ 
      type: 'ASSET' | 'CREDENTIAL'; 
      id: number; 
      name: string 
  } | null>(null);

  // --- Fetch Data ---
  const { data: project } = useProject(projectId);
  const { data: assetData, isLoading: isAssetLoading } = useAsset(assetId);
  // ใช้ refetch เพื่อโหลดข้อมูลใหม่หลังลบ Credential
  const { data: credData, isLoading: isCredLoading, refetch: refetchCredential } = useCredentialByAsset(assetId);

  // --- Helpers ---
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // alert("Copied to clipboard!"); 
  };

  // --- Loading & Error Checks ---
  if (isAssetLoading || isCredLoading) {
     return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (!assetData) {
      return <Typography color="#E6F0E6">Asset not found</Typography>;
  }

  // Cast Types
  const asset = assetData as Asset;
  const credential = Array.isArray(credData) ? credData[0] : (credData as Credential | undefined);

  // Breadcrumbs
  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
    { label: "Asset", href: `/projects/${projectId}/asset` },
    { label: asset.name, href: undefined }
  ];

  // --- Delete Handlers ---

  // 1. กดปุ่มลบ Asset (ปุ่มบนขวา)
  const handleDeleteAssetClick = () => {
      setDeleteTarget({
          type: 'ASSET',
          id: asset.id,
          name: asset.name
      });
      setDeleteModalOpen(true);
  };

  // 2. กดปุ่มลบ Credential (ปุ่มในตาราง)
  const handleDeleteCredentialClick = () => {
      if (!credential) return;
      setDeleteTarget({
          type: 'CREDENTIAL',
          id: credential.id,
          name: credential.username
      });
      setDeleteModalOpen(true);
  };

  // 3. ยืนยันการลบ (ใน Modal)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'ASSET') {
          // --- ลบ Asset ---
          // (ถ้า Backend ไม่ Cascade ลบ Credential ให้ เราอาจจะต้องสั่งลบเองก่อน ตรงนี้ขึ้นอยู่กับ Backend)
          if (credential) {
             await credentialService.delete(credential.id);
          }
          await assetService.delete(deleteTarget.id);
          
          // ลบเสร็จย้ายหน้า
          router.push(`/projects/${projectId}/asset`);

      } else if (deleteTarget.type === 'CREDENTIAL') {
          // --- ลบ Credential ---
          await credentialService.delete(deleteTarget.id);
          // โหลดข้อมูล Credential ใหม่ (ตารางจะหายไป)
          await refetchCredential();
      }
      
      setDeleteModalOpen(false);
      setDeleteTarget(null);

    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete item"); 
    } finally {
      setIsDeleting(false);
    }
  };


  // --- Render ---
  return (
    <>
    <Box sx={{ pb: "24px" }}>
      <GenericBreadcrums items={breadcrumbItems} />

      {/* --- Header --- */}
      <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: "24px" }}>
        <Stack direction="row" alignItems="center" gap={2}>
            <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", fontSize: "36px" }}>
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

        <Stack direction="row" alignItems="center" gap={3}>
            {/* ปุ่มลบ Asset หลัก */}
            <Button
                variant="outlined"
                onClick={handleDeleteAssetClick} 
                sx={{ 
                    px: "24px",
                    borderRadius: "8px",
                    borderColor: "#FE3B46", 
                    color: "#FE3B46", 
                    textTransform: "none", 
                    fontFamily: "inherit",
                    fontWeight: "medium",
                    fontSize: "16px",
                    "&:hover": { bgcolor: "#FE3B46", color: "#FBFBFB" }
                }}
            >
                Delete
            </Button>
            <Button 
                variant="contained" 
                endIcon={<EditIcon />}
                onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)}
                sx={{ 
                    px: "24px",
                    gap: "4px",
                    borderRadius: "8px",
                    bgcolor: "#8FFF9C", 
                    color: "#0B0F12", 
                    textTransform: "none", 
                    fontFamily: "inherit",
                    fontWeight: "medium",
                    fontSize: "16px",
                    "&:hover": { bgcolor: "#AFFFB9" }
                }}
            >
                Edit
            </Button>
        </Stack>
      </Stack>

      {/* --- Asset Target Box --- */}
      <Stack sx={{ mb: "24px" }}>
        <Typography sx={{ color: "#E6F0E6", mb: "12px", fontWeight: "bold", fontSize: "24px" }}>
            Asset
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: "40px", bgcolor: "#272D31", borderRadius: "8px", p: 2}}>
            <Typography sx={{ color: "#E6F0E6", fontWeight: "regular", fontSize: "16px" }}>
                {asset.target}
            </Typography>
            <Tooltip title="Copy">
                <IconButton size="small" onClick={() => handleCopy(asset.target)} sx={{ color: "#9AA6A8", p: 0, m: 0 }}>
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
      </Stack>

        {/* --- Section 2: Credentials --- */}
        <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", fontSize: "24px", mb: "16px"}}>
            Credentials
        </Typography>
        
        {credential ? (
            <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid #E6F0E6", borderRadius: "16px"}}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{height: "48px"}}>
                        <TableRow >
                            <TableCell align="center" sx={{ color: "#E6F0E6", backgroundColor: "#0F1518", fontSize: "16px", width:"45%" }}>Username</TableCell>
                            <TableCell align="center" sx={{ color: "#E6F0E6", backgroundColor: "#0F1518", fontSize: "16px", width:"45%" }}>Password</TableCell>
                            <TableCell align="right" sx={{ backgroundColor: "#0F1518", width:"10%" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ height: "48px", padding: 0, margin: 0 }}>
                        <TableRow 
                            sx={{ 
                                padding: 0, margin: 0,
                                backgroundColor: "#FBFBFB",
                                color: "#404F57",
                                '&:last-child td, &:last-child th': { border: 0 } 
                            }}
                        >
                            <TableCell component="th" scope="row" align="center">
                                {credential.username}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                <Stack 
                                    direction="row" 
                                    alignItems="center" 
                                    justifyContent="center" 
                                    gap={1}
                                >
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontFamily: showPassword ? "inherit" : "monospace",
                                            minWidth: "80px",
                                            fontSize: "16px"
                                        }}
                                    >
                                        {showPassword ? credential.password : "••••••••"}
                                    </Typography>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        sx={{ color: "#9AA6A8" }}
                                    >
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </Stack>
                            </TableCell>
                            <TableCell align="right">
                                <Stack
                                    direction="row" 
                                    alignItems="center" 
                                    justifyContent="end" 
                                    gap={1}
                                    sx={{ pr: 2 }}
                                >
                                    <Button 
                                        onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)} 
                                        sx={{ color: "#0B0F12", p: 0, minWidth: "auto" }}
                                    >
                                        <EditIcon />
                                    </Button>

                                    {/* ปุ่มลบ Credential เฉพาะแถวนี้ */}
                                    <Button 
                                        onClick={handleDeleteCredentialClick}
                                        sx={{ minWidth: "auto", color: "#FE3B46", p: 0 }}
                                    >
                                        <DeleteOutlineIcon />
                                    </Button>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            // กรณีไม่มี Credential
            <Paper sx={{ 
                p: 3, 
                bgcolor: "rgba(255,255,255,0.02)", 
                border: "1px dashed rgba(255,255,255,0.3)", 
                borderRadius: "12px",
                textAlign: "center", 
                py: 4 
            }}>
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

    </Box>
    
    {/* Generic Delete Modal Reuse สำหรับทั้ง 2 กรณี */}
    {deleteTarget && (
        <GenericDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          
          // ส่งค่าแบบ Dynamic ตามสิ่งที่กำลังลบ
          entityType={deleteTarget.type === 'ASSET' ? 'Asset' : 'Credential'}
          entityName={deleteTarget.name}
          loading={isDeleting}
        />
    )}
    </>
  );
}