"use client";

import {
    Delete as DeleteIcon,
    Description as ReportIcon,
    PictureAsPdf as PdfIcon,
    Article as DocxIcon,
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
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#0D1014] px-2 py-1 text-xs text-[#FBFBFB] opacity-0 ring-1 ring-[#2D2F39] transition-opacity group-hover:opacity-100">
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
    return (
        <div className="rounded-2xl border-[2px] border-[rgba(64,79,87,0.4)] border-t-0 overflow-hidden transition-colors
        transition-transform duration-200 cursor-pointer
        animate-card-in opacity-0" style={{ animationDelay: `${index * 80}ms` }}>
            {/* Top accent line */}
            <div className="h-0.5 w-full bg-[#8FFF9C]" />

            <div>
                {/* Top row — icon + name + actions */}
                <div className="flex items-center justify-between gap-4 bg-[#1A2025] p-4 px-6">
                    <div className="flex items-center gap-3 min-w-0">
                        <ReportIcon sx={{ fontSize: 28 }} className="shrink-0 text-[#8FFF9C]" />
                        <div className="min-w-0">
                            <p className="truncate font-bold text-[#FBFBFB]">{report.name}</p>
                            <p className="text-xs text-[#9AA6A8] mt-0.5">Created by {report.createdBy}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Download PDF */}
                        <Tooltip label="Download PDF">
                            <button
                                onClick={() => onDownloadPdf?.(report)}
                                className="group/btn flex items-center gap-1.5 rounded-lg border border-[#E53935]/50 px-3 py-1.5 text-[#E53935] transition-all hover:bg-[#E53935] hover:border-[#E53935]"
                            >
                                <PdfIcon fontSize="small" className="transition-colors group-hover/btn:text-white" />
                                <span className="text-xs font-semibold transition-colors group-hover/btn:text-white">PDF</span>
                            </button>
                        </Tooltip>

                        {/* Download DOCX */}
                        <Tooltip label="Download DOCX">
                            <button
                                onClick={() => onDownloadDocx?.(report)}
                                className="group/btn flex items-center gap-1.5 rounded-lg border border-[#1E88E5]/50 px-3 py-1.5 text-[#1E88E5] transition-all hover:bg-[#1E88E5] hover:border-[#1E88E5]"
                            >
                                <DocxIcon fontSize="small" className="transition-colors group-hover/btn:text-white" />
                                <span className="text-xs font-semibold transition-colors group-hover/btn:text-white">DOCX</span>
                            </button>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip label="Delete Report">
                            <button
                                onClick={() => onDelete(report)}
                                className="group/btn flex items-center gap-1.5 rounded-lg border border-[#FE3B46]/50 px-3 py-1.5 text-[#FE3B46] transition-all hover:bg-[#FE3B46] hover:border-[#FE3B46]"
                            >
                                <DeleteIcon fontSize="small" className="transition-colors group-hover/btn:text-white" />
                                <span className="text-xs font-semibold transition-colors group-hover/btn:text-white">Delete</span>
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#2D2F39]" />

                {/* Meta row */}
                <div className="flex items-center gap-6 bg-[#0F1518] p-4 px-6">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#404F57]">
                            Asset Scope
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#FBFBFB]">{report.asset}</p>
                    </div>
                    <div className="h-8 w-px bg-[#2D2F39]" />
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#404F57]">
                            Testing Period
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#FBFBFB]">
                            {report.startDate} – {report.endDate}
                        </p>
                    </div>
                    <div className="h-8 w-px bg-[#2D2F39]" />
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#404F57]">
                            Generated
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#FBFBFB]">{report.createdDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}