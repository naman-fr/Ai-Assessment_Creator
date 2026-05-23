import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function ToolkitPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <TopBar title="AI Teacher's Toolkit" />
        <div className="app-content">
          <div className="empty-state">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
              <circle cx="100" cy="80" r="60" fill="#F3F4F6"/>
              <rect x="75" y="50" width="50" height="50" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
              <circle cx="100" cy="68" r="8" fill="#F59E0B"/>
              <path d="M92 82H108" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              <path d="M95 88H105" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="65" cy="55" r="4" fill="#FEF3C7"/>
              <circle cx="140" cy="95" r="3" fill="#FEF3C7"/>
            </svg>
            <h2>AI Teacher&apos;s Toolkit</h2>
            <p>AI-powered tools for lesson planning, rubric generation, and student analytics coming soon!</p>
          </div>
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
