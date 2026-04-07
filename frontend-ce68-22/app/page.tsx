"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LandingPageNavbar } from "../components/LandingPageNavbar";

// ── Looping type/erase hook ───────────────────────────────────────────────────
const PHRASES = [
  "penetration testing, managed.",
  "vulnerabilities, documented.",
  "reports, generated instantly.",
  "your team, always in sync.",
];

function useLoopingTypingEffect(
  phrases: string[],
  typeSpeed = 60,
  eraseSpeed = 30,
  pauseMs = 1800
) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];

    if (!isErasing && displayed.length < current.length) {
      const t = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        typeSpeed
      );
      return () => clearTimeout(t);
    }

    if (!isErasing && displayed.length === current.length) {
      const t = setTimeout(() => setIsErasing(true), pauseMs);
      return () => clearTimeout(t);
    }

    if (isErasing && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), eraseSpeed);
      return () => clearTimeout(t);
    }

    if (isErasing && displayed.length === 0) {
      setIsErasing(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }
  }, [displayed, isErasing, phraseIndex, phrases, typeSpeed, eraseSpeed, pauseMs]);

  return displayed;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "01",
    title: "Asset Management",
    description:
      "Define and track every target in scope. Organize by domain, IP range, or service — structured for precision engagement.",
  },
  {
    id: "02",
    title: "Vulnerability Tracking",
    description:
      "Log findings with CVSS scoring, reproduction steps, and remediation status. Nothing slips through the cracks.",
  },
  {
    id: "03",
    title: "Report Generation",
    description:
      "Export polished PDF and DOCX reports in one click. Built for clients who need clarity, not jargon.",
  },
  {
    id: "04",
    title: "Team Collaboration",
    description:
      "Owner and tester roles with scoped visibility. Coordinate across engagements without exposing sensitive data.",
  },
];

const STATS = [
  { value: "100%", label: "Offline Capable" },
  { value: "2", label: "Export Formats" },
  { value: "∞", label: "Projects" },
  { value: "0", label: "Vendor Lock-in" },
];

// ── Components ────────────────────────────────────────────────────────────────
function GridBackground() {
  return (
<<<<<<< HEAD:frontend-ce68-22/app/page.tsx
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
=======
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(#8FFF9C 1px, transparent 1px),
          linear-gradient(90deg, #8FFF9C 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    />
>>>>>>> deploy:frontend-ce68-22/src/app/page.tsx
  );
}

function ScanLine() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
    />
  );
}


// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const typed = useLoopingTypingEffect(PHRASES);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="h-screen bg-[#0D1014] text-[#FBFBFB] overflow-y-auto">
      <GridBackground />
      <ScanLine />
      <LandingPageNavbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex min-h-screen flex-col items-start justify-center px-6 pt-24 max-w-6xl mx-auto">
        {/* Terminal prompt tag */}
        <div
          className={`mb-6 flex items-center gap-2 transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <span className="h-2 w-2 rounded-full bg-[#8FFF9C] animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-[#8FFF9C]">
            PEST10 // PENTEST PLATFORM v1.0
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`text-[clamp(48px,8vw,96px)] font-black leading-[0.95] tracking-tight transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          <span className="block text-[#FBFBFB]">YOUR</span>
          <span className="block text-[#8FFF9C]">TARGETS.</span>
          <span className="block text-[#FBFBFB]">YOUR</span>
          <span className="block text-[#8FFF9C]">REPORTS.</span>
        </h1>

        {/* Typing subline */}
        <div
          className={`mt-8 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-lg text-[#9AA6A8]">
            <span className="text-[#8FFF9C]">$&gt; </span>
            {typed}
            <span className="animate-pulse text-[#8FFF9C]">_</span>
          </p>
        </div>

        {/* CTA */}
        <div
          className={`mt-12 flex items-center gap-4 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/register"
            className="group relative overflow-hidden bg-[#8FFF9C] px-8 py-4 font-mono text-sm font-black tracking-widest text-[#0D1014] transition-all hover:shadow-[0_0_32px_rgba(143,255,156,0.4)]"
          >
            GET STARTED
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="#features"
            className="border border-[#2D2F39] px-8 py-4 font-mono text-sm tracking-widest text-[#9AA6A8] transition-all hover:border-[#8FFF9C]/40 hover:text-[#FBFBFB]"
          >
            SEE FEATURES
          </a>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      {/* <section className="relative z-10 border-y border-[#8FFF9C]/10 bg-[#0D1014]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-10 px-6 ${i < STATS.length - 1 ? "border-r border-[#8FFF9C]/10" : ""}`}
              >
                <p
                  className="font-mono text-4xl font-black text-[#8FFF9C]"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-xs tracking-widest text-[#404F57]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Section label */}
          <div className="mb-16 flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-[#8FFF9C]">// FEATURES</span>
            <div className="h-px flex-1 bg-[#8FFF9C]/10" />
          </div>

          <div className="grid gap-px bg-[#8FFF9C]/10 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="group relative bg-[#0D1014] p-10 transition-colors hover:bg-[#1E2429]"
              >
                {/* Number */}
                <span
                  className="font-mono text-6xl font-black text-[#8FFF9C]/10 transition-colors group-hover:text-[#8FFF9C]/20"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  {feature.id}
                </span>
                {/* Title */}
                <h3 className="mt-4 font-mono text-lg font-bold tracking-wide text-[#FBFBFB]">
                  {feature.title}
                </h3>
                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-[#9AA6A8]">
                  {feature.description}
                </p>
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#8FFF9C] transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / CTA ─────────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="border border-[#8FFF9C]/10 p-12 md:p-20 relative overflow-hidden">
            {/* BG accent */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#8FFF9C]/5 blur-3xl" />

            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8FFF9C]" />
              <span className="font-mono text-xs tracking-widest text-[#8FFF9C]">ABOUT PEST10</span>
            </div>

            <h2
              className="text-[clamp(32px,5vw,64px)] font-black leading-tight tracking-tight text-[#FBFBFB]"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              BUILT FOR<br />
              <span className="text-[#8FFF9C]">PENTESTERS,</span><br />
              BY PENTESTERS.
            </h2>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#9AA6A8]">
              Pest10 is a focused platform for managing penetration testing engagements end-to-end.
              No bloat. No distractions. Track assets, document vulnerabilities, collaborate with your
              team, and deliver client-ready reports — all in one place.
            </p>

            <Link
              href="/register"
              className="mt-10 inline-flex items-center gap-3 bg-[#8FFF9C] px-8 py-4 font-mono text-sm font-black tracking-widest text-[#0D1014] transition-all hover:shadow-[0_0_32px_rgba(143,255,156,0.4)]"
            >
              START YOUR FIRST PROJECT →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#8FFF9C]/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span
            className="font-mono text-sm font-black tracking-widest text-[#FBFBFB]"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            PEST<span className="text-[#8FFF9C]">10</span>
          </span>
          <span className="font-mono text-xs tracking-widest text-[#404F57]">
            © {new Date().getFullYear()} — ALL RIGHTS RESERVED
          </span>
        </div>
      </footer>
    </div>
  );
}