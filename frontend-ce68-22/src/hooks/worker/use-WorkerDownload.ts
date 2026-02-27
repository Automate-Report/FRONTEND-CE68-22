import { useState } from "react";
import { workerService } from "@/src/services/worker.service";
import toast from "react-hot-toast";

// useWorkerDownload.ts
// src/hooks/worker/use-WorkerDownload.ts
export const useWorkerDownload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // ✅ สร้าง State ไว้เก็บ Progress

  const downloadWorker = async (workerId: number, fallbackName: string) => {
    setIsLoading(true);
    setProgress(0);
    try {
      // ✅ ส่งพารามิเตอร์ 2 ตัวเข้า Service (id และ callback)
      const response = await workerService.download_worker(workerId, (p) => {
        setProgress(p); // อัปเดต % เข้า State ของ Hook
      });

      const data = response.data || response;
      const blob = new Blob([data as BlobPart], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `worker_${fallbackName}.zip`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      // ✅ แจ้ง Backend ว่าดาวน์โหลดเสร็จ (Connect)
      await workerService.markAsDownloaded(workerId);
      
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
      // ไม่ต้องรีบ setProgress เป็น 0 เพื่อให้ User เห็น 100% แป๊บนึง
    }
  };

  // ✅ ส่ง progress ออกไปให้ Page ใช้
  return { downloadWorker, isLoading, progress }; 
};