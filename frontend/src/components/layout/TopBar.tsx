"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown } from "lucide-react";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title = "Assignment" }: TopBarProps) {
  const router = useRouter();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="topbar-back" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </button>
        <span className="topbar-title">
          <FileText size={16} />
          {title}
        </span>
      </div>
      <div className="topbar-right">
        <div className="topbar-bell">
          <Bell size={20} />
          <span className="dot" />
        </div>
        <div className="topbar-user">
          <div className="topbar-avatar">JD</div>
          John Doe
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

function FileText({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
