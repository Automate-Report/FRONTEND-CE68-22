"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { Box, CircularProgress } from "@mui/material";

// Hooks
import { useProject } from "@/src/hooks/project/use-project";
import { useProjectRole } from "@/src/context/ProjectDetailConext";
import { useEditAssetLogic } from "@/src/hooks/asset/use-editAssetLogic";

// UI Components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { AssetBasicInfo } from "@/src/components/assets/create/AssetBasicInfo";
import { CredentialForm } from "@/src/components/assets/create/CredentialForm";

import { GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";

export default function EditAssetClientPage() {
  const router = useRouter(); 
  const { role } = useProjectRole();
  const params = useParams<{ id: string; assetId: string }>();
  const projectId = parseInt(params.id);
  const assetId = parseInt(params.assetId);

  const { data: project } = useProject(projectId);

  useEffect(() => {
    if (role?.toLowerCase() === "developer") {
      router.replace(`/projects/${projectId}/asset`);
    }
  }, [role, projectId, router]);

  // เรียก Logic Hook สำหรับ Edit
  const {
    formMethods,
    currentAssetType,
    showCredential,
    setShowCredential,
    showPassword,
    setShowPassword,
    handleFormSubmit,
    isLoading
  } = useEditAssetLogic(projectId, assetId);

  const { isSubmitting } = formMethods.formState;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
    { label: "Asset", href: `/projects/${projectId}/asset` },
    { label: "Edit Asset", href: undefined }
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: "#8FFF9C" }} />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ pb: 4 }}>
      <GenericBreadcrums items={breadcrumbItems} />

      {/* Reuse Component เดิม */}
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

      {/* --- Action Buttons --- */}
      <div className="mt-8 flex gap-6 justify-start items-center">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.back()}
          className={`${RED_BUTTON_STYLE}`}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${GREEN_BUTTON_STYLE} flex justify-center items-center gap-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0D1014] border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </Box>
  );
}