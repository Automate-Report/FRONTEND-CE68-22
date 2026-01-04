import { useQuery } from "@tanstack/react-query";
import { assetService } from "../services/asset.service";

export function useAssets(
  asset_id: number,
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none", 
  search?: string, // เพิ่ม
  filter?: string  // เพิ่ม
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ['assets',asset_id, page, size, sortBy, sortOrder, search, filter], 
    
    queryFn: () => assetService.getAll(asset_id, page, size, sortBy, sortOrder, search, filter),
    
    placeholderData: (previousData) => previousData,
  });
}