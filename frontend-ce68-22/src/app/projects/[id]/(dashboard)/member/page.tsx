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
  ExpandMore as ExpandMoreIcon,
  Close,
  WarningAmber,
  InsertInvitation,
  CheckCircle
} from "@mui/icons-material";
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

// Hooks & Services
import { useMembers } from "@/src/hooks/project/use-members";
import { useProject } from "@/src/hooks/project/use-project";
import { useChangeRole } from "@/src/hooks/project/use-changeRole";
import { useMe } from "@/src/hooks/user/use-me";
import { projectService } from "@/src/services/project.service";
import { userService } from "@/src/services/user.service";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { GenericFilterButton } from "@/src/components/Common/FilterButton";
import SearchBox from "@/src/components/Common/GenericSearchBox";
import { GREEN_BUTTON_STYLE } from "@/src/styles/greenButton";
import { FILTER_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import { InviteRole } from "@/src/types/invite";
import GenericDropdown from "@/src/components/Common/GenericDropdown";
import { INPUT_BOX_NO_ICON_STYLE } from "@/src/styles/inputBoxStyle";
import { showToast } from "@/src/components/Common/ToastContainer";
import axios from "axios";

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

  //Errors
  const [error, setError] = useState({ userExistError: false });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitePerson, setInvitePerson] = useState("");
  const [invitePersonRole, setInvitePersonRole] = useState<InviteRole>("pentester");

  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ email: string, name: string } | null>(null);
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

  const handleConfirmInvite = async (email: string) => {
    setError({ userExistError: false });
    if (!invitePerson) return;
    // 1. Check if user with that email exist in the system (call BE)
    const userExists = await userService.checkExist(email);

    // 2. If exist, send invite and assign role (also call BE)
    if (userExists) {
      try {
        await projectService.inviteMember(projectId, email, invitePersonRole);
        setShowInviteModal(false);
        setInvitePerson("");
        setInvitePersonRole("pentester");
        showToast({
          icon: <CheckCircle sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
          message: `Invite sent to ${invitePerson}!`,
          borderColor: "#8FFF9C",
          duration: 6000,
        });
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.detail
          : "Something went wrong.";

        showToast({
          icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
          message: message || "Something went wrong.",
          borderColor: "#FE3B46",
          duration: 6000,
        });
      }

      // 3. If not exist, show error under input box "No user found with this email"
    } else {
      setError({ userExistError: true });
    }

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
    <div className="flex flex-col w-full text-[#E6F0E6]">
      <GenericBreadcrums items={[
        { label: "Home", href: "/main" },
        { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
        { label: "Member", href: undefined }
      ]} />

      <div className="w-full flex flex-col mb-6">
        <h1 className="font-bold text-[36px]">
          Access Management
        </h1>
        <p className="text-[#9AA6A8]">
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

        {myRole === "owner" && (
          <button className={`${GREEN_BUTTON_STYLE} ml-auto`} onClick={() => { setShowInviteModal(true) }}>
            Invite Member
            <PeopleAltRoundedIcon />
          </button>
        )}

        <GenericFilterButton
          options={filterOptions}
          currentValue={roleFilter}
          onSelect={handleFilterChange}
        />
      </div>

      {/* Table Container */}
      <div className="bg-[#0B0F12] border-[2px] border-[#2D2F39] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B0F12] border-b border-[#2D2F39]">
                <th className="px-8 py-5 text-[12px] font-bold text-[#404F57] uppercase tracking-wider">Member Identity</th>
                <th className="px-8 py-5 text-[12px] font-bold text-[#404F57] uppercase tracking-wider text-center">Authority Level</th>
                <th className="px-8 py-5 text-[12px] font-bold text-[#404F57] uppercase tracking-wider text-center">Access Granted</th>
                {myRole === "owner" && (
                  <th className="px-8 py-5 text-[12px] font-bold text-[#404F57] uppercase tracking-wider text-right">Control</th>
                )}
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
                            <span className="font-bold text-base">{member.firstname} {member.lastname}</span>
                            {isMe && <span className="px-1.5 py-0.5 rounded bg-[#8FFF9C] text-[#0D1014] text-[10px] font-black">YOU</span>}
                            {isTargetOwner && !isMe && <ShieldIcon className="text-[#8FFF9C] opacity-40 scale-75" />}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#404F57] font-medium">
                            <MailIcon sx={{ fontSize: 13 }} /> {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <div className="relative min-w-[140px]">
                          <select
                            value={pendingRole}
                            onChange={(e) => setPendingRole(e.target.value)}
                            className="w-full appearance-none bg-[#0D1014] border border-[#8FFF9C]/50 rounded-lg px-3 py-1.5 text-[11px] font-black uppercase text-[#8FFF9C] outline-none"
                          >
                            <option value="pentester">PENTESTER</option>
                            <option value="developer">DEVELOPER</option>
                          </select>
                          <ExpandMoreIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8FFF9C] text-sm pointer-events-none" />
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-lg text-[12px] font-bold tracking-widest uppercase border transition-all ${getRoleStyle(member.role)}`}>
                          {member.role}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2 text-sm text-[#9AA6A8] font-bold">
                        <JoinIcon sx={{ fontSize: 14 }} className="text-[#404F57]" />
                        {new Date(member.joinned_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    {myRole === "owner" && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={() => handleSaveRole(member.email)} className="flex justify-center items-center p-2 rounded-lg bg-[#8FFF9C]/10 text-[#8FFF9C] hover:bg-[#8FFF9C]/20 transition-all">
                                <SaveIcon fontSize="small" />
                              </button>
                              <button onClick={() => setEditingEmail(null)} className="flex justify-center items-center p-2 rounded-lg bg-[#FE3B46]/10 text-[#FE3B46] hover:bg-[#FE3B46]/20 transition-all">
                                <CancelIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                disabled={isDisabled}
                                onClick={() => { setEditingEmail(member.email); setPendingRole(member.role.toLowerCase()); }}
                                className="flex justify-center items-center p-2 rounded-lg text-[#404F57] hover:text-[#8FFF9C] hover:bg-[#8FFF9C]/5 disabled:opacity-20 transition-all"
                              >
                                <EditIcon fontSize="small" />
                              </button>
                              <button
                                disabled={isDisabled}
                                onClick={() => { setMemberToDelete({ email: member.email, name: `${member.firstname} ${member.lastname}` }); setDeleteModalOpen(true); }}
                                className="flex justify-center items-center p-2 rounded-lg text-[#404F57] hover:text-[#FE3B46] hover:bg-[#FE3B46]/5 disabled:opacity-20 transition-all"
                              >
                                <DeleteIcon fontSize="small" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
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
        <div className="p-4 bg-[#0B0F12] border-t border-[#2D2F39]">
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

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border-[2px] border-[#2D2F39] border-t-0 bg-[#1E2429] shadow-2xl overflow-hidden relative">

            {/* Top strip */}
            <div className="h-0.5 w-full bg-[#8FFF9C]" />

            {/* X */}
            <button
              onClick={() => { setShowInviteModal(false) }}
              className="rounded-lg p-1.5 text-[#9AA6A8] transition-colors hover:text-[#FBFBFB] absolute top-2 right-2"
            >
              <Close fontSize="small" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 text-[#8FFF9C]">
                  <InsertInvitation sx={{ fontSize: 28 }} />
                  <h2 className="font-bold text-xl leading-tight text-[#8FFF9C]">
                    Invite teammates
                  </h2>
                </div>
              </div>

              {/* Warning description */}
              <p className="text-sm text-[#9AA6A8] leading-relaxed mb-5">
                Collaborate with your team. Enter their email addresses and we'll send them an invite.
              </p>

              {/* Input */}
              <label className="font-semibold text-[#9AA6A8] text-sm">
                Member's Email
              </label>
              <input
                className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                value={invitePerson}
                onChange={(e) => setInvitePerson(e.target.value)}
                placeholder="colleague@company.com"
              />
              {error.userExistError && (
                <p className="text-sm text-[#FE3B46] mt-1">
                  No user found with this email.
                </p>
              )}

              {/* Roles */}
              <div className="mt-2">
                <label className="font-semibold text-[#9AA6A8] text-sm">
                  Roles
                </label>
                <GenericDropdown<InviteRole>
                  options={[{ label: "Pentester", value: "pentester" }, { label: "Developer", value: "developer" }]}
                  value={invitePersonRole}
                  placeholder="Roles"
                  onChange={(e) => setInvitePersonRole(e)}
                />
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => { setShowInviteModal(false) }}
                  className={`${FILTER_BUTTON_STYLE} w-full justify-center items-center`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleConfirmInvite(invitePerson) }}
                  className={`${GREEN_BUTTON_STYLE} w-full`}
                >
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}