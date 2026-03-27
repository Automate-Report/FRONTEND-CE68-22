import { create } from 'zustand';
import { workerService } from '@/src/services/worker.service';
import toast from 'react-hot-toast';

interface DownloadState {
  isDownloading: boolean;
  progress: number;
  currentWorkerId: number | null;
  currentWorkerName: string | null;
  startDownload: (workerId: number, projectId: number, workerName: string, onComplete?: () => Promise<void>) => Promise<void>;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  isDownloading: false,
  progress: 0,
  currentWorkerId: null,
  currentWorkerName: null,

  startDownload: async (workerId, projectId, workerName, onComplete) => {
    set({ isDownloading: true, progress: 0, currentWorkerId: workerId, currentWorkerName: workerName });
    const toastId = toast.loading(`Preparing ${workerName}...`);

    try {
      const response = await workerService.download_worker(workerId, projectId, (p) => {
        set({ progress: p });
        toast.loading(`Downloading ${workerName}: ${p}%`, { id: toastId });
      });

      // จัดการดาวน์โหลดไฟล์...
      const data = response.data || response;
      const blob = new Blob([data as BlobPart], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${workerName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // ✅ แจ้ง Backend ให้ Connect
      await workerService.markAsDownloaded(workerId);
      
      // ✅ ทำ Callback (เช่น refetch ข้อมูลในหน้า Page)
      if (onComplete) await onComplete();

      toast.success(`${workerName} Config Downloaded`, { id: toastId });
    } catch (err) {
      toast.error("Process failed", { id: toastId });
    } finally {
      // หน่วงเวลาให้เห็น 100% สักพัก
      setTimeout(() => set({ isDownloading: false, progress: 0, currentWorkerId: null, currentWorkerName: null }), 2000);
    }
  },
}));