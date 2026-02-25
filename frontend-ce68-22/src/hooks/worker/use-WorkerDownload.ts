import { useState } from "react";
import { workerService } from "@/src/services/worker.service";
import toast from "react-hot-toast";

export const useWorkerDownload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadWorker = async (workerId: number, fallbackName: string) => {
  setIsLoading(true);
  try {
    const response = await workerService.download_worker(workerId);

    // 1. ตรวจสอบว่าได้ข้อมูลมาจริงไหม
    if (!response.data || response.data.size === 0) {
      throw new Error("Empty file received");
    }

    // 2. สร้าง Blob และ URL
    const blob = new Blob([response.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    
    // 3. จัดการเรื่องชื่อไฟล์
    let filename = `worker_${fallbackName}.zip`;
    const disposition = response.headers["content-disposition"];
    if (disposition?.includes("attachment")) {
       const matches = /filename="?([^";\n]*)"?/.exec(disposition);
       if (matches?.[1]) filename = matches[1];
    }

    // 4. วิธีสร้าง Link ที่ Chrome มั่นใจว่าไม่ใช่ Bot/Malware
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none"; // ซ่อนไว้
    document.body.appendChild(link);
    
    link.click(); // สั่งดาวน์โหลด

    // 5. ให้เวลาระบบนิดนึงก่อนลบ (Chrome ต้องการสิ่งนี้ในบางกรณี)
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    toast.success("ดาวน์โหลดสำเร็จ");
  } catch (err) {
    console.error("Chrome Download Blocked/Failed:", err);
    toast.error("ไม่สามารถดาวน์โหลดไฟล์ได้");
  } finally {
    setIsLoading(false);
  }
};

  return { downloadWorker, isLoading, error };
};