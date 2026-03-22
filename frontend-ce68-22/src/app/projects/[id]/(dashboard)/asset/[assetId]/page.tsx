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
                router.push(`/projects/${projectId}/asset`);
            } else {
                await assetCredentialService.delete(deleteTarget.id);
                await refetchCredential();
            }
            setDeleteModalOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            alert("Failed to delete item");
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        asset.type === "IP" 
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
            <h2 className="text-[#E6F0E6] font-bold text-2xl mb-4">Credentials</h2>
            
            {credential ? (
                <div className="w-full overflow-hidden border border-[#E6F0E6]/30 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0F1518]">
                                <th className="px-6 py-4 text-[#E6F0E6] text-center font-bold border-b border-[#E6F0E6]/20 w-[45%]">Username</th>
                                <th className="px-6 py-4 text-[#E6F0E6] text-center font-bold border-b border-[#E6F0E6]/20 w-[45%]">Password</th>
                                <th className="px-6 py-4 border-b border-[#E6F0E6]/20 w-[10%]"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#FBFBFB]">
                            <tr>
                                <td className="px-6 py-4 text-[#404F57] text-center font-medium border-none">
                                    {credential.username}
                                </td>
                                <td className="px-6 py-4 text-[#404F57] text-center font-medium border-none">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={showPassword ? "font-sans" : "font-mono tracking-widest text-lg"}>
                                            {showPassword ? credential.password : "••••••••"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-none text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-[#9AA6A8] hover:text-[#404F57] transition-colors"
                                        >
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                        </button>
                                        <button 
                                            onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)}
                                            className="text-[#0B0F12] hover:opacity-70 transition-opacity"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button 
                                            onClick={handleDeleteCredentialClick}
                                            className="text-[#FE3B46] hover:opacity-70 transition-opacity"
                                        >
                                            <DeleteOutlineIcon sx={{ fontSize: 22 }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-10 bg-white/5 border border-dashed border-white/20 rounded-2xl text-center">
                    <p className="text-[#9AA6A8] mb-2 text-lg">No credentials linked to this asset.</p>
                    {role?.toLocaleLowerCase() !== "developer" && (
                        <button 
                            onClick={() => router.push(`/projects/${projectId}/asset/${assetId}/edit`)}
                            className="text-[#8FFF9C] font-bold hover:underline"
                        >
                            Add Credentials
                        </button>
                    )}
                    
                </div>
            )}

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