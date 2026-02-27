// src/utils/format.ts
import cronstrue from 'cronstrue';

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

export const formatCronExpressions = (cronExpression: string) => {

  // after map => [ "At {time1}, suffix", "At {time2}, suffix", ... ]
  const expressions = cronExpression.split("Z")
    .map(c => c.trim())
    .filter(c => c !== "")
    .map(c => cronstrue.toString(c, { verbose: true }));

  if (expressions.length === 0) return "";
  if (expressions.length === 1) return expressions[0];

  // Extract everything between "At" and "," for each expression (TY GPT FOR THIS REGEX)
  const times = expressions.map(exp =>
    exp.match(/^At (.*?),/)?.[1]
  );
  const suffix = expressions[0].split(",").slice(1).join(",");

  return `At ${times.join(", ")}, ${suffix}`;
}