"use client";

import { Box, Typography, Modal, Button, CircularProgress, Stack, IconButton } from "@mui/material";
import { LinkOff as UnlinkIcon, Close as CloseIcon, WarningAmber as WarningIcon } from "@mui/icons-material";

interface WorkerUnlinkModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    workerName: string;
    loading: boolean;
}

export function WorkerUnlinkModal({ open, onClose, onConfirm, workerName, loading }: WorkerUnlinkModalProps) {
    return (
        <Modal open={open} onClose={!loading ? onClose : undefined}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 450 }, bgcolor: '#1A2023', borderRadius: '20px', border: '1px solid #404F57', boxShadow: 24, outline: 'none' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}><IconButton onClick={onClose} disabled={loading} sx={{ color: '#9AA6A8' }}><CloseIcon /></IconButton></Box>
                <Box sx={{ px: 4, pb: 4, textAlign: 'center' }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(255, 152, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: '1px solid rgba(255, 152, 0, 0.2)' }}><UnlinkIcon sx={{ fontSize: 32, color: '#FF9800' }} /></Box>
                    <Typography variant="h5" sx={{ color: '#E6F0E6', fontWeight: 'bold', mb: 1 }}>Disconnect Worker?</Typography>
                    <Typography sx={{ color: '#9AA6A8', fontSize: '14px', mb: 3, lineHeight: 1.6 }}>
                        This will disconnect <span style={{ color: '#FBFBFB', fontWeight: 'bold' }}>{workerName}</span> from the current host. The machine will be released for <span style={{ color: '#8FFF9C' }}>re-download</span>.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button fullWidth onClick={onClose} disabled={loading} sx={{ color: '#9AA6A8', border: '1px solid #404F57', borderRadius: '12px', textTransform: 'none' }}>Cancel</Button>
                        <Button fullWidth onClick={onConfirm} disabled={loading} sx={{ bgcolor: '#FF9800', color: '#0B0F12', borderRadius: '12px', textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#F57C00' } }}>
                            {loading ? <CircularProgress size={24} sx={{ color: '#0B0F12' }} /> : "Confirm Disconnect"}
                        </Button>
                    </Stack>
                </Box>
                <Box sx={{ bgcolor: 'rgba(255, 152, 0, 0.05)', py: 1.5, px: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}><WarningIcon sx={{ fontSize: 16, color: '#FF9800' }} /><Typography sx={{ fontSize: '12px', color: '#FF9800' }}>Current connection will be terminated immediately.</Typography></Box>
            </Box>
        </Modal>
    );
}