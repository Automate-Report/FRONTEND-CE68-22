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
      // *** สำคัญมาก: ใน axios/service ต้องระบุ responseType: 'blob' ด้วยนะครับ ***
      const response = await workerService.download_worker(workerId);

      // 2. แกะชื่อไฟล์จาก Header (Content-Disposition)
      // Backend ส่งมา: attachment; filename="SecurityWorker_ProjectA.zip"
      
      // เปลี่ยน Default เป็น .zip
      let filename = `worker_${fallbackName}.zip`; 
      
      // ดึง Header (Axios มักจะส่ง headers เป็น lowercase ทั้งหมด)
      const disposition = response.headers["content-disposition"];

      if (disposition && disposition.indexOf("attachment") !== -1) {
        // Regex นี้ครอบคลุมทั้งแบบมี quotes และไม่มี quotes
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          // ลบ quotes ออก (เช่น "file.zip" -> file.zip)
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // 3. สร้าง Blob URL และระบุ Type เป็น Zip
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      
      // ต้อง append เข้า body ก่อน click (สำหรับบาง Browser เช่น Firefox)
      document.body.appendChild(link);
      link.click();

      // 4. Cleanup
      link.parentNode?.removeChild(link);
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