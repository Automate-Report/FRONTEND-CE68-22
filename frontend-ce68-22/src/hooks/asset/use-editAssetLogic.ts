import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { assetService } from "@/src/services/asset.service";
import { credentialService } from "@/src/services/credential.service";
import { useAsset } from "@/src/hooks/asset/use-asset"; // สมมติว่ามี hook ดึง asset เดี่ยว
import { useCredentialByAsset } from "@/src/hooks/use-credential"; // สมมติว่ามี hook ดึง credential ของ asset

import { Asset } from "../../types/asset";

// Type เดียวกับหน้า Create
export type AssetFormInputs = {
  name: string;
  target: string;
  type: "IP" | "URL";
  username?: string;
  password?: string;
};

export const useEditAssetLogic = (projectId: number, assetId: number) => {
  const router = useRouter();
  
  // 1. Fetch Existing Data
  // (โค้ดจริงต้องปรับตามวิธีที่คุณดึงข้อมูล อาจจะใช้ useQuery หรือ useEffect fetch เองก็ได้)
  const { data: assetData, isLoading: isAssetLoading } = useAsset(assetId);
  const { data: credData, isLoading: isCredLoading } = useCredentialByAsset(assetId);

  // State
  const [showCredential, setShowCredential] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // เก็บ ID เดิมไว้ เพื่อเช็คว่าต้อง Update หรือ Create
  const [existingCredentialId, setExistingCredentialId] = useState<number | null>(null);

  const formMethods = useForm<AssetFormInputs>({
    defaultValues: {
      name: "",
      target: "",
      type: "IP",
      username: "",
      password: "",
    },
  });

  const { reset, watch, handleSubmit } = formMethods;
  const currentAssetType = watch("type");

  // 2. Populate Form Data เมื่อโหลดเสร็จ
  useEffect(() => {
    if (assetData) {

        const asset = assetData as Asset;
      // Setup Asset Data
      const defaultValues: Partial<AssetFormInputs> = {
        name: asset.name,
        target: asset.target,
        type: asset.type as "IP" | "URL" ,
      };

      // Setup Credential Data (ถ้ามี)
      if (credData) {
        setShowCredential(true);
        setExistingCredentialId(credData.id);
        defaultValues.username = credData.username;
        defaultValues.password = credData.password; // ถ้า Backend ส่ง password กลับมา (ปกติอาจจะไม่ส่ง)
      }

      reset(defaultValues);
    }
  }, [assetData, credData, reset]);

  // 3. Submit Logic (The Core)
  const onSubmit: SubmitHandler<AssetFormInputs> = async (data) => {
    try {
      // --- Part A: Update Asset (ทำเสมอ) ---
      console.log("Updating Asset...");
      await assetService.edit(assetId, {
        name: data.name,
        target: data.target,
        type: data.type,
        project_id: projectId,
      });

      // --- Part B: Handle Credential (4 Cases) ---
      
      // Case 1: เดิมไม่มี -> ใหม่มี (Create)
      if (!existingCredentialId && showCredential) {
         console.log("Creating new Credential...");
         await credentialService.create({
            asset_id: assetId,
            username: data.username || "",
            password: data.password || ""
         });
      }
      
      // Case 2: เดิมมี -> ใหม่มี (Update)
      else if (existingCredentialId && showCredential) {
         console.log("Updating existing Credential...");
         await credentialService.edit(existingCredentialId, {
            asset_id: assetId,
            username: data.username || "",
            password: data.password || ""
         });
      }

      // Case 3: เดิมมี -> ใหม่ไม่มี (Delete)
      else if (existingCredentialId && !showCredential) {
         console.log("Deleting Credential...");
         await credentialService.delete(existingCredentialId);
      }
      

      // Case 4: เดิมไม่มี -> ใหม่ไม่มี (Do nothing)

      // --- Success ---
      router.push(`/projects/${projectId}/asset/${assetId}`);

    } catch (error) {
      console.error("Error updating asset:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไข Asset");
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
    isLoading: isAssetLoading || isCredLoading
  };
};