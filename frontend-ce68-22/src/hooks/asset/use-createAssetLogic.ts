"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { assetService } from "@/src/services/asset.service";
import { assetCredentialService } from "@/src/services/assetCredential.service";

// Define Types
export type AssetFormInputs = {
  name: string;
  target: string;
  type: "IP" | "URL";
  username?: string;
  password?: string;
};

// ✅ เพิ่ม onSuccess callback เพื่อให้ Modal ปิดตัวเองได้
export const useCreateAssetLogic = (projectId: number, onClose:() => void, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  
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

  const { watch, handleSubmit, reset } = formMethods;
  const currentAssetType = watch("type");

  // Submit Logic
  const onSubmit: SubmitHandler<AssetFormInputs> = async (data) => {
    let createdAssetId: number | null = null;

    try {
      // 1. Create Asset
      const assetPayload = {
        name: data.name,
        target: data.target,
        type: data.type,
        project_id: projectId,
        description: "",
      };

      const newAsset = await assetService.create(assetPayload);
      createdAssetId = parseInt(newAsset.id);

      // 2. if Create Credential 
      if (showCredential) {
        await assetCredentialService.create({
            asset_id: createdAssetId,
            username: data.username || "",
            password: data.password || "",
        });
      }

      // ✅ 3. Success Handling for Modal
      // สั่งให้ React Query ดึงข้อมูล Asset list ใหม่เพื่อให้ตารางหลัง Modal อัปเดต
      queryClient.invalidateQueries({ queryKey: ["assets", projectId] });
      
      // ล้างข้อมูลในฟอร์ม
      reset();
      setShowCredential(false);

      onClose();
      // เรียก callback เพื่อปิด Modal
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Critical Error:", error);
      
      // Rollback Logic (คงเดิม)
      if (createdAssetId) {
          try {
              await assetService.delete(createdAssetId); 
              console.log("Rollback successful.");
          } catch (deleteError) {
              console.error("FATAL: Rollback failed.", deleteError);
          }
      }
      alert("Failed to create asset. Please try again.");
    }
  };

  return {
    formMethods,
    currentAssetType,
    showCredential,
    setShowCredential,
    showPassword,
    setShowPassword,
    handleFormSubmit: handleSubmit(onSubmit),
  };
};