"use client";
import React, { useEffect } from 'react'
import { useState } from "react";
import Link from 'next/link';
import { LoginPayload, RegisterPayload, UserKey } from "../types/auth";
import { useRouter } from 'next/navigation';
import { login, register } from '../services/auth.service';

export default function RegisterCard() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [gerror, setGoogleError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const registerPayload: RegisterPayload = { firstName, lastName, email, password };
        const loginPayload: LoginPayload = { email, password };

        try {
            console.log("Registering user:", registerPayload);
            await register(registerPayload);
            const user: UserKey = await login(loginPayload);
            router.push("/main");
            router.refresh();

        } catch (err) {
            setError("This Email is already been used");
        }
    }

    async function handleGoogleLogin(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        try {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
        } catch (err) {
            setGoogleError("Google login failed");
        }
    }

    return (
        <div className="w-full max-w-md rounded-2xl border-3 border-[#9AA6A8] shadow-lg p-10">
            <div className="text-center mb-6">
                <h1 className="text-3xl text-[#E6F0E6] font-semibold">Sign up</h1>
                <p className="text-sm text-[#9AA6A8] mt-2">Create a new account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div className='flex flex-row gap-4'>
                    <div className='w-50'>
                        <label htmlFor="email" className="block text-sm font-medium text-[#E6F0E6]">
                            First Name
                        </label>
                        <input
                            id="Firstname"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1 p-2 block w-full rounded-md bg-[#FBFBFB] text-[#404F57]
                            focus:ring-1 focus:ring-[#FBFBFB]"
                            placeholder="Fubuki"
                            required
                        />
                    </div>
                    <div className='w-50'>
                        <label htmlFor="email" className="block text-sm font-medium text-[#E6F0E6]">
                            Last Name
                        </label>
                        <input
                            id="Lastname"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 p-2 block w-full rounded-md bg-[#FBFBFB] text-[#404F57]
                        focus:ring-1 focus:ring-[#FBFBFB]"
                            placeholder="Shirakami"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#E6F0E6]">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 block w-full rounded-md bg-[#FBFBFB] text-[#404F57]
                        focus:ring-1 focus:ring-[#FBFBFB]"
                        placeholder="you@company.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#E6F0E6]">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 p-2 block w-full rounded-md bg-[#FBFBFB] text-[#404F57]
                        focus:ring-1 focus:ring-[#FBFBFB]"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full py-2 rounded-md bg-[#8FFF9C] text-[#0B0F12] font-bold 
                    hover:bg-[#AFFFB9]"
                >
                    Create Account
                </button>
                {error && <p style={{ color: "#FE3B46" }}>{error}</p>}
            </form>

            <button
                onClick={handleGoogleLogin}
                type="button"
                className="mt-6 w-full py-2 flex justify-center items-center gap-3 rounded-md bg-[#FBFBFB] text-[#404F57] font-bold 
                hover:bg-[#DCDCDC]"
            >
                <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#4285f4" d="M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 0 1-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15" /><path fill="#34a853" d="M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.04 7.04 0 0 0 8.14 15" /><path fill="#fbbc04" d="M4.187 9.342a4.17 4.17 0 0 1 0-2.68V4.859H1.849a6.97 6.97 0 0 0 0 6.286z" /><path fill="#ea4335" d="M8.14 3.77a3.84 3.84 0 0 1 2.7 1.05l2.01-1.999a6.8 6.8 0 0 0-4.71-1.82 7.04 7.04 0 0 0-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z" /></svg>
                Join with Google
            </button>
            {gerror && <p style={{ color: "#FE3B46" }}>{gerror}</p>}

            <div className="mt-6 text-center text-sm text-[#E6F0E6]">
                Already have an account? <Link href="/login" className="text-[#8FFF9C] hover:underline">Log in</Link>
            </div>
        </div>
    );
}
