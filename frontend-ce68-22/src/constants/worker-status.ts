export const WORKER_STATUS_MAP: Record<string, { label: string, style: string}> = {
    online: {
        label: "Online",
        style: "text-[#6EDD99] bg-[#DEFFE2]"
    },
    offline: {
        label: "Offline",
        style: "text-[#DD6E6E] bg-[#FFDEDE]"
    },
    Revoked: { 
    label: "Revoked Key", 
    style: "text-[#6B7280] bg-[#F3F4F6]" 
  },
  unknown: { 
    label: "Unknown", 
    style: "text-[#D97706] bg-[#FEF3C7]" 
  }
}