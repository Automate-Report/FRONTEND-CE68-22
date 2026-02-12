export const muiRedButtonStyle = {
  px: 3,
  borderRadius: "10px",
  
  // 1. แก้ไข Border: ต้องกำหนดขนาดและสี (เพราะเป็นปุ่มแบบ Outlined)
  border: "1px solid #FE3B46", 
  
  backgroundColor: "#0B0F12", // หรือ "transparent" ถ้าอยากให้โปร่งใส
  color: "#FE3B46",
  fontWeight: 600,
  textTransform: "none",

  // 2. แก้ไข Font: ระบุชื่อตัวแปร แล้วตามด้วย fallback เป็น sans-serif ธรรมดาพอครับ
  // (Javascript ไม่สามารถ spread object เข้าไปใน string ได้)
  fontFamily: "var(--font-ibm-thai), sans-serif",

  "&:hover": {
    backgroundColor: "#FE3B46", 
    color: "#FBFBFB",
    border: "1px solid #FE3B46" // ใส่ไว้เพื่อให้ border ไม่หายหรือเพี้ยนตอน hover
  },

  // 3. แก้ไขสี Disabled: เปลี่ยนจากสีเขียวเป็น "สีแดงจางๆ"
  "&.Mui-disabled": {
    border: "1px solid rgba(254, 59, 70, 0.3)", // สีแดงจางๆ
    color: "rgba(254, 59, 70, 0.3)",
    backgroundColor: "transparent" // หรือสีพื้นหลังที่ต้องการ
  }
};