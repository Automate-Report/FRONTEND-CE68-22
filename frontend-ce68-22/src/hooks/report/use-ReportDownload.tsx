"use client";

import { useState } from "react";
import { penTestReportService } from "@/src/services/penTestReport.service";
import { showToast } from "@/src/components/Common/ToastContainer";
import { Delete, Close } from "@mui/icons-material";

export const useReportDownload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadReport = async (reportId: number, reportType: "pdf" | "docx", fallbackName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. เรียก Service โดยส่ง reportType ไปด้วย 
      // (ตรวจสอบให้แน่ใจว่า service รับ parameter นี้และ axios มี responseType: 'blob')
      const response = await penTestReportService.download(reportId, reportType);

      // 2. จัดการชื่อไฟล์
      let filename = `${fallbackName}.${reportType}`; // default name

      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // 3. กำหนด MIME Type ให้ถูกต้องตามไฟล์
      const mimeTypes = {
        pdf: "application/pdf",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      const blob = new Blob([response.data], { type: mimeTypes[reportType] });
      const url = window.URL.createObjectURL(blob);

      // 4. สร้าง link ล่องหนเพื่อสั่งดาวน์โหลด
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();

      // 5. Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast({
        icon: <Delete sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
        message: `Report "${filename}" downloaded successfully!`,
        borderColor: "#8FFF9C",
        duration: 6000,
      });

    } catch (err: any) {
      showToast({
        icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
        message: "Failed to download report :(",
        borderColor: "#FE3B46",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadReport, isLoading, error };
};