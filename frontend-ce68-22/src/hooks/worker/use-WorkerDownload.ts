import { useState } from "react";
import { workerService } from "@/src/services/worker.service";

export const useWorkerDownload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadWorker = async (workerId: number, fallbackName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. เรียก Service
      const response = await workerService.download_worker(workerId);

      // 2. แกะชื่อไฟล์จาก Header (Content-Disposition)
      // Backend ส่งมา: attachment; filename=worker_Bond.exe
      let filename = `worker_${fallbackName}.exe`; // ชื่อสำรอง
      const disposition = response.headers["content-disposition"];

      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // 3. สร้าง Blob URL และสั่ง Download (Browser Logic)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // 4. Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Download failed:", err);
      setError("ไม่สามารถดาวน์โหลดไฟล์ได้ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadWorker, isLoading, error };
};