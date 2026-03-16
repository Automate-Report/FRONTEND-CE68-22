export const WORKER_STATUS_MAP: Record<string, { label: string, style: string}> = {
  ONLINE: {
      label: "Online",
      style: "text-[#6EDD99] bg-[#DEFFE2]"
  },
  OFFLINE: {
      label: "Offline",
      style: "text-[#DD6E6E] bg-[#FFDEDE]"
  },
  NOT_ACTIVATE: { 
    label: "Not Activated", 
    style: "text-[#6B7280] bg-[#F3F4F6]" 
  },
  UNKNOWN: { 
    label: "Unknown", 
    style: "text-[#D97706] bg-[#FEF3C7]" 
  }
}