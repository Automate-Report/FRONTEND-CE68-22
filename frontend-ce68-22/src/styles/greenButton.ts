export const GREEN_BUTTON_STYLE = "flex items-center justify-center bg-[#8FFF9C] text-[#0B0F12] text-[16px] font-semibold rounded-lg px-6 py-2 gap-3 cursor-pointer hover:bg-[#AFFFB9]";
// style constants
export const muiGreenButtonStyle = {
  px: 3,
  py:1,
  borderRadius: "10px",
  backgroundColor: "#8FFF9C",
  color: "#0B0F12",
  fontWeight: 600,
  textTransform: "none",

  fontFamily: "var(--font-ibm-thai), sans-serif",

  "&:hover": {
    backgroundColor: "#AFFFB9", // MUI รองรับ nesting syntax
  },
  // แก้ปัญหาสีเทาของ MUI เวลา disabled (ถ้าต้องการ)
  "&.Mui-disabled": {
    backgroundColor: "rgba(143, 255, 156, 0.5)",
    color: "rgba(11, 15, 18, 0.5)"
  }
};