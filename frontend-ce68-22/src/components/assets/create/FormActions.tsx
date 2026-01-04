import { Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export const FormActions = () => {
    const router = useRouter();

    return (
        <Stack direction="row" spacing={"32px"} justifyContent="flex-start" alignItems={"center"} paddingTop={"16px"}>
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
                sx={{
                    height: "40px", padding: "16px 24px", fontWeight: 'medium', fontSize: "16px",
                    textTransform: "none", fontFamily: "inherit", color: "#0B0F12", backgroundColor: "#8FFF9C",
                    borderRadius: "8px", "&:hover": { backgroundColor: "#AFFFB9" }
                }}
            >
                Create Asset
            </Button>
        </Stack>
    );
};