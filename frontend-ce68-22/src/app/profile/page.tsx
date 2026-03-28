"use client";
import { useState } from "react";
import EditIcon from '@/src/components/icon/Edit';
import { GenericGreenButton } from '@/src/components/Common/GenericGreenButton';
import { useGetUserProfileDisplay } from "@/src/hooks/user/use-profile";

const Profile = () => {

    // fetching
    const { data: user_info } = useGetUserProfileDisplay();

    return (
        <div className="bg-[#0F1518] h-screen flex flex-col">
            {/* Personal info section */}
            <div className='flex flex-row px-[10vw] py-10 h-fit bg-[#1A2025]'>

                {/* Image */}
                {user_info?.picture ? (

                    //If yes image use image
                    <img className="min-w-[150px] min-h-[150px] object-cover rounded-xl"
                        src={user_info?.picture}
                        alt="Profile Picture" />
                ) : (

                    //If no image, use initial 
                    <div className="flex min-w-[150px] min-h-[150px] justify-center items-center rounded-xl text-6xl font-bold text-[#E6F0E6] border-4 border-[#8FFF9C] bg-[#2D2F39]">
                        {user_info?.firstname[0].toUpperCase()}
                    </div>
                )}


                {/* Personal info */}\
                <div className='mx-10 flex flex-col justify-between h-[150px]'>
                    {/* Nmae + Bio */}
                    <div className="w-[45vw]">
                        <h1 className='text-3xl text-[#E6F0E6] font-bold mb-4'>{user_info?.firstname} {user_info?.lastname}</h1>
                        <p className='text-[#9AA6A8] text-sm break-words w-full'>
                            {user_info?.bio ? user_info.bio : "No bio yet"}
                        </p>
                    </div>
                    {/* Email */}
                    <p className='text-[#8FFF9C] text-base font-bold'>
                        {user_info?.email}
                    </p>
                </div>

                {/* Logout and Edit button */}
                <div className='ml-auto whitespace-nowrap'>
                    <GenericGreenButton name="Edit Profile" href="/profile/edit" icon={<EditIcon />} />
                </div>
            </div>

            {/* tbh u can just delete these since it is not required anyway */}
            
            {/* Tabs Navigation */}
            {/* <Box sx={{ borderBottom: 1, borderColor: '#2D2F39', bgcolor: '#161B1F', px: 15, position: 'sticky', top: 0 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
                    sx={{
                        minHeight: 52,
                        height: 52,
                        '& .MuiTab-root': { color: '#404F57', fontWeight: 500, minHeight: 52, height: 52, py: 2, px: 4 },
                        '& .Mui-selected': { color: '#8FFF9C !important' },
                        '& .MuiTabs-indicator': { bgcolor: '#8FFF9C' }
                    }}>
                    <Tab icon={<Assignment sx={{ fontSize: 18 }} />} iconPosition="start" label="Assigned to me" sx={{ fontSize: 14, textTransform: 'none' }} />
                </Tabs>
            </Box> */}

            {/* Tab Content */}
            {/* <div className="flex-1 px-15">
                {activeTab === 0 && <AssignedToMe />}
            </div> */}
        </div>

    )
}

export default Profile
