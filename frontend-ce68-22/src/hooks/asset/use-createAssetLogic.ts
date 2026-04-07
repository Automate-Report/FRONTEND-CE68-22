"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { assetService } from "@/src/services/asset.service";
import { assetCredentialService } from "@/src/services/assetCredential.service";

export type AssetFormInputs = {
  name: string;
  target: string;
  type: "IP" | "URL";
  username?: string;
  password?: string;
};

export const useCreateAssetLogic = (projectId: number, onClose?: () => void, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  
  const [showCredential, setShowCredential] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formMethods = useForm<AssetFormInputs>({
    // 'all' จะเช็คทั้งตอนพิมพ์ (blur) และตอนกดส่ง
    mode: "all", 
    defaultValues: {
      name: "",
      target: "",
      type: "IP",
      username: "",
      password: "",
    },
  });

  const { handleSubmit, reset, trigger } = formMethods;

  const onSubmit: SubmitHandler<AssetFormInputs> = async (data) => {
    // 🛡️ STEP 1: FORCE VALIDATION
    // trigger() จะคืนค่า true หากข้อมูลในฟอร์ม "ทั้งหมด" ถูกต้องตามเงื่อนไข required
    const isFormValid = await trigger();
    
    // ถ้ากรอกไม่ครบ trigger จะเป็น false และฟังก์ชันจะหยุดทันที (ไม่ปิด Modal/ไม่ Redirect)
    if (!isFormValid) return;

    let createdAssetId: number | null = null;

    try {
      // 1. Create Asset
      const assetPayload = {
        name: data.name.trim(),
        target: data.target.trim(),
        type: data.type,
        project_id: projectId,
        description: "",
      };

      const newAsset = await assetService.create(assetPayload);
      createdAssetId = parseInt(newAsset.id);

      // 2. Create Credential (ถ้าเปิดใช้งาน)
      if (showCredential) {
        await assetCredentialService.create({
          asset_id: createdAssetId,
          username: data.username?.trim() || "",
          password: data.password?.trim() || "",
        });
      }

      // ✅ SUCCESS HANDLING
      queryClient.invalidateQueries({ queryKey: ["assets", projectId] });
      
      reset();
      setShowCredential(false);

      // เรียกใช้ Callback ตามบริบท (Modal หรือ Page ปกติ)
      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (error) {
      
      
      // Rollback หากสร้าง Asset สำเร็จแต่สร้าง Credential พัง
      if (createdAssetId) {
          try {
              await assetService.delete(createdAssetId); 
          } catch (rollbackError) {
              // handle error if needed
          }
      }
      alert("Failed to create asset. Please check your data and try again.");
    }
  };

  return {
    formMethods,
    currentAssetType: formMethods.watch("type"),
    showCredential,
    setShowCredential,
    showPassword,
    setShowPassword,
    handleFormSubmit: handleSubmit(onSubmit),
  };
};