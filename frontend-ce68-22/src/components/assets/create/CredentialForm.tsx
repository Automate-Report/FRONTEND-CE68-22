import { Box, Stack, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputAdornment, IconButton } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { AssetFormInputs } from "@/src/hooks/use-createAssetLogic";
import { commonInputStyles } from "@/src/styles/inputAssetStyle";

// Icons
import CreateAssetIcon from "@/src/components/icon/CreateAssertIcon"; // Check path
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface Props {
    formMethods: UseFormReturn<AssetFormInputs>;
    showCredential: boolean;
    setShowCredential: (val: boolean) => void;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
}

export const CredentialForm = ({ formMethods, showCredential, setShowCredential, showPassword, setShowPassword }: Props) => {
    const { register } = formMethods;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", mb: "12px", fontSize: "24px" }}>
                Credentials
            </Typography>

            {!showCredential ? (
                <Button
                    startIcon={<CreateAssetIcon />}
                    onClick={() => setShowCredential(true)}
                    variant="outlined"
                    sx={{
                        color: "#E6F0E6", borderColor: "#E6F0E6", borderRadius: "8px",
                        textTransform: "none", fontFamily: "inherit",
                    }}
                >
                    Add New Credentials
                </Button>
            ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: "#9AA6A8", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Username</TableCell>
                                <TableCell sx={{ color: "#9AA6A8", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Password</TableCell>
                                <TableCell align="right" sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <TextField
                                        placeholder="Username" fullWidth sx={commonInputStyles}
                                        {...register("username", { required: showCredential ? "Username is required" : false })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth sx={commonInputStyles}
                                        {...register("password", { required: showCredential ? "Password is required" : false })}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#9AA6A8" }}>
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => setShowCredential(false)} sx={{ minWidth: "auto", color: "#FE3B46" }}>
                                        <DeleteOutlineIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};