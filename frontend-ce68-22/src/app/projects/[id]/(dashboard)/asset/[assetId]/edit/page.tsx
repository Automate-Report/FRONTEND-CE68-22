"use client";

import { useParams } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

// Hooks
import { useProject } from "@/src/hooks/project/use-project";
import { useEditAssetLogic } from "@/src/hooks/asset/use-editAssetLogic";

// UI Components (Reuse ของเดิม)
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { AssetBasicInfo } from "@/src/components/assets/create/AssetBasicInfo";
import { CredentialForm } from "@/src/components/assets/create/CredentialForm";
import { FormActions } from "@/src/components/assets/create/FormActions";

export default function EditAssetPage() {
  const params = useParams<{ id: string; assetId: string }>(); // รับ assetId จาก URL
  const projectId = parseInt(params.id);
  const assetId = parseInt(params.assetId);

  const { data: project } = useProject(projectId);

  // เรียก Logic Hook สำหรับ Edit
  const {
    formMethods,
    currentAssetType,
    showCredential,
    setShowCredential,
    showPassword,
    setShowPassword,
    handleFormSubmit,
    isLoading // รับ status loading มาด้วย
  } = useEditAssetLogic(projectId, assetId);

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
    { label: "Asset", href: `/projects/${projectId}/asset` }, // แก้ link กลับหน้ารวม
    { label: "Edit Asset", href: undefined }
  ];

  if (isLoading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ pb: 4 }}>
      <GenericBreadcrums items={breadcrumbItems} />

      {/* Reuse Component เดิมได้เลย 100% */}
      <AssetBasicInfo 
         formMethods={formMethods} 
         currentAssetType={currentAssetType} 
      />

      <CredentialForm 
         formMethods={formMethods}
         showCredential={showCredential}
         setShowCredential={setShowCredential}
         showPassword={showPassword}
         setShowPassword={setShowPassword}
      />

      {/* เปลี่ยน Label ปุ่ม */}
      <FormActions submitLabel="Save Changes" />
    </Box>
  );
}