import { create } from 'zustand';
import { workerService } from '@/src/services/worker.service';
import toast from 'react-hot-toast';

interface DownloadState {
  isDownloading: boolean;
  progress: number;
  currentWorkerId: number | null;
  currentWorkerName: string | null;
  startDownload: (
    workerId: number, 
    projectId: number, 
    workerName: string, 
    onComplete?: () => Promise<void>
  ) => Promise<void>;
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

      // สร้าง Blob จากข้อมูลที่ Stream มา
      const blob = new Blob([response.data], { type: "application/zip" });
      if (blob.size === 0) {
        throw new Error("Received empty file from server");
      }


      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Pest10_${workerName}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // แจ้งสถานะกับ Backend และทำ Callback
      await workerService.markAsDownloaded(workerId);
      if (onComplete) await onComplete();

      toast.success(`${workerName} Ready to Use!`, { id: toastId });
    } catch (err) {
      
      toast.error("Failed to download worker config", { id: toastId });
    } finally {
      // หน่วงเวลาเล็กน้อยเพื่อให้ User เห็น Progress 100%
      setTimeout(() => {
        set({ isDownloading: false, progress: 0, currentWorkerId: null, currentWorkerName: null });
      }, 1500);
    }
  },
}));