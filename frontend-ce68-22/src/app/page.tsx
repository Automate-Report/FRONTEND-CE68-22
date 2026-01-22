"use client";
import { LandingPageNavbar } from "../components/LandingPageNavbar";

export default function Home() {
  return (
    <>
      <LandingPageNavbar />
      <div className="flex min-h-screen flex-col items-center p-24 bg-black">
        <h1 className="text-6xl pb-10 font-extrabold animate-rainbow">
          LaNdINg PaGEE
        </h1>

        <style jsx>{`
        @keyframes rainbow {
          0% { color: #ef4444; }
          16% { color: #f97316; }
          33% { color: #eab308; }
          50% { color: #22c55e; }
          66% { color: #3b82f6; }
          83% { color: #a855f7; }
          100% { color: #ef4444; }
          }

          .animate-rainbow {
            animation: rainbow 2s linear infinite;
            }
            `}</style>

        <div className='text-white text-4xl'>
          ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣶⣶⣶⣶⣦⣤⡀⠀⠀⠀⠀⠀⠀<br></br>
          ⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣄⣶⣿⠟⠛⠉⠀⠀⠀⢀⣹⣿⡇⠀⠀⠀⠀⠀⠀<br></br>
          ⠀⠀⠀⠀⢀⣤⣾⣿⡟⠛⠛⠛⠉⠀⠀⠀⠀⠒⠒⠛⠿⠿⠿⠶⣿⣷⣢⣄⡀⠀<br></br>
          ⠀⠀⠀⢠⣿⡟⠉⠈⣻⣦⠀⠀⣠⡴⠶⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣮⣦<br></br>
          ⠀⠀⢰⣿⠿⣿⡶⠾⢻⡿⠀⠠⣿⣄⣠⣼⣿⡇⠀⠈⠒⢶⣤⣤⣤⣤⣤⣴⣾⡿<br></br>
          ⠀⠀⣾⣿⠀⠉⠛⠒⠋⠀⠀⠀⠻⢿⣉⣠⠟⠀⠀⠀⠀⠀⠉⠻⣿⣋⠙⠉⠁⠀<br></br>
          ⠀⠀⣿⡿⠷⠲⢶⣄⠀⠀⠀⠀⠀⣀⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠙⣷⣦⠀⠀⠀<br></br>
          ⠛⠛⢿⣅⣀⣀⣀⣿⠶⠶⠶⢤⣾⠋⠀⠀⠙⣷⣄⣀⣀⣀⣀⡀⠀⠘⣿⣆⠀⠀<br></br>
          ⠀⠀⠀⠈⠉⠉⠉⠁⠀⠀⠀⠀⠈⠛⠛⠶⠾⠋⠉⠉⠉⠉⠉⠉⠉⠉⠛⠛⠛⠛<br></br>
        </div>
      </div>
    </>
  )
}
