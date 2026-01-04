import { useQuery } from "@tanstack/react-query";
import { credentialService } from "../services/credential.service";

export function useCredential(id: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["credential", id],
    queryFn: () => credentialService.getById(id),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!id, 
  });
}

export function useCredentialByAsset(assetId: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["credential", assetId],
    queryFn: () => credentialService.getByAssetId(assetId),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!assetId, 
  });
}