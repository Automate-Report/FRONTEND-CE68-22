"use client";

import {
    Delete as DeleteIcon,
    Description as ReportIcon,
    PictureAsPdf as PdfIcon,
    Article as DocxIcon,
    HourglassEmpty as PendingIcon,
    CheckCircle as SuccessIcon,
    Error as FailedIcon,
} from "@mui/icons-material";
import { Report } from "@/src/types/report";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ReportCardProps {
    index: number
    report: Report;
    onDelete: (report: Report) => void;
    onDownloadPdf?: (report: Report) => void;
    onDownloadDocx?: (report: Report) => void;
}

// ── Internal atom ─────────────────────────────────────────────────────────────
function Tooltip({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="group relative inline-flex">
            {children}
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#0D1014] px-2 py-1 text-xs text-[#FBFBFB] opacity-0 ring-1 ring-[#2D2F39] transition-opacity group-hover:opacity-100 z-10">
                {label}
            </span>
        </div>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReportCard({
    index,
    report,
    onDelete,
    onDownloadPdf,
    onDownloadDocx,
}: ReportCardProps) {
    const isSuccess = report.status === "success";
    const isPending = report.status === "pending";
    const isFailed = report.status === "failed";

    // กำหนดสไตล์ตามสถานะ
    const statusConfig = {
        success: { color: "text-[#8FFF9C]", icon: <SuccessIcon fontSize="inherit" />, label: "Success", bg: "bg-[#8FFF9C]/10" },
        pending: { color: "text-[#FFD54F]", icon: <PendingIcon fontSize="inherit" className="animate-spin-slow" />, label: "Processing", bg: "bg-[#FFD54F]/10" },
        failed: { color: "text-[#FE3B46]", icon: <FailedIcon fontSize="inherit" />, label: "Failed", bg: "bg-[#FE3B46]/10" },
    };

    const currentStatus = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <div className="rounded-2xl border-[2px] border-[rgba(64,79,87,0.4)] border-t-0 overflow-hidden transition-all
        hover:border-[rgba(64,79,87,0.8)] animate-card-in opacity-0" style={{ animationDelay: `${index * 80}ms` }}>
            {/* Top accent line */}
            <div className={`h-0.5 w-full ${isSuccess ? "bg-[#8FFF9C]" : isFailed ? "bg-[#FE3B46]" : "bg-[#FFD54F]"}`} />

            <div className="bg-[#1A2025]">
                {/* Top row — icon + name + status + actions */}
                <div className="flex items-center justify-between gap-4 p-4 px-6">
                    <div className="flex items-center gap-3 min-w-0">
                        <ReportIcon sx={{ fontSize: 28 }} className={`shrink-0 ${isSuccess ? "text-[#8FFF9C]" : "text-[#9AA6A8]"}`} />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="truncate font-bold text-[#FBFBFB]">{report.name}</p>
                                {/* Status Badge */}
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentStatus.bg} ${currentStatus.color}`}>
                                    {currentStatus.icon}
                                    {currentStatus.label}
                                </div>
                            </div>
                            <p className="text-xs text-[#9AA6A8] mt-0.5">Created by {report.created_by}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Download PDF */}
                        <Tooltip label={isSuccess ? "Download PDF" : `Cannot download (${currentStatus.label})`}>
                            <button
                                disabled={!isSuccess}
                                onClick={() => onDownloadPdf?.(report)}
                                className={`group/btn flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-all
                                    ${isSuccess 
                                        ? "border-[#E53935]/50 text-[#E53935] hover:bg-[#E53935] hover:text-white" 
                                        : "border-[#2D2F39] text-[#2D2F39] cursor-not-allowed"}`}
                            >
                                <PdfIcon fontSize="small" />
                                <span className="text-xs font-semibold">PDF</span>
                            </button>
                        </Tooltip>

                        {/* Download DOCX */}
                        <Tooltip label={isSuccess ? "Download DOCX" : `Cannot download (${currentStatus.label})`}>
                            <button
                                disabled={!isSuccess}
                                onClick={() => onDownloadDocx?.(report)}
                                className={`group/btn flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-all
                                    ${isSuccess 
                                        ? "border-[#1E88E5]/50 text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white" 
                                        : "border-[#2D2F39] text-[#2D2F39] cursor-not-allowed"}`}
                            >
                                <DocxIcon fontSize="small" />
                                <span className="text-xs font-semibold">DOCX</span>
                            </button>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip label="Delete Report">
                            <button
                                onClick={() => onDelete(report)}
                                className="group/btn flex items-center gap-1.5 rounded-lg border border-[#FE3B46]/50 px-3 py-1.5 text-[#FE3B46] transition-all hover:bg-[#FE3B46] hover:text-white"
                            >
                                <DeleteIcon fontSize="small" />
                                <span className="text-xs font-semibold">Delete</span>
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#2D2F39]" />

                {/* Meta row */}
                <div className="flex items-center gap-6 bg-[#0F1518] p-4 px-6">
                    <div className="min-w-[100px]">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#404F57]">
                            Asset Scope
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#FBFBFB] truncate">{report.asset}</p>
                    </div>
                    <div className="h-8 w-px bg-[#2D2F39]" />
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#404F57]">
                            Testing Period
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#FBFBFB]">
                            {report.start_date} – {report.end_date}
                        </p>
                    </div>
                    <div className="h-8 w-px bg-[#2D2F39]" />
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#404F57]">
                            Generated
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#FBFBFB]">{report.created_date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}