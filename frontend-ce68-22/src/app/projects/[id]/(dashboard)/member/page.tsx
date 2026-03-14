"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Search as SearchIcon, 
  Mail as MailIcon,
  CalendarMonth as JoinIcon,
  Edit as EditIcon,
  Check as SaveIcon,
  Close as CancelIcon,
  Shield as ShieldIcon,
  DeleteOutline as DeleteIcon,
  ExpandMore as ExpandMoreIcon
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
import { GenericFilterButton } from "@/src/components/Common/FilterButton";
import SearchBox from "@/src/components/Common/GenericSearchBox";

export default function MemberPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const queryClient = useQueryClient();

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: meData, isLoading: isMeLoading } = useMe(); 

  const myRole = project?.role?.toLowerCase();
  const isOwner = myRole === "owner";
  const currentUserEmail = meData?.user; 

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const filterOptions = [
    { label: "All Role", value: "ALL" },
    { label: "Owner", value: "owner" },
    { label: "Pentester", value: "pentester" },
    { label: "Developer", value: "developer" },
  ];

  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{email: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: membersData, isLoading: isMembersLoading } = useMembers(
    projectId, page + 1, size, "firstname", "asc", search, roleFilter
  );
  const { mutate: updateRole, isPending: isUpdating } = useChangeRole(projectId);

  const members = membersData?.items || [];
  const totalCount = membersData?.total || 0;

  const handleSaveRole = (email: string) => {
    updateRole({ email, role: pendingRole }, {
      onSuccess: () => setEditingEmail(null)
    });
  };

  const handleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(0);
  };

  // --- Delete Handler ---
  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      // เรียกใช้ Service เพื่อลบสมาชิก
      await projectService.deleteMember(projectId, memberToDelete.email);
      
      // ✅ แจ้งเตือนเมื่อสำเร็จ
      // toast.success("Member removed successfully"); 

      // ✅ สั่งให้ React Query ดึงข้อมูลใหม่เพื่ออัปเดตตาราง
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
      
      // ปิด Modal
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
      // toast.error("Failed to remove member");
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
    }
  };
  const getRoleStyle = (role: string) => {
    const r = role?.toLowerCase();
    if (r === "owner") return "bg-[#8FFF9C]/10 text-[#8FFF9C] border-[#8FFF9C]/30";
    if (r === "pentester") return "bg-[#D49CFF]/10 text-[#D49CFF] border-[#D49CFF]/30";
    if (r === "developer") return "bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/30";
    return "bg-[#404F57]/10 text-[#9AA6A8] border-[#404F57]/30";
  };

  if (isProjectLoading || isMembersLoading || isMeLoading) return (
    <div className="flex justify-center items-center h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8FFF9C]"></div>
    </div>
  );

  

  return (
    <div className="max-w-7xl mx-auto p-4 pb-10 text-[#FBFBFB]">
      <GenericBreadcrums items={[
        { label: "Home", href: "/main" },
        { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
        { label: "Member", href: undefined }
      ]} />

      <div className="mb-10 mt-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Access Management</h1>
        <p className="text-sm font-bold text-[#404F57]">
          Authenticated as: <span className="text-[#8FFF9C]">{meData?.name}</span> ({myRole})
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between gap-4 mb-6">
        <SearchBox 
          value={search} 
          onChange={setSearch} 
          placeholder="Search Members"
          className="w-full max-w-md"
        />
        
        <GenericFilterButton 
          options={filterOptions} 
          currentValue={roleFilter} 
          onSelect={handleFilterChange} 
        />
      </div>

      {/* Table Container */}
      <div className="bg-[#161B1F] border-2 border-[#2D2F39] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E2429] border-b border-[#2D2F39]">
                <th className="px-6 py-5 text-[11px] font-black text-[#667a85] uppercase tracking-widest">Member Identity</th>
                <th className="px-6 py-5 text-[11px] font-black text-[#667a85] uppercase tracking-widest">Authority Level</th>
                <th className="px-6 py-5 text-[11px] font-black text-[#667a85] uppercase tracking-widest">Access Granted</th>
                <th className="px-6 py-5 text-[11px] font-black text-[#667a85] uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2F39]/50 bg-[#111518]">
              {members.length > 0 ? members.map((member) => {
                const isEditing = editingEmail === member.email;
                const isMe = member.email === currentUserEmail;
                const isTargetOwner = member.role.toLowerCase() === "owner";
                const isDisabled = !isOwner || isMe || isTargetOwner;

                return (
                  <tr key={member.email} className="hover:bg-[#8FFF9C]/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 transition-all
                          ${isMe ? "bg-[#8FFF9C]/10 text-[#8FFF9C] border-[#8FFF9C]" : "bg-[#1E2429] text-[#9AA6A8] border-[#2D2F39]"}`}>
                          {member.firstname[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{member.firstname} {member.lastname}</span>
                            {isMe && <span className="px-1.5 py-0.5 rounded bg-[#8FFF9C] text-[#0D1014] text-[9px] font-black">YOU</span>}
                            {isTargetOwner && !isMe && <ShieldIcon className="text-[#8FFF9C] opacity-40 scale-75" />}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#404F57] font-medium">
                            <MailIcon sx={{ fontSize: 13 }} /> {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="relative min-w-[140px]">
                          <select 
                            value={pendingRole}
                            onChange={(e) => setPendingRole(e.target.value)}
                            className="w-full appearance-none bg-[#0D1014] border border-[#8FFF9C]/50 rounded-lg px-3 py-1.5 text-[11px] font-black uppercase text-[#8FFF9C] outline-none"
                          >
                            <option value="owner">OWNER</option>
                            <option value="pentester">PENTESTER</option>
                            <option value="developer">DEVELOPER</option>
                          </select>
                          <ExpandMoreIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8FFF9C] text-sm pointer-events-none" />
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border transition-all ${getRoleStyle(member.role)}`}>
                          {member.role}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-[#9AA6A8] font-bold">
                        <JoinIcon sx={{ fontSize: 14 }} className="text-[#404F57]" />
                        {new Date(member.joinned_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveRole(member.email)} className="p-2 rounded-lg bg-[#8FFF9C]/10 text-[#8FFF9C] hover:bg-[#8FFF9C]/20 transition-all">
                              <SaveIcon fontSize="small" />
                            </button>
                            <button onClick={() => setEditingEmail(null)} className="p-2 rounded-lg bg-[#FE3B46]/10 text-[#FE3B46] hover:bg-[#FE3B46]/20 transition-all">
                              <CancelIcon fontSize="small" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              disabled={isDisabled}
                              onClick={() => { setEditingEmail(member.email); setPendingRole(member.role.toLowerCase()); }}
                              className="p-2 rounded-lg text-[#404F57] hover:text-[#8FFF9C] hover:bg-[#8FFF9C]/5 disabled:opacity-20 transition-all"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button 
                              disabled={isDisabled}
                              onClick={() => { setMemberToDelete({ email: member.email, name: `${member.firstname} ${member.lastname}` }); setDeleteModalOpen(true); }}
                              className="p-2 rounded-lg text-[#404F57] hover:text-[#FE3B46] hover:bg-[#FE3B46]/5 disabled:opacity-20 transition-all"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-[#404F57] font-black uppercase tracking-widest">
                    No matching identities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-4 bg-[#161B1F] border-t border-[#2D2F39]">
          <GenericPagination 
            count={totalCount} page={page} rowsPerPage={size} 
            onPageChange={setPage} 
            onRowsPerPageChange={(v) => { setSize(v); setPage(0); }} 
          />
        </div>
      </div>

      <GenericDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityType="Member"
        entityName={memberToDelete?.name || ""}
        loading={isDeleting}
      />
    </div>
  );
}