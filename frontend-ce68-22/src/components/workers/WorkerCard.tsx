"use client";

import { CircularProgress } from "@mui/material";
import {
  Engineering as WorkerIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Dns as HostIcon,
  Wifi as IpIcon,
  Favorite as HeartbeatIcon,
  LinkOff as UnlinkIcon,
} from "@mui/icons-material";
import { useDownloadStore } from "@/src/hooks/worker/use-WorkerDownloadStore";
import { WORKER_STATUS_MAP } from "@/src/constants/worker-status";
import { Worker as WorkerType } from "@/src/types/worker";
import { useRouter, useParams } from "next/navigation";

interface WorkerCardProps {
  index: number;
  worker: WorkerType;
  canManage: boolean;
  isProjectOwner: boolean;
  currentUserId?: string | number | null;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent, worker: WorkerType) => void;
  onUnlink: (e: React.MouseEvent, worker: WorkerType) => void;
  onDownload?: (e: React.MouseEvent) => void;
}

export function WorkerCard({
  index,
  worker,
  canManage,
  isProjectOwner,
  currentUserId,
  onEdit,
  onDelete,
  onUnlink,
  onDownload,
}: WorkerCardProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  const startDownload = useDownloadStore((state) => state.startDownload);
  const globalIsLoading = useDownloadStore((state) => state.isDownloading);
  const globalProgress = useDownloadStore((state) => state.progress);
  const currentDownloadingId = useDownloadStore((state) => state.currentWorkerId);

  const isThisWorkerDownloading = globalIsLoading && currentDownloadingId === worker.id;
  const statusConfig = WORKER_STATUS_MAP[worker.status] || WORKER_STATUS_MAP.unknown;
  const currentLoad = worker.current_load ?? 0;
  const maxThread = worker.thread_number ?? 1;
  const loadPercentage = (currentLoad / maxThread) * 100;
  const loadPct = Math.round(loadPercentage);
  const loadColor = loadPct > 85 ? "#FE3B46" : loadPct > 60 ? "#FFCC00" : "#8FFF9C";

  const canUnlink = isProjectOwner || (worker.owner !== null && worker.owner === currentUserId);

  // --- Handlers ---
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    onDownload ? onDownload(e) : startDownload(worker.id, worker.project_id, worker.name);
  };
  const handleUnlinkClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onUnlink(e, worker); };
  const handleDeleteClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onDelete(e, worker); };
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    router.push(`/projects/${projectId}/workers/${worker.id}/edit`);
  };

  return (
    <div className="group relative bg-[#0F1518] border border-[#1E2A30] rounded-2xl cursor-pointer transition-all 
    duration-300 hover:border-[#8FFF9C] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden
    animate-card-in opacity-0" style={{ animationDelay: `${index * 80}ms` }}>

      {/* ── Row 1: Avatar + Name + Status + Actions ── */}
      <div className="p-5 flex items-center gap-4 bg-[#1A2025]">

        {/* Avatar */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-[rgba(143,255,156,0.08)] border border-[rgba(143,255,156,0.12)] flex items-center justify-center text-[#8FFF9C]">
          <WorkerIcon sx={{ fontSize: 28 }} />
        </div>

        {/* Name + status badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 pb-1 h-8">
            <h3 className="font-bold text-[#FBFBFB] text-xl leading-tight truncate">{worker.name}</h3>
            <div className={`inline-block whitespace-nowrap text-[11px] font-semibold px-2.5 py-0.5 mt-0.5 rounded-lg ${statusConfig.style}`}>
              {statusConfig.label}
            </div>
          </div>

          {/* Owner row */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-[#9AA6A8]">Owner: {worker.owner ?? "Available for use"}</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${worker.owner === null ? "text-[#6EDD99] bg-[#6EDD99]/10" : "text-[#DD6E6E] bg-[#DD6E6E]/10"}`}>
              {worker.owner === null ? "Available" : "In Use"}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 shrink-0">

          {/* Unlink or Download */}
          {worker.owner ? (
            canUnlink && (
              <button
                onClick={handleUnlinkClick}
                title="Disconnect Node"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#FF9800] bg-[rgba(255,152,0,0.05)] hover:bg-[rgba(255,152,0,0.15)] transition-colors"
              >
                <UnlinkIcon sx={{ fontSize: 18 }} />
              </button>
            )
          ) : (
            canManage && (
              <button
                onClick={handleDownloadClick}
                title="Download Config"
                disabled={globalIsLoading && !isThisWorkerDownloading}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8FFF9C] hover:bg-[rgba(143,255,156,0.08)] transition-colors disabled:opacity-40"
              >
                {isThisWorkerDownloading ? (
                  <div className="flex items-center gap-1">
                    {globalProgress > 0 ? (
                      <>
                        <span className="text-[10px] font-bold text-[#8FFF9C]">{globalProgress}%</span>
                        <CircularProgress variant="determinate" value={globalProgress} size={14} sx={{ color: "#8FFF9C" }} />
                      </>
                    ) : (
                      <CircularProgress size={14} sx={{ color: "#8FFF9C" }} />
                    )}
                  </div>
                ) : (
                  <DownloadIcon sx={{ fontSize: 18 }} />
                )}
              </button>
            )
          )}

          {/* Edit */}
          {canManage && (
            <button
              onClick={handleEditClick}
              title="Edit"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B8A90] hover:bg-[#162022] hover:text-[#E6F0E6] transition-colors"
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </button>
          )}

          {/* Delete */}
          {isProjectOwner && (
            <button
              onClick={handleDeleteClick}
              title="Delete"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A3035] hover:bg-[#2B1218] hover:text-[#FE3B46] transition-colors"
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-[#1A2428]" />

      {/* ── Hostname + Load ── */}
      <div className="space-y-3 px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-[#4A6068]">
          <HostIcon sx={{ fontSize: 15 }} />
          <span className={worker.hostname ? "text-[#8A9EA0]" : "text-[#3A5058] italic"}>
            {worker.hostname ?? "No Hostname"}
          </span>
        </div>

        {/* Load bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[#FBFBFB]">
              Load: {currentLoad}/{maxThread}
            </span>
            <span className="text-xs font-bold" style={{ color: loadColor }}>{loadPct}%</span>
          </div>
          <div className="h-1.5 bg-[#1A2428] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${loadPct}%`, backgroundColor: loadColor, boxShadow: `0 0 8px ${loadColor}55` }}
            />
          </div>
        </div>
      </div>

      {/* ── IP + Heartbeat ── */}
      <div className="p-5 border-t border-[#1A2428] flex items-center gap-3 text-xs text-[#4A6068]">
        <div className="flex items-center gap-1.5">
          <IpIcon sx={{ fontSize: 14, color: "#404F57" }} />
          <span className="font-mono text-[#9AA6A8]">{worker.internal_ip || "0.0.0.0"}</span>
        </div>
        <span className="w-px h-3 bg-[#404F57] opacity-50" />
        <div className="flex items-center gap-1.5 overflow-hidden">
          <HeartbeatIcon sx={{ fontSize: 13, color: worker.status === "online" ? "#8FFF9C" : "#FE3B46" }} />
          <span className="font-mono text-[#9AA6A8] truncate">HB: {worker.last_heartbeat || "No signal"}</span>
        </div>
      </div>
    </div>
  );
}