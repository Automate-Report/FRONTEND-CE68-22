"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

// Services
import { assetService } from "@/src/services/asset.service";
import { assetCredentialService } from "@/src/services/assetCredential.service";
import { useProject } from "@/src/hooks/project/use-project";
import { useProjectRole } from "@/src/context/ProjectDetailConext";

// UI Components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { AssetBasicInfo } from "@/src/components/assets/create/AssetBasicInfo";
import { CredentialForm } from "@/src/components/assets/create/CredentialForm";
import { FormActions } from "@/src/components/assets/create/FormActions";
import { showToast } from "@/src/components/Common/ToastContainer";
import { CheckCircle, Close } from "@mui/icons-material";


// Define Form Types
export type AssetFormInputs = {
  name: string;
  target: string;
  type: "IP" | "URL";
  username?: string;
  password?: string;
};

export default function CreateAssetPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = parseInt(params.id);
  const { role } = useProjectRole();
  const queryClient = useQueryClient();

  // --- States ---
  const [showCredential, setShowCredential] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Redirect Guard ---
  useEffect(() => {
    if (role?.toLowerCase() === "developer") {
      router.replace(`/projects/${projectId}/asset`);
    }
  }, [role, projectId, router]);

  // --- Form Setup ---
  const formMethods = useForm<AssetFormInputs>({
    mode: "all", // ตรวจสอบความถูกต้องตลอดเวลา
    defaultValues: {
      name: "",
      target: "",
      type: "IP",
      username: "",
      password: "",
    },
  });

  const { data: project } = useProject(projectId);

  // --- Submit Handler ---
  const onSubmit: SubmitHandler<AssetFormInputs> = async (data) => {
    // 🛡️ STEP 1: Strict Manual Check
    // สั่ง trigger เช็คฟิลด์หลักและฟิลด์ credential (ถ้าเปิดอยู่)
    const isValid = await formMethods.trigger();
    if (!isValid) return; // ถ้ากรอกไม่ครบ/ไม่ถูก หยุดทันที

    setIsSubmitting(true);
    let createdAssetId: number | null = null;

    try {
      // 1. สร้าง Asset หลัก
      const assetPayload = {
        name: data.name.trim(),
        target: data.target.trim(),
        type: data.type,
        project_id: projectId,
        description: "",
      };

      const newAsset = await assetService.create(assetPayload);
      createdAssetId = parseInt(newAsset.id);

      // 2. สร้าง Credential (ถ้า User เลือกที่จะกรอก)
      if (showCredential) {
        await assetCredentialService.create({
          asset_id: createdAssetId,
          username: data.username?.trim() || "",
          password: data.password?.trim() || "",
        });
      }

      // 3. Clear Cache และย้ายหน้า
      queryClient.invalidateQueries({ queryKey: ["assets", projectId] });
      // Success
      showToast({
        icon: <CheckCircle sx={{fontSize: "20px",color: "#4CAF8A"}} />,
        message: "Asset Created successfully!",
        borderColor: "#8FFF9C",
        duration: 6000,
      });
      router.push(`/projects/${projectId}/asset`);

    } catch (error) {
      // Rollback: ถ้าสร้าง Asset ได้แต่ Credential พัง ให้ลบ Asset ทิ้งป้องกันขยะ
      if (createdAssetId) {
        await assetService.delete(createdAssetId);
      }
      alert("Something went wrong. Please check your data.");
      showToast({
        icon: <Close sx={{fontSize: "20px",color: "#FE3B46"}} />,
        message: "Failed to Create asset :(",
        borderColor: "#FE3B46",
        duration: 6000,
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Breadcrumbs ---
  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
    { label: "Asset", href: `/projects/${projectId}/asset` },
    { label: "Create new asset", href: undefined }
  ];

  return (
    <Box
      component="form"
      onSubmit={formMethods.handleSubmit(onSubmit)}
      sx={{
        pb: 4,
        opacity: isSubmitting ? 0.7 : 1,
        pointerEvents: isSubmitting ? 'none' : 'auto'
      }}
    >
      <GenericBreadcrums items={breadcrumbItems} />

      {/* ข้อมูลพื้นฐาน: ชื่อ Asset, Target, Type */}
      <AssetBasicInfo
        formMethods={formMethods}
        currentAssetType={formMethods.watch("type")}
      />

      {/* ส่วน Credentials: Username, Password */}
      <CredentialForm
        formMethods={formMethods}
        showCredential={showCredential}
        setShowCredential={setShowCredential}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      {/* ปุ่มกด Cancel / Create */}
      <FormActions isSubmitting={isSubmitting} submitLabel="Create Asset" />
    </Box>
  );
}