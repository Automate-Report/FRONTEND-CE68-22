"use client";

import { useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import { Worker } from "@/src/types/worker";
import { workerService } from "@/src/services/worker.service";
import { accessKeyService } from "@/src/services/accessKey.service";
import { AccessKeyBox } from "./AccessKeyBox";

interface WorkerItemProps {
  worker: Worker;
  onRefresh: () => void;
}

export function AccessKeyBoxSection({ worker, onRefresh }: WorkerItemProps)
{
    const [loading, setLoading] = useState(false);

    const handleGenerateKey = async () => {
        setLoading(true);
        try {
            const data = await accessKeyService.create();


            await workerService.updateKey(worker.id, data.id);

            onRefresh();

        }catch (error) {
            console.error("Failed to generate key", error);
            alert("Error generating key");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="pt-3">
            {worker.access_key_id === null ? (
                <Button
                    variant="contained"
                    onClick={handleGenerateKey}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <VpnKeyIcon />}
                    sx={{
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        backgroundColor: "#8FFF9C",
                        color: "#0B0F12",
                        "&:hover": {
                            color: "#0B0F12",
                            backgroundColor: "#AFFFB9"
                        }
                    }}
                >
                    {loading ? "Generating..." : "Generate Access Key"}
                </Button>
            ) : (
                <AccessKeyBox accessKeyId={worker.access_key_id}/>
            )}
        </div>
    );
}