"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";

// Hooks & Services
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { useProject } from "@/src/hooks/project/use-project";
import { getMe } from "@/src/services/auth.service";
import { useReportDownload } from "@/src/hooks/report/use-ReportDownload";
import { penTestReportService } from "@/src/services/penTestReport.service";
import { useGetAllAssetNames } from "@/src/hooks/asset/use-getAllNames"; // 🆕 Import hook สำหรับดึง Asset จริง
import { usePenTestReports } from "@/src/hooks/report/use-penTestReports";
import { CreateReportPayload } from "@/src/types/report";
import { useTable } from "@/src/hooks/use-table";
import { useDebounce } from "@/src/hooks/use-debounce";

// Icons (MUI)
import { Description as ReportIcon, Close as CloseIcon } from "@mui/icons-material";
import { FILTER_BUTTON_STYLE, GREEN_BUTTON_STYLE } from "@/src/styles/buttonStyle";

// Components
import ReportCard from "@/src/components/reports/ReportCard";
import { Report } from "@/src/types/report";
import { INPUT_BOX_WITH_ICON_STYLE_DIV, INPUT_BOX_WITH_ICON_STYLE_INPUT } from "@/src/styles/inputBoxStyle";
import MagIcon from "@/src/components/icon/MagnifyingGlass";
import FilterIcon from "@/src/components/icon/Filter";

// ── Tiny reusable atoms ───────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center p-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8FFF9C] border-t-transparent" />
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-[#2D2F39] bg-[#0D1014] px-3 py-2.5 text-sm text-[#FBFBFB] placeholder:text-[#404F57] focus:border-[#8FFF9C] focus:outline-none transition-colors";

const labelCls =
  "mb-1.5 block text-xs font-semibold text-[#404F57] uppercase tracking-wider";

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportCenterPage() {
  const { id: projectIdStr } = useParams();
  const projectId = parseInt(projectIdStr as string);

  const { downloadReport, isLoading: isDownloading } = useReportDownload();
  const { data: allAssets } = useGetAllAssetNames(projectId);

  // All Report
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { page, rowsPerPage, sortBy, sortOrder, handleChangePage, handleChangeRowsPerPage } = useTable();
  const { data: response, isLoading, refetch } = usePenTestReports(projectId, page + 1, rowsPerPage, sortBy, sortOrder, debouncedSearch, statusFilter);

  // ── State ──
  const [openCreate, setOpenCreate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // 🆕 สำหรับ Loading ตอนสร้าง
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newReport, setNewReport] = useState({
    name: "",
    asset: "", // 🆕 จะเก็บเป็น Asset ID (string จาก select value)
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setCurrentUser(res.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  // ── Logic ──
  const isOwner = project?.role?.toLowerCase() === "owner";

  // ── Handlers ──
  const handleCreateReport = async () => {
    if (!newReport.name || !newReport.asset || isNaN(projectId)) return;

    setIsGenerating(true);
    try {
      const payload: CreateReportPayload = {
        reportName: newReport.name,
        assetIds: [Number(newReport.asset)], 
        startDate: newReport.startDate,
        endDate: newReport.endDate,
      };

      const response = await penTestReportService.create(projectId, payload);

      setOpenCreate(false);
      setNewReport({ ...newReport, name: "", asset: "" });

    } catch (error) {
      console.error("Failed to create report:", error);
 
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (report: Report) => setDeleteTarget(report);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setDeleteTarget(null);
  };

  if (isProjectLoading) return <Spinner />;

  const reports = response?.items || [];
  const totalCnt = response?.total || 0;

  return (
    <div className="text-[#E6F0E6]">
      <GenericBreadcrums
        items={[
          { label: "Home", href: "/main" },
          { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
          { label: "Report Center", href: undefined },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div className="w-full flex flex-col">
          <h1 className="font-bold text-[36px]">Report Center</h1>
          <p className="text-[#9AA6A8]">Generate and manage your Penetration Testing Reports.</p>
        </div>
      </div>

      <div className="my-6 mb-8 flex justify-between">
        <div className={INPUT_BOX_WITH_ICON_STYLE_DIV}>
          <MagIcon />
          <input
            type="text"
            placeholder="Search Reports..."
            className={INPUT_BOX_WITH_ICON_STYLE_INPUT}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-8 items-center">
          <button onClick={() => alert("Filter logic here")} className={FILTER_BUTTON_STYLE}>
            Filter <FilterIcon />
          </button>
          <button onClick={() => setOpenCreate(true)} className={`${GREEN_BUTTON_STYLE} whitespace-nowrap`}>
            Generate Report <ReportIcon className="ml-2" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reports.map((report, index) => (
          <ReportCard
            index={index}
            key={report.id}
            report={report}
            onDelete={handleDelete}
            onDownloadPdf={() => downloadReport(report.id, "pdf", report.file_path_pdf)}
            onDownloadDocx={() => downloadReport(report.id, "docx", report.file_path_word)}
          />
        ))}

        {reports.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#2D2F39] py-20 text-center">
            <p className="text-[#404F57]">No reports found.</p>
          </div>
        )}
      </div>

      {/* ── Dialog: Create Report ──────────────────────────────────────────── */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2D2F39] bg-[#1E2429] p-6 shadow-2xl relative">
            {isGenerating && (
                <div className="absolute inset-0 bg-[#1E2429]/80 z-10 flex items-center justify-center rounded-2xl">
                    <Spinner />
                </div>
            )}
            
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#FBFBFB]">Generate Pentest Report</h2>
              <button onClick={() => setOpenCreate(false)} className="text-[#9AA6A8] hover:text-[#FBFBFB]">
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Report Name</label>
                <input
                  className={inputCls}
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="e.g. Security_Audit_Q1"
                />
              </div>

              <div>
                <label className={labelCls}>Select Asset Scope</label>
                <select
                  className={inputCls}
                  value={newReport.asset}
                  onChange={(e) => setNewReport({ ...newReport, asset: e.target.value })}
                >
                  <option value="" disabled className="text-[#404F57]">Select an asset...</option>
                  {allAssets?.map((asset) => (
                    <option key={asset.id} value={asset.id} className="bg-[#0D1014]">
                      {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Testing Start</label>
                  <input
                    type="date"
                    className={inputCls}
                    value={newReport.startDate}
                    onChange={(e) => setNewReport({ ...newReport, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Testing End</label>
                  <input
                    type="date"
                    className={inputCls}
                    value={newReport.endDate}
                    onChange={(e) => setNewReport({ ...newReport, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setOpenCreate(false)} className="px-4 py-2 text-sm text-[#FBFBFB] hover:bg-[#2D2F39] rounded-lg">
                Cancel
              </button>
              <button
                disabled={!newReport.name || !newReport.asset || isGenerating}
                onClick={handleCreateReport}
                className="rounded-lg bg-[#8FFF9C] px-5 py-2 text-sm font-extrabold text-[#0D1014] disabled:opacity-40"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <GenericDeleteModal
          open={!!deleteTarget}
          entityName={deleteTarget.name}
          entityType="Report"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}