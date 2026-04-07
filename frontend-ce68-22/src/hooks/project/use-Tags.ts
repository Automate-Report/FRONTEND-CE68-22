import { useQuery } from "@tanstack/react-query";
import { tagService } from "@/src/services/tag.service";

export function useTags(
  proejctId: number
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ['tags', proejctId], 
    
    queryFn: () => tagService.getAllProjectId(proejctId),
    
    placeholderData: (previousData) => previousData,
  });
}