"use client";

import { useParams } from "next/navigation";
import { Box } from "@mui/material";

// Hooks & Logic
import { useProject } from "@/src/hooks/project/use-project";
import { useCreateAssetLogic } from "@/src/hooks/asset/use-createAssetLogic";

// UI Components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { AssetBasicInfo } from "@/src/components/assets/create/AssetBasicInfo";
import { CredentialForm } from "@/src/components/assets/create/CredentialForm";
import { FormActions } from "@/src/components/assets/create/FormActions";

import { useProjectRole } from "@/src/context/ProjectDetailConext";
import { redirect } from "next/navigation";

export default function CreateAssetPage() {
  const { role } = useProjectRole();
  const params = useParams<{ id: string }>();
  const projectId = parseInt(params.id);

  if (role?.toLowerCase() === "developer") {
    redirect(`/projects/${projectId}/asset`);
  }

  // 1. Fetch Data
  const { data: project } = useProject(projectId);

  // 2. Call Logic Hook
  const {
    formMethods,
    currentAssetType,
    showCredential,
    setShowCredential,
    showPassword,
    setShowPassword,
    handleFormSubmit
  } = useCreateAssetLogic(projectId);

  // 3. Breadcrumbs Config
  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
    { label: "Asset", href: undefined },
    { label: "Create new asset", href: undefined }
  ];

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ pb: 4 }}>
      <GenericBreadcrums items={breadcrumbItems} />

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

      <FormActions />
    </Box>
  );
}