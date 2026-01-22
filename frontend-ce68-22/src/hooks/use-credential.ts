import { useQuery } from "@tanstack/react-query";
import { assetCredentialService } from "../services/assetCredential.service";
import { Credential } from "../types/asset";

export function useCredential(id: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["credential", id],
    queryFn: () => assetCredentialService.getById(id),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!id, 
  });
}

export function useCredentialByAsset(assetId: number) {
  return useQuery<Credential | null>({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["credential", assetId],
    queryFn: () => assetCredentialService.getByAssetId(assetId),

    enabled: !!assetId && !isNaN(assetId),
  });
}