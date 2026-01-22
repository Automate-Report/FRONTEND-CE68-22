import { useState, useEffect} from 'react';

export function useDebounce<T>( value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // ตั้งเวลา update ค่า
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // clear timeout ถ้า value เปลี่ยนก่อนครบกำหนด (User ยังพิมพ์ไม่เสร็จ)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}