"use client";
import React from 'react'
import { useAuthStore } from '@/src/store/auth';
import { UserKey } from '@/src/types/auth';
import { logout, getMe } from '@/src/services/auth.service';

const ForgotPassword = () => {

  /////////////// TEMPORARY DELETE LATERRRRRR ///////////////
  const clearUser = useAuthStore((state) => state.clearUser);
  const userNow = useAuthStore((state) => state.userNow);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = await logout();
    clearUser();
    console.log("Logout message:", message["message"]);
  }

  async function clearadUser() {
    clearUser();
    console.log("User cleared from store");
      console.log("asdasdasdasdsadsadsadsad:", userNow);
  }

    async function showww() {
    console.log("showww eeee");
      console.log("asddd:", userNow);
  }

  async function fetchCurrentUser() {
    try {
        const res = await getMe();
        console.log("authen?", res["message"]);
        console.log("Current user from getMe():", res["user"]);
    } catch (error) {
        console.error("Error fetching current user:", error);
    }
  }

  /////////////// END OF TEMPORARY DELETE LATER ///////////////

  return (
    <>
      <div>ForgotPassword</div>

      {/* tempbutton pls delete after log out is done*/}
      <button onClick={handleSubmit} className='bg-white w-full'>Log out</button>
      <button onClick={clearadUser} className='bg-white w-full'>clearrr</button>
      <button onClick={fetchCurrentUser} className='bg-white w-full'>get me</button>
      <button onClick={showww} className='bg-white w-full'>store show</button>

    </>
  )
}

export default ForgotPassword