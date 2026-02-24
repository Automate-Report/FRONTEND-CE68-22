"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { 
  Box, Typography, Stack, TextField, InputAdornment, 
  MenuItem, Select, Avatar, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton
} from "@mui/material";
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  MoreVert as ActionIcon,
  Mail as MailIcon,
  CalendarMonth as JoinIcon
} from "@mui/icons-material";
import { useMembers } from "@/src/hooks/user/use-members";
import { useProject } from "@/src/hooks/project/use-project";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

export default function MemberPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);

  // ดึงข้อมูล Project
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const { data: members, isLoading: isMembersLoading } = useMembers(projectId);

  // --- Filter Logic ---
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((m) => {
      const matchesSearch = `${m.firstname} ${m.lastname} ${m.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner": return { color: "#8FFF9C", bg: "rgba(143, 255, 156, 0.05)", border: "rgba(143, 255, 156, 0.2)" };
      case "pentester": return { color: "#D49CFF", bg: "rgba(212, 156, 255, 0.05)", border: "rgba(212, 156, 255, 0.2)" };
      case "developer": return { color: "#70CFFF", bg: "rgba(112, 207, 255, 0.05)", border: "rgba(112, 207, 255, 0.2)" };
      default: return { color: "#9AA6A8", bg: "rgba(154, 166, 168, 0.05)", border: "rgba(154, 166, 168, 0.1)" };
    }
  };

  // ✅ จัดการสถานะกำลังโหลดครอบคลุมทั้ง Project และ Members
  if (isProjectLoading || isMembersLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <CircularProgress sx={{ color: "#8FFF9C" }} />
    </Box>
  );

  // ✅ ใช้ Optional Chaining หรือ Default Value เพื่อความปลอดภัย
  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
    { label: "Member", href: undefined }
  ];

  return (
    <Box className="animate-in fade-in duration-700 max-w-7xl mx-auto p-2">
      <div className="w-full mb-4">
        <GenericBreadcrums items={breadcrumbItems} />
      </div>

      {/* Header Section */}
      <Box mb={5}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 1, letterSpacing: '-0.02em' }}>
          Project Members
        </Typography>
        <Typography variant="body2" sx={{ color: "#404F57", fontWeight: 600 }}>
          Manage your team, roles, and project access permissions.
        </Typography>
      </Box>

      {/* Toolbar: Search & Filter */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          placeholder="Search member by name or email..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ 
            flexGrow: 1, 
            bgcolor: "#1E2429", 
            borderRadius: '12px',
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#404F57" },
            "& .MuiInputBase-input": { color: "#FBFBFB", fontSize: '14px' },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8FFF9C" },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8FFF9C" }
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#404F57", fontSize: 20 }} /></InputAdornment>,
          }}
        />
        
        <Select
          size="small"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ 
            minWidth: 160, bgcolor: "#1E2429", color: "#FBFBFB", borderRadius: '12px',
            fontSize: '14px', fontWeight: 600,
            ".MuiOutlinedInput-notchedOutline": { borderColor: "#404F57" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8FFF9C" }
          }}
        >
          <MenuItem value="ALL">All Roles</MenuItem>
          <MenuItem value="owner">Owner</MenuItem>
          <MenuItem value="pentester">Pentester</MenuItem>
          <MenuItem value="developer">Developer</MenuItem>
        </Select>
      </Stack>

      {/* Member Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: "#0D1014", 
          border: "1px solid #2D2F39", 
          borderRadius: "16px", 
          overflow: "hidden",
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#161B1F" }}>
            <TableRow>
              <TableCell sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39' }}>MEMBER IDENTITY</TableCell>
              <TableCell sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39' }}>ASSIGNED ROLE</TableCell>
              <TableCell sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39' }}>ACCESS GRANTED</TableCell>
              <TableCell align="right" sx={{ color: "#404F57", fontWeight: 900, fontSize: '11px', borderBottom: '1px solid #2D2F39' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => {
              const rStyle = getRoleStyle(member.role);
              return (
                <TableRow 
                  key={member.email} 
                  sx={{ 
                    "&:hover": { bgcolor: "rgba(143, 255, 156, 0.02)" },
                    "& .MuiTableCell-root": { borderBottom: "1px solid #1C2126" }
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: "#1E2429", 
                          color: "#8FFF9C", 
                          fontWeight: 800, 
                          fontSize: '14px',
                          border: '1px solid #404F57'
                        }}
                      >
                        {member.firstname[0]}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: "#FBFBFB", fontWeight: 700, fontSize: '14px' }}>
                          {member.firstname} {member.lastname}
                        </Typography>
                        <Typography sx={{ color: "#404F57", fontSize: '12px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MailIcon sx={{ fontSize: 13 }} /> {member.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Select
                      size="small"
                      value={member.role}
                      sx={{ 
                        minWidth: 120, height: 30, fontSize: '11px', fontWeight: 900,
                        color: rStyle.color,
                        bgcolor: rStyle.bg,
                        borderRadius: '6px',
                        border: `1px solid ${rStyle.border}`,
                        ".MuiOutlinedInput-notchedOutline": { border: "none" },
                        "& .MuiSelect-select": { py: 0, px: 1.5 },
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      <MenuItem value="owner" sx={{ fontSize: '12px', fontWeight: 700 }}>Owner</MenuItem>
                      <MenuItem value="pentester" sx={{ fontSize: '12px', fontWeight: 700 }}>Pentester</MenuItem>
                      <MenuItem value="developer" sx={{ fontSize: '12px', fontWeight: 700 }}>Developer</MenuItem>
                    </Select>
                  </TableCell>
                  
                  <TableCell>
                    <Typography sx={{ color: "#9AA6A8", fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <JoinIcon sx={{ fontSize: 14, color: '#404F57' }} />
                      {new Date(member.joinned_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    <IconButton size="small" sx={{ color: "#404F57", "&:hover": { color: "#FE3B46" } }}>
                      <ActionIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredMembers.length === 0 && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <Typography sx={{ color: '#404F57', fontWeight: 700 }}>Zero entities found.</Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}