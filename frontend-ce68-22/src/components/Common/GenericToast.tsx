// Before Using the Toast notification will look like this:
// I--------------------------------------I
// I [      ]                             I
// I [ icon ]    Noti message      [ X ]  I
// I [      ]                             I
// I--------------------------------------I
interface GenericToastProps {
    icon: React.ReactNode;
    message: string;
    onClose: () => void;
    borderColor?: string;
    textColor?: string;
}
export default function GenericToast({
    icon,
    message,
    onClose,
    borderColor = "rgba(0,0,0,0.3)",
    textColor = "#E6F0E6",
}: GenericToastProps) {
    return (
        <div 
            className="flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-xl bg-[#1E2A2F] animate-toast-in"
            style={{ borderTop: `2px solid ${borderColor}`, color: textColor }}
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center">
                    {icon}
                </div>
                <span className="text-sm font-medium">{message}</span>
            </div>
            <button 
                onClick={onClose} 
                className="text-base opacity-50 hover:opacity-100 transition-opacity ml-4"
                style={{ color: textColor }}
            >
                &times;
            </button>
        </div>
    );
}