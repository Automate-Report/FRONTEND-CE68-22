"use client";

import { TextField, TextFieldProps } from "@mui/material";

export default function CustomTextField(props: TextFieldProps) {
  // ดึง multiline กับ sx ออกมาเช็คก่อน (แต่ยังส่ง ...props เข้าไปทั้งหมดเหมือนเดิม)
  const { multiline, sx } = props;

  return (
    <TextField
      variant="outlined"
      fullWidth
      size="small"
      required
      {...props} // รับ props ทั้งหมดมา (เช่น value, onChange, rows, multiline)
      
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#FBFBFB",
          borderRadius: "16px",
          color: "#404F57",

          textTransform: "none",
          fontFamily: "var(--font-ibm-thai), sans-serif",
          
          // 1. เพิ่ม Logic: ถ้าเป็น Multiline ให้ใส่ Padding 12px
          // (ถ้า input ธรรมดา MUI จัดการ padding ให้เองสวยแล้ว หรือปล่อย undefined)
          padding: multiline ? "12px" : undefined,

          "& fieldset": {
            borderColor: "#FBFBFB",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#FBFBFB",
          },
          
          // 2. เพิ่ม Logic: เลือกทั้ง 'input' (บรรทัดเดียว) และ 'textarea' (หลายบรรทัด)
          "& input, & textarea": {
            fontSize: "16px",
            fontWeight: 400,
            fontFamily: "var(--font-ibm-thai), sans-serif",
            "&::placeholder": {
              color: "#9AA6A8", 
              opacity: 1,       // สำคัญ: ทำให้สีชัดเท่ากันทุก Browser
            },
          },
        },
        
        // 3. เอา sx ที่คนเรียกอาจจะส่งมาเพิ่ม (Override) มาต่อท้าย
        ...(sx || {}),
      }}
    />
  );
}