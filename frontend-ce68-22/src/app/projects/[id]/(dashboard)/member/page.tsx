"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Box, Typography, Stack, TextField, InputAdornment, 
  MenuItem, Select, Avatar, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Tooltip, Chip 
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Mail as MailIcon,
  CalendarMonth as JoinIcon,
  Edit as EditIcon,
  Check as SaveIcon,
  Close as CancelIcon,
  Shield as ShieldIcon,
  DeleteOutline as DeleteIcon
} from "@mui/icons-material";

// Hooks & Services
import { useMembers } from "@/src/hooks/project/use-members";
import { useProject } from "@/src/hooks/project/use-project";
import { useChangeRole } from "@/src/hooks/project/use-changeRole";
import { useMe } from "@/src/hooks/user/use-me";
import { projectService } from "@/src/services/project.service";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";

export default function MemberPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const queryClient = useQueryClient();

  // 1. ดึงข้อมูล Project (เพื่อเอา Role ของเราในโปรเจกต์นี้)
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  // 2. ดึงข้อมูลตัวตนจาก Backend (/auth/me)
  const { data: meData, isLoading: isMeLoading } = useMe(); 

  const myRole = project?.role?.toLowerCase();
  const isOwner = myRole === "owner";
  
  // ✅ ใช้ meData.user (จาก user["sub"] ใน Backend)
  const currentUserEmail = meData?.user; 

  // --- Pagination & Search States ---
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // --- Inline Edit & Delete States ---
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{email: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Data Fetching & Mutations ---
  const { data: membersData, isLoading: isMembersLoading } = useMembers(
    projectId, page + 1, size, "firstname", "asc", search, roleFilter
  );
  const { mutate: updateRole, isPending: isUpdating } = useChangeRole(projectId);

  const members = membersData?.items || [];
  const totalCount = membersData?.total || 0;

  // --- Handlers ---
  const handleStartEdit = (member: any) => {
    setEditingEmail(member.email);
    setPendingRole(member.role.toLowerCase());
  };

  const handleCancelEdit = () => {
    setEditingEmail(null);
    setPendingRole("");
  };

  const handleSaveRole = (email: string) => {
    updateRole({ email, role: pendingRole }, {
      onSuccess: () => {
        setEditingEmail(null);
        setPendingRole("");
      }
    });
  };

  const handleOpenDeleteModal = (email: string, firstname: string, lastname: string) => {
    setMemberToDelete({ email, name: `${firstname} ${lastname}` });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      await projectService.deleteMember(projectId, memberToDelete.email);
      queryClient.invalidateQueries({ queryKey: ["projects", "user", projectId] });
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
    }
  };

  const getRoleStyle = (role: string) => {
    const r = role?.toLowerCase();
    if (r === "owner") return { color: "#8FFF9C", bg: "rgba(143, 255, 156, 0.05)", border: "rgba(143, 255, 156, 0.2)" };
    if (r === "pentester") return { color: "#D49CFF", bg: "rgba(212, 156, 255, 0.05)", border: "rgba(212, 156, 255, 0.2)" };
    if (r === "developer") return { color: "#70CFFF", bg: "rgba(112, 207, 255, 0.05)", border: "rgba(112, 207, 255, 0.2)" };
    return { color: "#9AA6A8", bg: "rgba(154, 166, 168, 0.05)", border: "rgba(154, 166, 168, 0.1)" };
  };

  // ✅ รวมสถานะ Loading
  if (isProjectLoading || isMembersLoading || isMeLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <CircularProgress sx={{ color: "#8FFF9C" }} />
    </Box>
  );

  return (
    <Box className="animate-in fade-in duration-700 max-w-7xl mx-auto p-2 pb-10">
      <GenericBreadcrums items={[
        { label: "Home", href: "/main" },
        { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
        { label: "Member", href: undefined }
      ]} />

      <Box mb={5} mt={4}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 1, letterSpacing: '-0.02em' }}>
          Access Management
        </Typography>
        <Typography variant="body2" sx={{ color: "#404F57", fontWeight: 600 }}>
          Authenticated as: <span className="text-[#8FFF9C]">{meData?.name}</span> ({myRole})
        </Typography>
      </Box>

      {/* Toolbar */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          placeholder="Filter by name or email identity..."
          variant="outlined" size="small" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ 
            flexGrow: 1, bgcolor: "#1E2429", borderRadius: '12px',
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#404F57" },
            "& .MuiInputBase-input": { color: "#FBFBFB", fontSize: '14px' }
          }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#404F57", fontSize: 20 }} /></InputAdornment> }}
        />
        <Select
          size="small" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
          sx={{ 
            minWidth: 180, bgcolor: "#1E2429", color: "#FBFBFB", borderRadius: '12px',
            fontSize: '14px', fontWeight: 600,
            ".MuiOutlinedInput-notchedOutline": { borderColor: "#404F57" }
          }}
        >
          <MenuItem value="ALL">All Authorities</MenuItem>
          <MenuItem value="owner">Owner</MenuItem>
          <MenuItem value="pentester">Pentester</MenuItem>
          <MenuItem value="developer">Developer</MenuItem>
        </Select>
      </Stack>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: "#0D1014", border: "1px solid #2D2F39", 
          borderRadius: "16px", overflow: "hidden",
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#161B1F" }}>
            <TableRow>
              <TableCell sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39', py: 2.5 }}>MEMBER IDENTITY</TableCell>
              <TableCell sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39' }}>AUTHORITY LEVEL</TableCell>
              <TableCell sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39' }}>ACCESS GRANTED</TableCell>
              <TableCell align="right" sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39' }}>CONTROL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.length > 0 ? members.map((member) => {
              const isEditing = editingEmail === member.email;
              const isMe = member.email === currentUserEmail;
              const isTargetOwner = member.role.toLowerCase() === "owner";
              const rStyle = getRoleStyle(isEditing ? pendingRole : member.role);

              // ✅ สรุป Logic การ Disable:
              // 1. เราไม่ใช่ Owner -> แก้ไม่ได้
              // 2. แถวนั้นเป็นตัวเอง -> แก้ไม่ได้
              // 3. แถวนั้นเป็น Owner คนอื่น -> แก้ไม่ได้
              const isDisabled = !isOwner || isMe || isTargetOwner;

              return (
                <TableRow key={member.email} sx={{ "&:hover": { bgcolor: "rgba(143, 255, 156, 0.02)" } }}>
                  <TableCell sx={{ borderBottom: "1px solid #1C2126" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ 
                        bgcolor: isMe ? "rgba(143, 255, 156, 0.1)" : "#1E2429", 
                        color: isMe ? "#8FFF9C" : "#9AA6A8", 
                        border: isMe ? '2px solid #8FFF9C' : '1px solid #404F57' 
                      }}>
                        {member.firstname[0]}
                      </Avatar>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ color: "#FBFBFB", fontWeight: 700, fontSize: '14px' }}>
                            {member.firstname} {member.lastname}
                          </Typography>
                          {isMe && <Chip label="YOU" size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 900, bgcolor: "#8FFF9C", color: "#0D1014" }} />}
                          {isTargetOwner && !isMe && <ShieldIcon sx={{ fontSize: 14, color: "#8FFF9C", opacity: 0.6 }} />}
                        </Stack>
                        <Typography sx={{ color: "#404F57", fontSize: '12px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MailIcon sx={{ fontSize: 13 }} /> {member.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  
                  <TableCell sx={{ borderBottom: "1px solid #1C2126" }}>
                    {isEditing ? (
                      <Select 
                        size="small" value={pendingRole} disabled={isUpdating}
                        onChange={(e) => setPendingRole(e.target.value)} 
                        sx={{ 
                          minWidth: 120, height: 32, fontSize: '11px', fontWeight: 900, 
                          color: rStyle.color, bgcolor: rStyle.bg, border: `1px solid ${rStyle.color}`, 
                          ".MuiOutlinedInput-notchedOutline": { border: "none" },
                          textTransform: 'uppercase'
                        }}
                      >
                        <MenuItem value="owner">OWNER</MenuItem>
                        <MenuItem value="pentester">PENTESTER</MenuItem>
                        <MenuItem value="developer">DEVELOPER</MenuItem>
                      </Select>
                    ) : (
                      <Chip 
                        label={member.role.toUpperCase()} 
                        sx={{ height: 24, fontSize: '10px', fontWeight: 900, color: rStyle.color, bgcolor: rStyle.bg, border: `1px solid ${rStyle.border}` }} 
                      />
                    )}
                  </TableCell>
                  
                  <TableCell sx={{ borderBottom: "1px solid #1C2126" }}>
                    <Typography sx={{ color: "#9AA6A8", fontSize: '12px', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <JoinIcon sx={{ fontSize: 14, color: '#404F57' }} />
                      {new Date(member.joinned_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right" sx={{ borderBottom: "1px solid #1C2126" }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {isEditing ? (
                        <>
                          <IconButton size="small" onClick={handleCancelEdit} disabled={isUpdating} sx={{ color: "#FE3B46" }}><CancelIcon /></IconButton>
                          <IconButton size="small" onClick={() => handleSaveRole(member.email)} disabled={isUpdating} sx={{ color: "#8FFF9C" }}>
                            {isUpdating ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {/* ปุ่มแก้ไข */}
                          <Tooltip title={
                            !isOwner ? "Insufficient permissions" : 
                            isMe ? "Self-modification restricted" : 
                            isTargetOwner ? "Owner accounts are immutable" : 
                            "Modify Authority"
                          }>
                            <span>
                              <IconButton 
                                size="small" disabled={isDisabled} 
                                onClick={() => handleStartEdit(member)} 
                                sx={{ color: "#404F57", "&:hover": { color: "#8FFF9C" } }}
                              >
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </span>
                          </Tooltip>

                          {/* ปุ่มลบ */}
                          <Tooltip title={
                            !isOwner ? "Insufficient permissions" : 
                            isMe ? "You cannot remove yourself" : 
                            isTargetOwner ? "Owners cannot be removed by peers" : 
                            "Remove Member"
                          }>
                            <span>
                              <IconButton 
                                size="small" disabled={isDisabled} 
                                onClick={() => handleOpenDeleteModal(member.email, member.firstname, member.lastname)} 
                                sx={{ color: "#404F57", "&:hover": { color: "#FE3B46" } }}
                              >
                                <DeleteIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><Typography sx={{ color: '#404F57', fontWeight: 700 }}>NO MATCHING IDENTITIES FOUND</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <Box sx={{ p: 1, borderTop: "1px solid #2D2F39", bgcolor: "#161B1F" }}>
          <GenericPagination 
            count={totalCount} page={page} rowsPerPage={size} 
            onPageChange={setPage} 
            onRowsPerPageChange={(v) => { setSize(v); setPage(0); }} 
          />
        </Box>
      </TableContainer>

      <GenericDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityType="Member"
        entityName={memberToDelete?.name || ""}
        loading={isDeleting}
      />
    </Box>
  );
}