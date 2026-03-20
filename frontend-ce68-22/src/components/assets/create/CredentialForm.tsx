import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputAdornment, IconButton, Stack } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { AssetFormInputs } from "@/src/hooks/asset/use-createAssetLogic";

// Icons
import CreateAssetIcon from "@/src/components/icon/CreateAssertIcon"; 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
    formMethods: UseFormReturn<AssetFormInputs>;
    showCredential: boolean;
    setShowCredential: (val: boolean) => void;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
}

export const CredentialForm = ({ formMethods, showCredential, setShowCredential, showPassword, setShowPassword }: Props) => {
    const { register, formState: { errors }, setValue, clearErrors } = formMethods;

    const tableInputStyle = {
        '& .MuiOutlinedInput-root': {
            color: "#E6F0E6",
            backgroundColor: "#1A2025",
            borderRadius: "10px",
            '& fieldset': { borderColor: "#2D2F39" },
            '&:hover fieldset': { borderColor: "#404F57" },
            '&.Mui-focused fieldset': { borderColor: "#8FFF9C" },
            '&.Mui-error fieldset': { borderColor: "#FE3B46" }, // แสดงขอบแดงเมื่อมี Error
            fontFamily: "inherit",
            fontSize: "14px",
        },
    };

    const handleRemoveCredential = () => {
        setShowCredential(false);
        setValue("username", "");
        setValue("password", "");
        clearErrors(["username", "password"]); // สำคัญ: ล้าง Error เพื่อให้กดส่งฟอร์มได้
    };

    return (
        <Box sx={{ mt: "32px", mb: "16px" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", fontSize: "20px" }}>
                    Asset Credentials
                </Typography>
                {showCredential && (
                    <Button 
                        onClick={handleRemoveCredential} 
                        startIcon={<DeleteOutlineIcon />}
                        sx={{ color: "#FE3B46", textTransform: "none", fontWeight: "bold" }}
                    >
                        Remove
                    </Button>
                )}
            </Stack>

            {!showCredential ? (
                <Button
                    startIcon={<CreateAssetIcon />}
                    onClick={() => setShowCredential(true)}
                    variant="outlined"
                    sx={{
                        color: "#8FFF9C", borderColor: "rgba(143, 255, 156, 0.3)", borderRadius: "12px",
                        textTransform: "none", p: "12px 28px",
                        '&:hover': { borderColor: "#8FFF9C", bgcolor: "rgba(143, 255, 156, 0.05)" }
                    }}
                >
                    Add Asset Credentials
                </Button>
            ) : (
                <Box>
                    <TableContainer component={Paper} sx={{ backgroundColor: "#0B0F12", border: "1px solid #2D2F39", borderRadius: "16px", overflow: "hidden" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#1A2025" }}>
                                    <TableCell sx={{ color: "#9AA6A8", borderBottom: "1px solid #2D2F39", fontSize: "13px", fontWeight: "bold" }}>USERNAME</TableCell>
                                    <TableCell sx={{ color: "#9AA6A8", borderBottom: "1px solid #2D2F39", fontSize: "13px", fontWeight: "bold" }}>PASSWORD</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ '& td': { border: 0 } }}>
                                    <TableCell sx={{ py: 3 }}>
                                        <TextField
                                            placeholder="e.g. root" fullWidth sx={tableInputStyle}
                                            error={!!errors.username}
                                            {...register("username", { required: showCredential })}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 3 }}>
                                        <TextField
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            fullWidth sx={tableInputStyle}
                                            error={!!errors.password}
                                            {...register("password", { required: showCredential })}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#667a85" }}>
                                                            {showPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ข้อความ Error รวมด้านล่างตาราง */}
                    {(errors.username || errors.password) && (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5, ml: 1 }}>
                            <ErrorOutlineIcon sx={{ color: "#FE3B46", fontSize: 16 }} />
                            <Typography sx={{ color: "#FE3B46", fontSize: "12px", fontWeight: "500" }}>
                                Please fill in both fields to add credentials.
                            </Typography>
                        </Stack>
                    )}
                </Box>
            )}
        </Box>
    );
};