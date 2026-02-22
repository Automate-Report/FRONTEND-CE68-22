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
        <Modal open={open} onClose={!loading ? onClose : undefined} closeAfterTransition>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 450 },
                bgcolor: '#1A2023', // สีเข้มตามธีมของคุณ
                borderRadius: '20px',
                border: '1px solid #404F57',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                outline: 'none',
                overflow: 'hidden'
            }}>
                {/* Header Section */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={onClose} disabled={loading} sx={{ color: '#9AA6A8' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content Section */}
                <Box sx={{ px: 4, pb: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                        width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(255, 152, 0, 0.1)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
                        border: '1px solid rgba(255, 152, 0, 0.2)'
                    }}>
                        <UnlinkIcon sx={{ fontSize: 32, color: '#FF9800' }} />
                    </Box>

                    <Typography variant="h5" sx={{ color: '#E6F0E6', fontWeight: 'bold', mb: 1 }}>
                        Unlink Worker?
                    </Typography>
                    
                    <Typography sx={{ color: '#9AA6A8', fontSize: '14px', mb: 3, lineHeight: 1.6 }}>
                        Are you sure you want to disconnect <span style={{ color: '#FBFBFB', fontWeight: 'bold' }}>{workerName}</span> from this project? 
                        The worker will remain in the system but won't be able to receive new tasks from this project.
                    </Typography>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            fullWidth
                            onClick={onClose}
                            disabled={loading}
                            sx={{ 
                                bgcolor: 'transparent', color: '#9AA6A8', border: '1px solid #404F57',
                                borderRadius: '12px', py: 1.5, textTransform: 'none', fontWeight: 'bold',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: '#9AA6A8' }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            onClick={onConfirm}
                            disabled={loading}
                            sx={{ 
                                bgcolor: '#FF9800', color: '#0B0F12', borderRadius: '12px', py: 1.5,
                                textTransform: 'none', fontWeight: 'bold',
                                '&:hover': { bgcolor: '#F57C00' },
                                '&:disabled': { bgcolor: 'rgba(255, 152, 0, 0.3)' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#0B0F12' }} /> : "Confirm Unlink"}
                        </Button>
                    </Stack>
                </Box>

                {/* Warning Footer */}
                <Box sx={{ bgcolor: 'rgba(255, 152, 0, 0.05)', py: 1.5, px: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WarningIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                    <Typography sx={{ fontSize: '12px', color: '#FF9800' }}>
                        This action can be undone by linking the worker again.
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
}