import { useState } from "react";
import { penTestLogService } from "@/src/services/penTestLog.service";
import { Close, Download } from "@mui/icons-material";
import { showToast } from "@/src/components/Common/ToastContainer";

export const useLogDownload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadLog = async (logId: number, projectId: number, fallbackName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. เรียก Service (ตรวจสอบให้แน่ใจว่าใน axios service มี { responseType: 'blob' })
      const response = await penTestLogService.download(logId, projectId);

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
      showToast({
        icon: <Download sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
        message: `Log "${filename}" Downloaded successfully!`,
        borderColor: "#8FFF9C",
        duration: 6000,
      });

    } catch (err: any) {
      showToast({
        icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
        message: "Failed to download log :(",
        borderColor: "#FE3B46",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadLog, isLoading, error };
}