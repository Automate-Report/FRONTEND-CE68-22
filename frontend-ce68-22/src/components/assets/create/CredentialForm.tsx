import { Box, Stack, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputAdornment, IconButton } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { AssetFormInputs } from "@/src/hooks/asset/use-createAssetLogic";
import { commonInputStyles } from "@/src/styles/inputAssetStyle";

// Icons
import CreateAssetIcon from "@/src/components/icon/CreateAssertIcon"; 
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
        <Box sx={{ mt: "24px", mb: "16px" }}>
            <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", mb: "16px", fontSize: "24px" }}>
                Credentials
            </Typography>

            {!showCredential ? (
                <Button
                    startIcon={<CreateAssetIcon />}
                    onClick={() => setShowCredential(true)}
                    variant="outlined"
                    sx={{
                        color: "#E6F0E6", borderColor: "#E6F0E6", borderRadius: "8px",
                        textTransform: "none", fontFamily: "inherit", p: "10px 24px"
                    }}
                >
                    Add New Credentials
                </Button>
            ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid #E6F0E6", borderRadius: "16px" }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{height: "40px"}}>
                                <TableCell align="center" sx={{ color: "#E6F0E6", backgroundColor: "#0F1518", fontSize: "16px" }}>Username</TableCell>
                                <TableCell align="center" sx={{ color: "#E6F0E6", backgroundColor: "#0F1518", fontSize: "16px" }}>Password</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow 
                                sx={{ 
                                    backgroundColor: "#FBFBFB",
                                    color: "#404F57",
                                    '&:last-child td, &:last-child th': { 
                                        border: 0 
                                    } 
                                }}
                            >
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
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#404F57" }}>
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