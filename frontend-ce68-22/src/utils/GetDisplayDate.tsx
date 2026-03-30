export function getDisplayDate(date: Date, option: string="display"): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (option === "input") {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    if (option === "display") {
        return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    }
    if (option === "card") {
        return `${day.toString().padStart(2, '0')} ${monthNames[month - 1]} ${year}`;
    }
    if (option === "time") {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return "";
}