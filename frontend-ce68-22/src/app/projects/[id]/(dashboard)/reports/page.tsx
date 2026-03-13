"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";

// Hooks & Services
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { useProject } from "@/src/hooks/project/use-project";
import { getMe } from "@/src/services/auth.service";

// Icons (MUI)
import { Description as ReportIcon, Close as CloseIcon } from "@mui/icons-material";
import { FILTER_BUTTON_STYLE, GREEN_BUTTON_STYLE } from "@/src/styles/buttonStyle";

// Components
import ReportCard from "@/src/components/reports/ReportCard";
import { Report } from "@/src/types/report";
import { INPUT_BOX_WITH_ICON_STYLE_DIV, INPUT_BOX_WITH_ICON_STYLE_INPUT } from "@/src/styles/inputBoxStyle";
import MagIcon from "@/src/components/icon/MagnifyingGlass";
import FilterIcon from "@/src/components/icon/Filter";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import CreateScheduleIcon from "@/src/components/icon/CreateSchedule";

// ── Sample Data ──────────────────────────────────────────────────────────────
const INITIAL_REPORTS: Report[] = [
  {
    id: 101,
    name: "Pentest_WebApp_Q1",
    asset: "All Assets",
    date: "2026-03-01",
    created_by: "pentester@ai.com",
    startDate: "2026-02-01",
    endDate: "2026-03-01",
  },
  {
    id: 102,
    name: "API_Security_Audit",
    asset: "Mobile API",
    date: "2026-02-15",
    created_by: "owner@ai.com",
    startDate: "2026-02-01",
    endDate: "2026-02-15",
  },
];

const ASSET_OPTIONS = ["All Assets", "Internal Web", "Mobile API", "Cloud Infra"];

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

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // ── State ──
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newReport, setNewReport] = useState({
    name: "",
    asset: "All Assets",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // ── Data Fetching ──
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

  // ── Permissions & Filtering ──
  const isOwner = project?.role?.toLowerCase() === "owner";

  const filteredReports = useMemo(() => {
    if (!currentUser) return [];
    if (isOwner) return reports;
    return reports.filter(
      (r) =>
        r.created_by === currentUser.email ||
        r.created_by === currentUser.username
    );
  }, [reports, currentUser, isOwner]);

  // ── Handlers ──
  const handleCreateReport = () => {
    const reportData: Report = {
      id: Date.now(),
      name: newReport.name,
      asset: newReport.asset,
      date: new Date().toISOString().split("T")[0],
      created_by: currentUser?.email || "me",
      startDate: newReport.startDate,
      endDate: newReport.endDate,
    };
    setReports([reportData, ...reports]);
    setOpenCreate(false);
    setNewReport({ ...newReport, name: "" });
  };

  const handleDelete = (report: Report) => setDeleteTarget(report);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setReports(reports.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const showFilter = () => {
    // Logic to show filter options (e.g., open a modal or dropdown)
    alert("Show filter options");
  }

  if (isProjectLoading) return <Spinner />;

  return (
    <div className="text-[#E6F0E6]">
      {/* Breadcrumbs */}
      <GenericBreadcrums
        items={[
          { label: "Home", href: "/main" },
          { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
          { label: "Report Center", href: undefined },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-full flex flex-col">
          <h1 className="font-bold text-[36px]">Report Center</h1>
          <p className="text-[#9AA6A8]">Generate and manage your Penetration Testing Reports.</p>
        </div>
      </div>

      {/* Search bar and button */}
      <div className="my-6 mb-8 flex justify-between">

        {/* Search bar */}
        <div className={INPUT_BOX_WITH_ICON_STYLE_DIV}>
          <MagIcon />
          <input
            type="text"
            placeholder="Search Projects"
            className={INPUT_BOX_WITH_ICON_STYLE_INPUT}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-8 items-center">
          <button
            onClick={showFilter}
            className={FILTER_BUTTON_STYLE}
          >
            Filter <FilterIcon />
          </button>

          <button
            onClick={() => setOpenCreate(true)}
            className={`${GREEN_BUTTON_STYLE} whitespace-nowrap`}
          >
            Generate Report
            <ReportIcon />
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-4">
        {filteredReports.map((report, index) => (
          <ReportCard
            index={index}
            key={report.id}
            report={report}
            onDelete={handleDelete}
            onDownloadPdf={(r: Report) => console.log("Download PDF", r.id)}
            onDownloadDocx={(r: Report) => console.log("Download DOCX", r.id)}
          />
        ))}

        {filteredReports.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#2D2F39] py-20 text-center">
            <p className="text-[#404F57]">No reports found.</p>
          </div>
        )}
      </div>

      {/* ── Dialog: Create Report ──────────────────────────────────────────── */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2D2F39] bg-[#1E2429] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#FBFBFB]">Generate Pentest Report</h2>
              <button
                onClick={() => setOpenCreate(false)}
                className="rounded-lg p-1.5 text-[#9AA6A8] transition-colors hover:text-[#FBFBFB]"
              >
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
                  placeholder="e.g. Internal_Security_Audit_Q1"
                />
              </div>

              <div>
                <label className={labelCls}>Select Asset Scope</label>
                <select
                  className={inputCls}
                  value={newReport.asset}
                  onChange={(e) => setNewReport({ ...newReport, asset: e.target.value })}
                >
                  {ASSET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0D1014]">
                      {opt}
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
              <button
                onClick={() => setOpenCreate(false)}
                className="rounded-lg px-4 py-2 text-sm text-[#FBFBFB] transition-colors hover:bg-[#2D2F39]"
              >
                Cancel
              </button>
              <button
                disabled={!newReport.name}
                onClick={handleCreateReport}
                className="rounded-lg bg-[#8FFF9C] px-5 py-2 text-sm font-extrabold text-[#0D1014] transition-colors hover:bg-[#AFFFB9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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