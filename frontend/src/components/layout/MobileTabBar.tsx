"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, BookOpen, Sparkles } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Assignments", icon: FileText, path: "/assignments" },
  { label: "Library", icon: BookOpen, path: "/library" },
  { label: "AI Toolkit", icon: Sparkles, path: "/toolkit" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="mobile-tab">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname.startsWith(tab.path) && tab.path !== "/" || (tab.path === "/" && pathname === "/");
        return (
          <div key={tab.path} className={`mobile-tab-item ${isActive ? "active" : ""}`} onClick={() => router.push(tab.path)}>
            <Icon size={20} />
            {tab.label}
          </div>
        );
      })}
    </nav>
  );
}
