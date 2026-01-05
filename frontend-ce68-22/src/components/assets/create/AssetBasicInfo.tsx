import { Box, Typography, TextField, Stack, Button } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { AssetFormInputs } from "@/src/hooks/use-createAssetLogic";
import { commonInputStyles } from "@/src/styles/inputAssetStyle";

interface Props {
    formMethods: UseFormReturn<AssetFormInputs>;
    currentAssetType: "IP" | "URL";
}

export const AssetBasicInfo = ({ formMethods, currentAssetType }: Props) => {
    const { register, setValue, formState: { errors } } = formMethods;

    return (
        <>
            {/* Asset Name */}
            <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", mb: "12px", fontSize: "24px" }}>
                Asset Name
            </Typography>
            <TextField
                placeholder="e.g. Testsite URL"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name", { required: "Asset Name is required" })}
                sx={commonInputStyles}
            />

            {/* Asset Target & Type */}
            <Box sx={{ mt: "24px" }}>
                <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", mb: "12px", fontSize: "24px" }}>
                    Asset
                </Typography>
                
                <TextField
                    placeholder={currentAssetType === "IP" ? "e.g. 192.168.0.1" : "e.g. https://example.com"}
                    fullWidth
                    variant="outlined"
                    error={!!errors.target}
                    helperText={errors.target?.message}
                    {...register("target", { required: "Asset Target is required" })}
                    sx={{ ...commonInputStyles, mb: 2 }}
                />

                <Stack direction="row" gap={"12px"} alignItems="center" sx={{ mb: "12px" }}>
                    <Typography sx={{ color: "#9AA6A8", fontWeight: "medium", fontSize: "16px" }}>
                        Asset type:
                    </Typography>
                    {["IP", "URL"].map((type) => (
                        <Button
                            key={type}
                            variant="contained"
                            onClick={() => setValue("type", type as "IP" | "URL")}
                            sx={{
                                height: "40px",
                                padding: "16px 24px",
                                borderRadius: "8px",

                                fontSize: "16px",
                                fontWeight: "bold",
                                textTransform: "none",
                                fontFamily: "inherit",
                                lineHeight: "normal",

                                color: "#0B0F12",
                                backgroundColor: currentAssetType === type ? "#8FFF9C" : "#FBFBFB",
                                "&:hover": {
                                    backgroundColor: currentAssetType === type ? "#7BE588" : "#E0E0E0",
                                }
                            }}
                        >
                            {type}
                        </Button>
                    ))}
                </Stack>
            </Box>
        </>
    );
};