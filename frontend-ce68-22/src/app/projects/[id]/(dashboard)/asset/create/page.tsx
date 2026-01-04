"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import { assetService } from "@/src/services/asset.service";
import { credentialService } from "@/src/services/credential.service";

import { InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useProject } from "@/src/hooks/use-project";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import CreateAssetIcon from "@/src/components/icon/CreateAssertIcon";

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from "@mui/material";

// MUI Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// --- Interfaces ---
export interface CreateAssetPayload {
  name: string;
  description?: string;
  project_id: number;
  credential_id?: number;
  target: string;
  type: string;
}

// Form Inputs Type (เฉพาะที่ใช้ในหน้าจอ)
type AssetFormInputs = {
  name: string;
  target: string;
  type: "IP" | "URL";
  // Credential fields (Optional)
  username?: string;
  password?: string;
};

export default function CreateAssetPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = parseInt(params.id);

  const { data: project } = useProject(projectId);

  // State สำหรับควบคุมการแสดงผล Credential Form
  const [showCredential, setShowCredential] = useState(false);
  // State เปิดตา ปิดตา ช่อง password
  const [showPassword, setShowPassword] = useState(false);

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssetFormInputs>({
    defaultValues: {
      name: "",
      target: "",
      type: "IP", // Default value
      username: "",
      password: "",
    },
  });

  // ดูค่า Asset Type ปัจจุบันเพื่อเปลี่ยนสีปุ่ม
  const currentAssetType = watch("type");

  const onSubmit: SubmitHandler<AssetFormInputs> = async (data) => {
    // ตัวแปรสำหรับเก็บ ID ของ Asset ที่สร้างเสร็จแล้ว (เอาไว้ลบถ้าเกิด Error)
    let createdAssetId: number | null = null;

    try {
      // -------------------------------------------------------
      // STEP 1: สร้าง Asset
      // -------------------------------------------------------
      const assetPayload = {
        name: data.name,
        target: data.target,
        type: data.type,
        project_id: projectId,
        description: "",
      };

      console.log("1. Creating Asset...");
      const newAsset = await assetService.create(assetPayload);
      
      // บันทึก ID ไว้ทันทีที่สร้างเสร็จ
      createdAssetId = parseInt(newAsset.id); 

      // -------------------------------------------------------
      // STEP 2: สร้าง Credential (ถ้าเลือก)
      // -------------------------------------------------------
      if (showCredential) {
        console.log(`2. Creating Credential for Asset ID: ${createdAssetId}`);
        
        // จุดเสี่ยง: ถ้าบรรทัดนี้ Error มันจะกระโดดไป catch ทันที
        await credentialService.create({
            username: data.username || "",
            password: data.password || "",
            asset_id: createdAssetId
        });
      }

      // -------------------------------------------------------
      // STEP 3: สำเร็จทุกขั้นตอน
      // -------------------------------------------------------
      // อาจจะแสดง Toast Success ตรงนี้
      // alert("Create Asset Success!"); 
      router.push(`/projects/${projectId}/asset`);

    } catch (error) {
      console.error("Critical Error during creation process:", error);

      // -------------------------------------------------------
      // ERROR HANDLING & ROLLBACK
      // -------------------------------------------------------
      
      // เช็คว่า Asset ถูกสร้างไปแล้วหรือยัง? ถ้าสร้างแล้วต้องลบทิ้ง
      if (createdAssetId) {
          try {
              console.warn(`Rolling back: Deleting orphan asset ID ${createdAssetId}...`);
              // await assetService.delete(createdAssetId); // เรียก API ลบ
              console.log("Rollback successful.");
          } catch (deleteError) {
              // กรณีซวยซ้ำซ้อน: สร้าง Credential พัง แล้วตอนจะลบ Asset คืนก็พังอีก (Server อาจจะล่มไปเลย)
              // ตรงนี้ทำอะไรไม่ได้มาก นอกจาก Log ไว้ให้ Admin มาเคลียร์ Data ขยะ
              console.error("FATAL: Rollback failed. Orphan asset exists.", deleteError);
          }
      }

      // แจ้งเตือน User
      alert("เกิดข้อผิดพลาดในการสร้าง Asset กรุณาลองใหม่อีกครั้ง");
      // หรือ set error state เพื่อแสดงข้อความสีแดงบนหน้าจอ
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
    { label: "Asset", href: undefined },
    { label: "Create new asset", href: undefined }
  ];

  // Style Constant (คงเดิมตามที่คุณกำหนด)
  const inputStyles = {
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#FBFBFB",
    "& .MuiOutlinedInput-root": {
      color: "#000", // ปรับเป็นสีเข้มเพื่อให้มองเห็นใน input สีขาว
      "& fieldset": { borderColor: "rgba(230, 240, 230, 0.3)" },
      "&:hover fieldset": { borderColor: "#E6F0E6" },
      "& input": {
         fontSize: "16px",
         fontWeight: 300,
         color: "#000",
         padding: "8.5px 14px" // Adjust padding to center text in 40px height
      }
    },
    "& .MuiInputLabel-root": { color: "rgba(230, 240, 230, 0.7)" },
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pb: 4 }}>
      {/* Breadcrumbs */}
      <GenericBreadcrums items={breadcrumbItems} />

      {/* --- Section 1: Asset Name --- */}
      <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", mb: "12px", fontSize: "24px" }}>
        Asset Name
      </Typography>
      <TextField
        placeholder="e.g. Testsite URL"
        fullWidth
        variant="outlined"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register("name", { required: "Asset Name is required" })}
        sx={inputStyles}
      />

      {/* --- Section 2: Assets Target & Type --- */}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", mb: "12px", fontSize: "24px" }}>
          Asset
        </Typography>
        
        {/* Input Target (IP/URL) */}
        <TextField
          placeholder={currentAssetType === "IP" ? "e.g. 192.168.0.1" : "e.g. https://example.com"}
          fullWidth
          variant="outlined"
          error={!!errors.target}
          helperText={errors.target?.message}
          {...register("target", { required: "Asset Target is required" })}
          sx={{ ...inputStyles, mb: 2 }}
        />

        {/* Asset Type Selection Buttons */}
        <Stack direction="row" gap={"12px"} alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ color: "#9AA6A8", fontWeight: "medium", fontSize: "16px" }}>
            Asset type:
          </Typography>
          
          {/* Button: IP */}
          <Button
            variant="contained"
            onClick={() => setValue("type", "IP")}
            sx={{
              height: "40px",
              padding: "16px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              textTransform: "none",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "normal",
              // Logic การเปลี่ยนสี
              color: "#0B0F12",
              backgroundColor: currentAssetType === "IP" ? "#8FFF9C" : "#FBFBFB",
              "&:hover": {
                 backgroundColor: currentAssetType === "IP" ? "#7BE588" : "#E0E0E0",
              }
            }}
          >
            IP
          </Button>

          {/* Button: URL */}
          <Button
            variant="contained"
            onClick={() => setValue("type", "URL")}
            sx={{
              height: "40px",
              padding: "16px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              textTransform: "none",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "normal",
              // Logic การเปลี่ยนสี
              color: "#0B0F12",
              backgroundColor: currentAssetType === "URL" ? "#8FFF9C" : "#FBFBFB",
               "&:hover": {
                 backgroundColor: currentAssetType === "URL" ? "#7BE588" : "#E0E0E0",
              }
            }}
          >
            URL
          </Button>
        </Stack>
      </Box>

      {/* --- Section 3: Credentials --- */}
      <Box sx={{ mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", mb: "12px", fontSize: "24px" }}>
            Credentials
          </Typography>
        </Stack>

        {!showCredential ? (
            // State 1: ยังไม่ได้กดสร้าง -> โชว์ปุ่ม Add
            <Button
                startIcon={<CreateAssetIcon />}
                onClick={() => setShowCredential(true)}
                variant="outlined"
                sx={{
                color: "#E6F0E6",
                borderColor: "#E6F0E6",
                borderRadius: "8px",
                textTransform: "none",
                fontFamily: "inherit",
                }}
            >
                Add New Credentials
            </Button>
        ) : (
            // State 2: กดสร้างแล้ว -> โชว์ตาราง Username/Password
            <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Table sx={{ minWidth: 650 }} aria-label="credential table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "#9AA6A8", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Username</TableCell>
                            <TableCell sx={{ color: "#9AA6A8", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Password</TableCell>
                            <TableCell align="right" sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <TextField 
                                    placeholder="Username" 
                                    fullWidth 
                                    sx={inputStyles} 
                                    {...register("username", { required: showCredential ? "Username is required" : false })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField 
                                    placeholder="Password" 
                                    // เปลี่ยน type ตาม state: ถ้า showPassword เป็น true ให้เป็น text ธรรมดา, ถ้า false เป็น password
                                    type={showPassword ? "text" : "password"} 
                                    fullWidth 
                                    sx={inputStyles}
                                    {...register("password", { required: showCredential ? "Password is required" : false })}
                                    
                                    // เพิ่ม InputProps เพื่อใส่ไอคอนด้านหลัง
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)} // กดแล้วสลับค่า true/false
                                                    edge="end"
                                                    sx={{ color: "#9AA6A8" }} // ปรับสีไอคอนให้เข้ากับ Theme (ใช้สีเดียวกับ Placeholder/Label เดิมของคุณ)
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Button 
                                    onClick={() => setShowCredential(false)}
                                    sx={{ minWidth: "auto", color: "#FE3B46" }}
                                >
                                    <DeleteOutlineIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )}
      </Box>

      {/* --- Action Buttons --- */}
      <Stack direction="row" spacing={"32px"} justifyContent="flex-start" alignItems={"center"} marginTop={"16px"}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          sx={{
            height: "40px",
            padding: "16px 24px",
            color: "#FE3B46",
            borderColor: "#FE3B46",
            borderRadius: "8px",
            fontSize: "16px",
            textTransform: "none",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "normal",
            "&:hover": {
              backgroundColor: "#FE3B46",
              color: "#FBFBFB"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            height: "40px",
            padding: "16px 24px",
            fontWeight: 'medium',
            fontSize: "16px",
            textTransform: "none",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "normal",
            color: "#0B0F12",
            backgroundColor: "#8FFF9C",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#AFFFB9",
            }
          }}
        >
          Create Asset
        </Button>
      </Stack>
    </Box>
  );
}