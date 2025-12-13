"use client";
import React from 'react'
import { useAuthStore } from '@/src/store/auth';

const ForgotPassword = () => {

  /////////////// TEMPORARY DELETE LATERRRRRR ///////////////
  const clearUser = useAuthStore((state) => state.clearUser);
  const userNow = useAuthStore((state) => state.userNow);
  console.log("Current user in ForgotPassword page:", userNow);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearUser();
  }
  /////////////// END OF TEMPORARY DELETE LATER ///////////////

  return (
    <>
      <div>ForgotPassword</div>

      {/* tempbutton pls delete after log out is done*/}
      <button onClick={handleSubmit} className='bg-white w-full'>Log out</button>

    </>
  )
}

export default ForgotPassword