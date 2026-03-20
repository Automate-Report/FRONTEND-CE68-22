import { useRouter } from "next/navigation";
import { GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";

interface FormActionsProps {
  isSubmitting?: boolean;
}

export const FormActions = ({ isSubmitting = false }: FormActionsProps) => {
  const router = useRouter();

  return (
    <div className="mt-8 flex gap-6 justify-start items-center">
      {/* ปุ่ม Cancel: ใช้สไตล์ตัวอักษรเรียบๆ หรือปุ่มแดงที่คุณมี */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => router.back()}
        className={`${RED_BUTTON_STYLE}`}
      >
        CANCEL
      </button>

      {/* ปุ่ม Create: ใช้สไตล์สีเขียวเดิมของคุณ */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${GREEN_BUTTON_STYLE} min-w-[160px] flex justify-center items-center gap-2 ${
          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            {/* Custom Spinner แบบ Tailwind (ไม่ต้องพึ่ง MUI) */}
            <div className="w-5 h-5 border-2 border-[#0D1014] border-t-transparent rounded-full animate-spin"></div>
            <span>CREATING...</span>
          </>
        ) : (
          "Create Asset"
        )}
      </button>
    </div>
  );
};