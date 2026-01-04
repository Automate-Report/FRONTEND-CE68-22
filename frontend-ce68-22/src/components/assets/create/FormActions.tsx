import { Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import SaveIcon from '@mui/icons-material/Save';

interface Props {
    submitLabel?: string; // เพิ่ม prop เพื่อเปลี่ยนข้อความปุ่ม
}

export const FormActions = ({ submitLabel = "Create Asset" }: Props) => {
    const router = useRouter();

    return (
        <Stack direction="row" spacing={"32px"} justifyContent="flex-start" alignItems={"center"} marginTop={"16px"}>
            <Button
                variant="outlined"
                onClick={() => router.back()}
                sx={{
                    height: "40px", padding: "16px 24px", color: "#FE3B46", borderColor: "#FE3B46",
                    borderRadius: "8px", fontSize: "16px", textTransform: "none", fontFamily: "inherit",
                    "&:hover": { backgroundColor: "#FE3B46", color: "#FBFBFB" }
                }}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                variant="contained"
                startIcon={submitLabel !== "Create Asset"} // เปลี่ยน Icon ได้ถ้าต้องการ
                sx={{
                    height: "40px", padding: "16px 24px", fontWeight: 'medium', fontSize: "16px",
                    textTransform: "none", fontFamily: "inherit", color: "#0B0F12", backgroundColor: "#8FFF9C",
                    borderRadius: "8px", "&:hover": { backgroundColor: "#AFFFB9" }
                }}
            >
                {submitLabel}
            </Button>
        </Stack>
    );
};