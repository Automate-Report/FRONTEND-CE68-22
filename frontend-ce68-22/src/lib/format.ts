// src/utils/format.ts

export const castInt = (value: string | string[] | undefined): number => {
  // ถ้าเป็น null/undefined ให้ return 0
  if (!value) return 0;
  
  // ถ้าเป็น Array (กรณี [...id]) ให้เอาตัวแรกมาใช้
  const strValue = Array.isArray(value) ? value[0] : value;
  
  // แปลงเป็นตัวเลข
  const num = Number(strValue);
  
  // ถ้าไม่ใช่ตัวเลข (NaN) ให้ return 0
  return isNaN(num) ? 0 : num;
};