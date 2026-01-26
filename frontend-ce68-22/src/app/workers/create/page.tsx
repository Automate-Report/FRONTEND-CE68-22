"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // อย่าลืมติดตั้ง @mui/icons-material

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import CustomTextField from "@/src/components/Common/CustomTextField";
import { workerService } from "@/src/services/worker.service";

// --- Styles ---
import { muiRedButtonStyle } from "@/src/styles/redButton";
import { muiGreenButtonStyle } from "@/src/styles/greenButton";

export default function CreateWorkerPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [threads, setThreads] = useState<number | string>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !threads) return;

        setLoading(true);
        setError(null);
        try {
            
            await workerService.create({
                name: name.trim(),
                thread_number: Number(threads)
            });
            router.push("/workers"); 
        } catch (err: any) {
            setError(err.message || "Failed to create worker");
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbItems = [
        { label: "Workers", href: "/workers" },
        { label: "Create Worker", href: undefined }
    ];

    return (
        <div className="mx-12 py-8">
            <GenericBreadcrums items={breadcrumbItems} />
            
            <form onSubmit={handleSubmit} className="mt-8">
                {/* Worker Name */}
                <div className="pb-8">
                    <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Worker Name</div>
                    <CustomTextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Scanner-Node-01" 
                        size="small"
                        fullWidth
                    />
                </div>

                {/* Number of Threads พร้อม Tooltip */}
                <div className="pb-8">
                    <div className="flex items-center gap-2 pb-4">
                        <div className="text-[#E6F0E6] font-bold text-[24px]">Number of Threads</div>
                        <Tooltip 
                            title="Set the number of concurrent tasks this worker can process from the scheduled jobs."
                            placement="right"
                            arrow
                            sx={{
                                ".MuiTooltip-tooltip": {
                                    backgroundColor: "#1A2023",
                                    color: "#E6F0E6",
                                    fontSize: "14px",
                                    border: "1px solid #2A3033"
                                }
                            }}
                        >
                            <IconButton size="small" sx={{ color: "#8FFF9C", p: 0 }}>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                    
                    <CustomTextField
                        type="number"
                        value={threads}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) >= 1) setThreads(val);
                        }}
                        placeholder="1" 
                        size="small"
                        fullWidth
                    />
                </div>

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                    <Button variant="outlined" disabled={loading} onClick={() => router.back()} sx={muiRedButtonStyle}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit" disabled={loading || !name.trim()} sx={muiGreenButtonStyle}>
                        {loading ? "Creating..." : "Create Worker"}
                    </Button>
                </Box>
            </form>
        </div>
    );
}