"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Icons (MUI Icons)
import EditIcon from "@/src/components/icon/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Services
import { assetService } from "@/src/services/asset.service";
import { assetCredentialService } from "@/src/services/assetCredential.service";

// Hooks & Components
import { useProject } from "@/src/hooks/project/use-project";
import { useAsset } from "@/src/hooks/asset/use-asset";
import { useProjectRole } from "@/src/context/ProjectDetailConext";
import { useCredentialByAsset } from "@/src/hooks/use-credential";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";

// Types
import { Asset, Credential } from "@/src/types/asset";

import { RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import { showToast } from "@/src/components/Common/ToastContainer";
import { Close, Delete } from "@mui/icons-material";

export default function ViewAssetPage() {
    const router = useRouter();
    const params = useParams<{ id: string; assetId: string }>();
    const projectId = parseInt(params.id);
    const assetId = parseInt(params.assetId);
    const { role } = useProjectRole();



    // --- States ---
    const [showPassword, setShowPassword] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        type: 'ASSET' | 'CREDENTIAL';
        id: number;
        name: string
    } | null>(null);

    // --- Fetch Data ---
    const { data: project } = useProject(projectId);
    const { data: assetData, isLoading: isAssetLoading } = useAsset(assetId);
    const { data: credData, isLoading: isCredLoading, refetch: refetchCredential } = useCredentialByAsset(assetId);

    // --- Helpers ---
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (isAssetLoading || isCredLoading) {
        return (
            <div className="flex justify-center mt-20">
                <div className="w-10 h-10 border-4 border-[#8FFF9C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!assetData) return <p className="text-[#E6F0E6]">Asset not found</p>;

    const asset = assetData as Asset;
    const credential = credData as Credential | undefined;

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Loading", href: `/projects/${projectId}/overview` },
        { label: "Asset", href: `/projects/${projectId}/asset` },
        { label: asset.name, href: undefined }
    ];

    // --- Delete Handlers ---
    const handleDeleteAssetClick = () => {
        setDeleteTarget({ type: 'ASSET', id: asset.id, name: asset.name });
        setDeleteModalOpen(true);
    };

    const handleDeleteCredentialClick = () => {
        if (!credential) return;
        setDeleteTarget({ type: 'CREDENTIAL', id: credential.id, name: credential.username });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            if (deleteTarget.type === 'ASSET') {
                if (credential) await assetCredentialService.delete(credential.id);
                await assetService.delete(deleteTarget.id);
                showToast({
                    icon: <Delete sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
                    message: `Asset "${asset.name}" deleted successfully!`,
                    borderColor: "#8FFF9C",
                    duration: 6000,
                });
                router.push(`/projects/${projectId}/asset`);
            } else {
                await assetCredentialService.delete(deleteTarget.id);
                await refetchCredential();
            }
            setDeleteModalOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            showToast({
                icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
                message: "Failed to delete asset :(",
                borderColor: "#FE3B46",
                duration: 6000,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="pb-10 font-sans">
            <GenericBreadcrums items={breadcrumbItems} />

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-[#E6F0E6] font-bold text-4xl tracking-tight">
                        {asset.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${asset.type === "IP"
                        ? "bg-[#8FFF9C]/20 text-[#8FFF9C]"
                        : "bg-[#90caf9]/20 text-[#90caf9]"
                        }`}>
                        {asset.type}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDeleteAssetClick}
                        className="px-6 py-2 rounded-lg border border-[#FE3B46] text-[#FE3B46] font-medium transition-all hover:bg-[#FE3B46] hover:text-white active:scale-95"
                    >
                        Delete
                    </button>
                    {role?.toLowerCase() !== "developer" && (
                        <button
                            onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)}
                            className="px-6 py-2 rounded-lg bg-[#8FFF9C] text-[#0B0F12] font-medium flex items-center gap-2 transition-all hover:bg-[#AFFFB9] active:scale-95"
                        >
                            <span>Edit</span>
                            <EditIcon />
                        </button>
                    )}
                </div>
            </div>

            {/* --- Asset Target Box --- */}
            <div className="mb-10">
                <h2 className="text-[#E6F0E6] font-bold text-2xl mb-4">Asset</h2>
                <div className="flex justify-between items-center bg-[#272D31] rounded-xl px-4 py-1 border border-white/5 shadow-inner">
                    <span className="text-[#E6F0E6] text-base font-medium">{asset.target}</span>
                    <button
                        onClick={() => handleCopy(asset.target)}
                        className="text-[#9AA6A8] hover:text-[#E6F0E6] transition-colors p-1"
                        title="Copy to clipboard"
                    >
                        <ContentCopyIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* --- Credentials Section --- */}
            <div className="mt-8 mb-4 font-sans">
                {/* Header: Title & Remove/Edit Actions */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#E6F0E6] font-bold text-xl tracking-tight">
                        Asset Credentials
                    </h3>
                    {credential && role?.toLowerCase() !== "developer" && (
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteCredentialClick}
                                className="cursor-pointer flex items-center gap-1 text-[#FE3B46] font-bold text-sm hover:brightness-125 transition-all"
                            >
                                <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                            </button>
                            <button
                                onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)}
                                className="cursor-pointer flex items-center gap-1 text-[#8FFF9C] font-bold text-sm hover:brightness-110 transition-all"
                            >
                                <EditIcon />
                            </button>

                        </div>
                    )}
                </div>

                {credential ? (
                    /* Credentials Display Table: สไตล์เดียวกับหน้า Create/Edit */
                    <div className="w-full overflow-hidden border border-[#2D2F39] rounded-2xl bg-[#0B0F12]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#1A2025]">
                                    <th className="px-6 py-3 text-[#9AA6A8] text-[11px] font-black uppercase tracking-widest border-b border-[#2D2F39]">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-[#9AA6A8] text-[11px] font-black uppercase tracking-widest border-b border-[#2D2F39]">
                                        Password
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="group">
                                    <td className="px-6 py-4 align-middle border-none">
                                        <div className="w-full bg-[#1A2025]/50 text-[#E6F0E6] text-sm px-4 py-2.5 rounded-xl border border-[#2D2F39]">
                                            {credential.username}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle border-none">
                                        <div className="relative">
                                            <div className="w-full bg-[#1A2025]/50 text-[#E6F0E6] text-sm px-4 py-2.5 rounded-xl border border-[#2D2F39] flex items-center justify-between">
                                                <span className={showPassword ? "font-sans" : "font-mono tracking-[0.2em] text-lg text-[#8FFF9C]"}>
                                                    {showPassword ? credential.password : "••••••••"}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-[#667a85] hover:text-[#E6F0E6] transition-colors p-1 cursor-pointer"
                                                >
                                                    {showPassword ? <Visibility sx={{ fontSize: 20 }} /> : <VisibilityOff sx={{ fontSize: 20 }} />}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* กรณีไม่มี Credential */
                    <div className="space-y-3">
                        {role?.toLowerCase() !== "developer" && (
                            <button
                                type="button"
                                onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)}
                                className="flex items-center gap-2 px-6 py-2.5 border border-[#E6F0E6] text-[#E6F0E6] 
                                        rounded-lg font-bold text-sm transition-all hover:border-[#8FFF9C] 
                                        hover:text-[#8FFF9C] hover:bg-[#8FFF9C]/5 active:scale-95 cursor-pointer"
                            >
                                Add Asset Credentials
                            </button>
                        )}
                        <p className="text-[#667a85] text-xs px-1 italic">No credentials linked to this asset.</p>
                    </div>
                )}

                {/* Bottom Hint */}
                <p className="mt-4 text-[#667a85] text-[11px] font-medium opacity-60">
                    * Note: Your credentials are encrypted using AES-256 before being stored.
                </p>
            </div>

            {/* Modal */}
            {deleteTarget && (
                <GenericDeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    entityType={deleteTarget.type === 'ASSET' ? 'Asset' : 'Credential'}
                    entityName={deleteTarget.name}
                    loading={isDeleting}
                />
            )}
        </div>
    );
}