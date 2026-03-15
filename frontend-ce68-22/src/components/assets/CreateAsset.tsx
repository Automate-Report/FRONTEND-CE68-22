"use client";

import { useEffect } from "react";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";

// Hooks & Logic
import { useCreateAssetLogic } from "@/src/hooks/asset/use-createAssetLogic";

// UI Components (ต้องเข้าไปแก้ให้เป็น Tailwind/Native ข้างในด้วยนะครับ)
import { AssetBasicInfo } from "@/src/components/assets/create/AssetBasicInfo";
import { CredentialForm } from "@/src/components/assets/create/CredentialForm";

interface CreateAssetModalProps {
  projectName: string;
  open: boolean;
  onClose: () => void;
  projectId: number;
}

export default function CreateAssetModal({ projectName, open, onClose, projectId }: CreateAssetModalProps) {
  const {
    formMethods,
    currentAssetType,
    showCredential,
    setShowCredential,
    showPassword,
    setShowPassword,
    handleFormSubmit
  } = useCreateAssetLogic(projectId, onClose);

  // ป้องกันการ Scroll พื้นหลังเมื่อ Modal เปิด
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop (พื้นหลังมืดจางๆ) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#161B1F] border-2 border-[#2D2F39] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2D2F39] bg-[#1E2429] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8FFF9C]/10 rounded-lg">
              <AddIcon className="text-[#8FFF9C]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#FBFBFB] uppercase tracking-tight">Create New Asset</h2>
              <p className="text-[11px] text-[#667a85] font-bold uppercase tracking-wider">Project name: #{projectName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#404F57] hover:text-[#FE3B46] hover:bg-[#FE3B46]/10 rounded-xl transition-all"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <form 
          onSubmit={handleFormSubmit} 
          className="p-8 overflow-y-auto custom-scrollbar space-y-8"
        >
          {/* ส่วนข้อมูลพื้นฐาน */}
          <div className="space-y-2">
            <AssetBasicInfo 
              formMethods={formMethods} 
              currentAssetType={currentAssetType} 
            />
          </div>

          <div className="h-[1px] bg-[#2D2F39] opacity-50" />

          {/* ส่วน Credential */}
          <div className="space-y-2">
            <CredentialForm 
              formMethods={formMethods}
              showCredential={showCredential}
              setShowCredential={setShowCredential}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#2D2F39] bg-[#1E2429] flex justify-end gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-black text-[#9AA6A8] hover:text-[#FBFBFB] transition-colors"
          >
            CANCEL
          </button>
          <button 
            type="submit"
            onClick={handleFormSubmit}
            className="px-8 py-2.5 bg-[#8FFF9C] text-[#0D1014] rounded-xl text-sm font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(143,255,156,0.4)] transition-all active:scale-95"
          >
            Create Asset
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #161B1F;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2D2F39;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #404F57;
        }
      `}</style>
    </div>
  );
}