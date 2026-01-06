import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { assetService } from "@/src/services/asset.service";
import { credentialService } from "@/src/services/credential.service";

// Define Types
export type AssetFormInputs = {
  name: string;
  target: string;
  type: "IP" | "URL";
  username?: string;
  password?: string;
};

export const useCreateAssetLogic = (projectId: number) => {
  const router = useRouter();
  
  // States
  const [showCredential, setShowCredential] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Setup
  const formMethods = useForm<AssetFormInputs>({
    defaultValues: {
      name: "",
      target: "",
      type: "IP",
      username: "",
      password: "",
    },
  });

  const { watch, handleSubmit } = formMethods;
  const currentAssetType = watch("type");

  // Submit Logic
  const onSubmit: SubmitHandler<AssetFormInputs> = async (data) => {
    let createdAssetId: number | null = null;

    try {
      // Create Asset
      const assetPayload = {
        name: data.name,
        target: data.target,
        type: data.type,
        project_id: projectId,
        description: "",
      };

      const newAsset = await assetService.create(assetPayload);
      createdAssetId = parseInt(newAsset.id);

      // if Create Credential 
      if (showCredential) {
        await credentialService.create({
            asset_id: createdAssetId,
            username: data.username || "",
            password: data.password || "",
        });
      }

      //Success
      router.push(`/projects/${projectId}/asset/${newAsset.id}`); // แก้ path ตามต้องการ

    } catch (error) {
      console.error("Critical Error:", error);
      
      // Rollback Logic
      if (createdAssetId) {
          try {
              console.warn(`Rolling back Asset ID ${createdAssetId}...`);
              await assetService.delete(createdAssetId); 
              console.log("Rollback successful.");
          } catch (deleteError) {
              console.error("FATAL: Rollback failed.", deleteError);
          }
      }
      alert("เกิดข้อผิดพลาดในการสร้าง Asset กรุณาลองใหม่อีกครั้ง");
    }
  };

  return {
    formMethods, // ส่งออก register, errors, setValue ฯลฯ ผ่านตัวนี้
    currentAssetType,
    showCredential,
    setShowCredential,
    showPassword,
    setShowPassword,
    handleFormSubmit: handleSubmit(onSubmit), // ส่ง function submit ออกไป
  };
};