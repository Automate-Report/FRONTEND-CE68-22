"use client";
import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import EditIcon from '@/src/components/icon/Edit';
import { GenericGreenButton } from '@/src/components/Common/GenericGreenButton';
import { Assignment, Bookmark } from "@mui/icons-material";
import { AssignedToMe } from "@/src/components/profile/AssignedToMe";
import { BookmarkedProjects } from "@/src/components/profile/BookmarkedProjects";

const Profile = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="bg-[#0F1518] h-screen flex flex-col">
            {/* Personal info section */}
            <div className='flex flex-row px-30 py-10 h-fit bg-[#1A2025]'>

                {/* Image */}
                <img className="w-[150px] h-[150px] object-cover rounded-xl" src="https://wallpaper-a-day.com/wp-content/uploads/2025/09/wallpaper2151.png?w=1440" alt="Profile Picture" />
                {/* Personal info */}\
                <div className='ml-10 flex flex-col justify-between h-[150px]'>
                    {/* Nmae + Bio */}
                    <div>
                        <h1 className='text-3xl text-[#E6F0E6] font-bold mb-4'>Shirakami Fubuki</h1>
                        <p className='text-[#9AA6A8] text-sm'>
                            Very cute Japanese Vtuber also is Hinoshii's Best best friend (User's Bio)
                        </p>
                    </div>
                    {/* Email */}
                    <p className='text-[#8FFF9C] text-base font-bold'>
                        ShirakamiSoCute@gmail.com
                    </p>
                </div>

                {/* Logout and Edit button */}
                <div className='ml-auto'>
                    <GenericGreenButton name="Edit Profile" href="/profile/edit" icon={<EditIcon />} />
                </div>
            </div>

            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: '#2D2F39', bgcolor: '#161B1F', px: 15, position: 'sticky', top: 0 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
                    sx={{
                        minHeight: 52,
                        height: 52,
                        '& .MuiTab-root': { color: '#404F57', fontWeight: 500, minHeight: 52, height: 52, py: 2, px: 4 },
                        '& .Mui-selected': { color: '#8FFF9C !important' },
                        '& .MuiTabs-indicator': { bgcolor: '#8FFF9C' }
                    }}>
                    <Tab icon={<Bookmark sx={{ fontSize: 18 }} />} iconPosition="start" label="Bookmarked Projects" sx={{ fontSize: 14, textTransform: 'none' }} />
                    <Tab icon={<Assignment sx={{ fontSize: 18 }} />} iconPosition="start" label="Assigned to me" sx={{ fontSize: 14, textTransform: 'none' }} />                </Tabs>
            </Box>

            {/* Tab Content */}
            <div className="flex-1">
                {activeTab === 0 && <BookmarkedProjects />}
                {activeTab === 1 && <AssignedToMe />}
            </div>
        </div>

    )
}

export default Profile
