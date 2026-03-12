"use client";
import { LandingPageNavbar } from "../components/LandingPageNavbar";

export default function Home() {
  return (
    <>
      <LandingPageNavbar />
      <div className="flex min-h-screen flex-col items-center p-24 bg-[#0b0f12]">
        <h1 className="text-6xl pb-10 font-bold text-[#E6F0E6] mb-4">
          Please Login to enjoy our product
        </h1>
        <img src="pest10_logo_Square.png" alt="brand_logo" />
      </div>
    </>
  )
}
