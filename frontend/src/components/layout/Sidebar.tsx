"use client";
import { useRouter, usePathname } from "next/navigation";
import { Home, Users, FileText, Sparkles, BookOpen, Settings } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "My Groups", icon: Users, path: "/groups" },
  { label: "Assignments", icon: FileText, path: "/assignments" },
  { label: "AI Teacher's Toolkit", icon: Sparkles, path: "/toolkit" },
  { label: "My Library", icon: BookOpen, path: "/library" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#E8531E"/>
          <path d="M8 20L14 8L20 20H8Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span>VedaAI</span>
      </div>

      <button className="sidebar-cta" onClick={() => router.push("/assignments/create")}>
        <span>✦</span> Create Assignment
      </button>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path) && item.path !== "/" || (item.path === "/" && pathname === "/");
          return (
            <li key={item.path} className={isActive ? "active" : ""} onClick={() => router.push(item.path)}>
              <Icon size={18} />
              {item.label}
              {item.label === "Assignments" && <span className="badge">10</span>}
            </li>
          );
        })}
      </ul>

      <div className="sidebar-bottom">
        <div className="sidebar-settings">
          <Settings size={18} />
          Settings
        </div>
        <div className="sidebar-school">
          <div className="sidebar-school-avatar">
            <img src="https://api.dicebear.com/7.x/initials/svg?seed=DPS&backgroundColor=f97316" alt="DPS" width="36" height="36" />
          </div>
          <div className="sidebar-school-info">
            <h4>Delhi Public School</h4>
            <p>Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
