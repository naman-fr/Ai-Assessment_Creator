"use client";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { useRouter } from "next/navigation";
import { Plus, FileText, Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <TopBar title="Dashboard" />
        <div className="app-content">
          <div style={{ padding: "32px 0" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome back! 👋</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Here&apos;s what you can do with VedaAI</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              <div className="assignment-card" onClick={() => router.push("/assignments/create")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={20} color="white" />
                  </div>
                  <h3 style={{ margin: 0 }}>Create Assignment</h3>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Generate AI-powered question papers with structured sections and answer keys</p>
              </div>

              <div className="assignment-card" onClick={() => router.push("/assignments")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={20} color="white" />
                  </div>
                  <h3 style={{ margin: 0 }}>My Assignments</h3>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>View, manage and download your generated question papers</p>
              </div>

              <div className="assignment-card" onClick={() => router.push("/toolkit")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={20} color="white" />
                  </div>
                  <h3 style={{ margin: 0 }}>AI Toolkit</h3>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>AI-powered teaching tools — coming soon!</p>
              </div>

              <div className="assignment-card" onClick={() => router.push("/library")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BookOpen size={20} color="white" />
                  </div>
                  <h3 style={{ margin: 0 }}>My Library</h3>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Saved templates and past question papers</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
