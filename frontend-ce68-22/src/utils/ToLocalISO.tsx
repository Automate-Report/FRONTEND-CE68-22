export const toLocalISO = (dateStr: string, timeStr?: string): string => {
    const date = timeStr 
        ? new Date(`${dateStr}T${timeStr}:00`)
        : new Date(dateStr);
    
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, "0");
    const tz = `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
    
    return date.toISOString().replace("Z", tz);
};