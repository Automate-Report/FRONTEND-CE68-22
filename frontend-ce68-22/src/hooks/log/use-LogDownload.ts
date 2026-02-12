import { useState } from "react";
import { penTestLogService } from "@/src/services/penTestLog.service";

export const useLogDownload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadLog = async (logId: number, fallbackName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. เรียก Service (ตรวจสอบให้แน่ใจว่าใน axios service มี { responseType: 'blob' })
      const response = await penTestLogService.download(logId);

      // 2. ตั้งชื่อไฟล์เริ่มต้น (กรณีหา Header ไม่เจอ)
      let filename = `${fallbackName}.txt`; 
      
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // 3. สร้าง Blob URL (ปรับ type ให้ตรงกับ Backend)
      // ถ้าเป็น CSV ใช้ "text/csv" ถ้าเป็น Text ทั่วไปใช้ "text/plain"
      const blob = new Blob([response.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      
      document.body.appendChild(link);
      link.click();

      // 4. Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Download failed:", err);
      setError("ไม่สามารถดาวน์โหลดไฟล์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadLog, isLoading, error };
}