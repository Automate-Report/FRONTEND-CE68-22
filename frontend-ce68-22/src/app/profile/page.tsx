"use client";
import React from 'react'
import { logout, getMe } from '@/src/services/auth.service';
import { useRouter } from 'next/navigation';

const Profile = () => {

    /////////////// TEMPORARY DELETE LATERRRRRR ///////////////
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const message = await logout();
        router.push("/login");
        router.refresh();
        console.log("Logout message:", message["message"]);
    }

    async function fetchCurrentUser() {
        try {
            const res = await getMe();
            console.log("authen?", res["message"]);
            console.log("Current user from getMe():", res["user"]);
            alert("Current user: " + JSON.stringify(res["user"]));
        } catch (error) {
            console.error("Error fetching current user:", error);
        }
    }

    /////////////// END OF TEMPORARY DELETE LATER ///////////////

    return (
        <div className='text-white text-4xl mt-6 ml-6'>
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣶⣶⣶⣶⣦⣤⡀⠀⠀⠀⠀⠀⠀<br></br>
            ⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣄⣶⣿⠟⠛⠉⠀⠀⠀⢀⣹⣿⡇⠀⠀⠀⠀⠀⠀<br></br>
            ⠀⠀⠀⠀⢀⣤⣾⣿⡟⠛⠛⠛⠉⠀⠀⠀⠀⠒⠒⠛⠿⠿⠿⠶⣿⣷⣢⣄⡀⠀<br></br>
            ⠀⠀⠀⢠⣿⡟⠉⠈⣻⣦⠀⠀⣠⡴⠶⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣮⣦<br></br>
            ⠀⠀⢰⣿⠿⣿⡶⠾⢻⡿⠀⠠⣿⣄⣠⣼⣿⡇⠀⠈⠒⢶⣤⣤⣤⣤⣤⣴⣾⡿<br></br>
            ⠀⠀⣾⣿⠀⠉⠛⠒⠋⠀⠀⠀⠻⢿⣉⣠⠟⠀⠀⠀⠀⠀⠉⠻⣿⣋⠙⠉⠁⠀<br></br>
            ⠀⠀⣿⡿⠷⠲⢶⣄⠀⠀⠀⠀⠀⣀⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠙⣷⣦⠀⠀⠀<br></br>
            ⠛⠛⢿⣅⣀⣀⣀⣿⠶⠶⠶⢤⣾⠋⠀⠀⠙⣷⣄⣀⣀⣀⣀⡀⠀⠘⣿⣆⠀⠀<br></br>
            ⠀⠀⠀⠈⠉⠉⠉⠁⠀⠀⠀⠀⠈⠛⠛⠶⠾⠋⠉⠉⠉⠉⠉⠉⠉⠉⠛⠛⠛⠛<br></br>

            {/* tempbutton pls delete after log out is done*/}
            <button onClick={handleSubmit} className='m-10 rounded-md bg-blue-600 px-10 py-5 text-white hover:bg-blue-700'>Log out</button>
            <button onClick={fetchCurrentUser} className='rounded-md bg-blue-600 px-10 py-5 text-white hover:bg-blue-700'>getMe</button>

        </div>
    )
}

export default Profile
