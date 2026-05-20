import React from "react";
import { Sparkles, CheckCircle, ShieldAlert, BadgeInfo } from "lucide-react";

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail = "divyavaid545@gmail.com" }: HeaderProps) {
  return (
    <header
      id="app-header"
      className="bg-[#1A2E2A] text-white px-6 py-4 sticky top-0 z-30 shadow-lg transition-all duration-200"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left Branding Group */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#1A2E2A] shadow-md">
            <Sparkles className="h-5 w-5 animate-pulse text-[#1A2E2A]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase text-white font-sans">
              Woodland <span className="text-[#A3B18A] font-extrabold">AI Poster Studio</span>
            </h1>
            <p className="text-xs font-mono text-slate-300">
              Canva + Adobe Express + AI Proofreading for Schools
            </p>
          </div>
        </div>

        {/* Audit Status Controls & User Info */}
        <div className="flex items-center space-x-4">
          {/* Safeguard Status Pill */}
          <div className="hidden md:flex items-center space-x-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-[#A3B18A] font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-slate-100 font-semibold text-[11px] tracking-wide">AI Proofreader Active</span>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center space-x-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 font-medium font-mono">
            <div className="h-5 w-5 rounded-md bg-[#A3B18A] text-[#1A2E2A] flex items-center justify-center text-[10px] font-black">
              WV
            </div>
            <span className="hidden sm:inline text-slate-300">{userEmail}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
