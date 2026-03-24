"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";

// Hooks & Services
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { GenericFilterButton } from "@/src/components/Common/FilterButton";
import SearchBox from "@/src/components/Common/GenericSearchBox";

import { getMe } from "@/src/services/auth.service";
import { penTestReportService } from "@/src/services/penTestReport.service";

import { CreateReportPayload } from "@/src/types/report";

import { useTable } from "@/src/hooks/use-table";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useProject } from "@/src/hooks/project/use-project";
import { useGetAllAssetNames } from "@/src/hooks/asset/use-getAllNames";
import { useReportDownload } from "@/src/hooks/report/use-ReportDownload";
import { usePenTestReports } from "@/src/hooks/report/use-penTestReports";

// Icons (MUI)
import { Description as ReportIcon, Close as CloseIcon, CheckCircle, Close, Delete } from "@mui/icons-material";
import { GREEN_BUTTON_STYLE } from "@/src/styles/buttonStyle";

// Components
import ReportCard from "@/src/components/reports/ReportCard";
import { Report } from "@/src/types/report";
import { showToast } from "@/src/components/Common/ToastContainer";

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

  const { downloadReport } = useReportDownload(projectId);
  const { data: allAssets } = useGetAllAssetNames(projectId);

  // Table & Fetching Logic
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const filterOptions = [
    { label: "All Status", value: "ALL" },
    { label: "Processing", value: "processing" },
    { label: "Success", value: "success" },
    { label: "Failed", value: "failed" }
  ];

  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleChangePage,
    handleChangeRowsPerPage,
    setRowsPerPageDirectly
  } = useTable();

  const { data: response, isLoading, refetch } = usePenTestReports(
    projectId,
    page + 1,
    rowsPerPage,
    sortBy,
    sortOrder,
    debouncedSearch,
    statusFilter
  );

  // States
  const [openCreate, setOpenCreate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newReport, setNewReport] = useState({
    name: "",
    assets: [] as number[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setCurrentUser(res.user);
      } catch (error) { console.error(error); }
    };
    fetchUser();
  }, []);

  // Handlers
  const handleCreateReport = async () => {
    if (!newReport.name || isNaN(projectId)) return;

    // ✅ Close modal immediately for better UX
    setOpenCreate(false);
    setIsGenerating(true);

    try {
      const payload: CreateReportPayload = {
        reportName: newReport.name,
        assetIds: newReport.assets,
        startDate: newReport.startDate,
        endDate: newReport.endDate,
      };

      await penTestReportService.create(projectId, payload);
      await refetch();
      showToast({
        icon: <CheckCircle sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
        message: "Report Created successfully!",
        borderColor: "#8FFF9C",
        duration: 6000,
      });
      // Reset form
      setNewReport({
        name: "",
        assets: [],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      showToast({
        icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
        message: "Failed to Create report :(",
        borderColor: "#FE3B46",
        duration: 6000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await penTestReportService.delete(projectId, deleteTarget.id);
      showToast({
        icon: <Delete sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
        message: `Report "${deleteTarget.name}" deleted successfully!`,
        borderColor: "#8FFF9C",
        duration: 6000,
      });
      setDeleteTarget(null);
      await refetch();
    } catch (error) {
      showToast({
        icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
        message: "Failed to delete report :(",
        borderColor: "#FE3B46",
        duration: 6000,
      });
    }
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const onDownloadPdf = (report: Report) => {
    downloadReport(report.id, "pdf", projectId, report.file_path_pdf || report.name);
  };

  const onDownloadDocx = (report: Report) => {
    downloadReport(report.id, "docx", projectId, report.file_path_word || report.name);
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

      {/* Header & Search (คงเดิม) */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-full flex flex-col">
          <h1 className="font-bold text-[36px]">Report Center</h1>
          <p className="text-[#9AA6A8]">Generate and manage your Penetration Testing Reports.</p>
        </div>
      </div>

      <div className="my-6 mb-8 flex justify-between">
        {/* Search bar */}
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Reports"
          className="w-full max-w-md"
        />

        <div className="flex gap-8 items-center">
          <GenericFilterButton
            options={filterOptions}
            currentValue={statusFilter}
            onSelect={handleFilterChange}
          />
          <button onClick={() => setOpenCreate(true)} className={`${GREEN_BUTTON_STYLE} whitespace-nowrap`}>
            Generate Report <ReportIcon className="ml-2" />
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-4 min-h-[400px]">
        {isLoading ? (
          <Spinner />
        ) : reports.length > 0 ? (
          <>
            {reports.map((report, idx) => (
              <ReportCard
                index={idx}
                key={report.id}
                report={report}
                onDelete={() => setDeleteTarget(report)}
                onDownloadPdf={onDownloadPdf}
                onDownloadDocx={onDownloadDocx}
              />
            ))}

            <div className="mt-8">
              <GenericPagination
                count={totalCnt}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(newPage) => handleChangePage(null, newPage)}
                onRowsPerPageChange={(newSize) => setRowsPerPageDirectly(newSize)}
                labelRowsPerPage="Reports per page:"
              />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#2D2F39] py-20 text-center">
            <p className="text-[#404F57]">No reports found.</p>
          </div>
        )}
      </div>

      {/* ── Dialog: Create Report ──────────────────────────────────────────── */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-2xl border border-[#2D2F39] bg-[#1E2429] p-6 shadow-2xl relative">

            {/* Loading Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-[#1E2429]/80 z-10 flex flex-col items-center justify-center rounded-2xl">
                <Spinner />
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FFF9C] animate-pulse">
                  Generating Report
                </p>
              </div>
            )}

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#FBFBFB]">
                Generate Pentest Report
              </h2>
              <button
                onClick={() => setOpenCreate(false)}
                className="rounded-lg p-1 text-[#9AA6A8] transition-colors hover:bg-[#FE3B46]/10 hover:text-[#FE3B46]"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {/* Report Name */}
              <div>
                <label className={labelCls}>Report Name</label>
                <input
                  className={inputCls}
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="e.g. Q1_Security_Vulnerability_Scan"
                />
              </div>

              {/* Multi-select Asset Scope */}
              <div>
                <label className={labelCls}>
                  Asset Scope {newReport.assets.length > 0 ? `(${newReport.assets.length} Selected)` : "(All Assets)"}
                </label>

                <div className="mt-2 flex flex-col gap-1 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar border border-[#2D2F39] rounded-xl p-2 bg-[#0D1014]">

                  {/* Option: All Assets (Default) */}
                  <div
                    onClick={() => setNewReport({ ...newReport, assets: [] })}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border ${newReport.assets.length === 0
                      ? "bg-[#8FFF9C]/10 border-[#8FFF9C]/40"
                      : "border-transparent hover:bg-[#1E2429]"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${newReport.assets.length === 0 ? "bg-[#8FFF9C] border-[#8FFF9C]" : "border-[#404F57]"
                      }`}>
                      {newReport.assets.length === 0 && <CloseIcon sx={{ fontSize: 14, color: "#0D1014" }} />}
                    </div>
                    <span className={`text-sm font-bold uppercase tracking-wider ${newReport.assets.length === 0 ? "text-[#8FFF9C]" : "text-[#9AA6A8]"
                      }`}>
                      All Assets (Default)
                    </span>
                  </div>

                  <div className="h-[1px] bg-[#2D2F39] my-1 mx-2" />

                  {/* Render Asset List from API */}
                  {allAssets?.map((asset) => {
                    const isSelected = newReport.assets.includes(asset.id);
                    return (
                      <div
                        key={asset.id}
                        onClick={() => {
                          const nextAssets = isSelected
                            ? newReport.assets.filter(id => id !== asset.id)
                            : [...newReport.assets, asset.id];
                          setNewReport({ ...newReport, assets: nextAssets });
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border ${isSelected
                          ? "bg-[#8FFF9C]/10 border-[#8FFF9C]/40"
                          : "border-transparent hover:bg-[#1E2429]"
                          }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${isSelected ? "bg-[#8FFF9C] border-[#8FFF9C]" : "border-[#404F57]"
                          }`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-[#0D1014] rounded-sm" />}
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? "text-[#FBFBFB]" : "text-[#9AA6A8]"}`}>
                          {asset.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-[10px] text-[#404F57] italic">
                  * Leave "All Assets" selected if you want to include every asset in the report.
                </p>
              </div>

              {/* Date Range Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Testing Start</label>
                  <input
                    type="date"
                    className={`${inputCls} `}
                    value={newReport.startDate}
                    onChange={(e) => setNewReport({ ...newReport, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Testing End</label>
                  <input
                    type="date"
                    className={`${inputCls} `}
                    value={newReport.endDate}
                    onChange={(e) => setNewReport({ ...newReport, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-5 py-2 text-xs font-black uppercase tracking-widest text-[#9AA6A8] hover:text-[#FBFBFB] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!newReport.name || isGenerating}
                onClick={() => handleCreateReport()}
                className="rounded-xl bg-[#8FFF9C] px-8 py-2.5 text-xs font-black uppercase tracking-widest text-[#0D1014] shadow-[0_0_20px_rgba(143,255,156,0.3)] transition-all hover:bg-[#AFFFB9] disabled:opacity-30 active:scale-95"
              >
                {isGenerating ? "Processing..." : "Generate"}
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