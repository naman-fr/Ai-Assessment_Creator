import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function GroupsPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <TopBar title="My Groups" />
        <div className="app-content">
          <div className="empty-state">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
              <circle cx="100" cy="80" r="60" fill="#F3F4F6"/>
              <circle cx="85" cy="65" r="14" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
              <circle cx="115" cy="65" r="14" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
              <path d="M65 100C65 88 74 80 85 80C96 80 105 88 105 100" fill="#E5E7EB"/>
              <path d="M95 100C95 88 104 80 115 80C126 80 135 88 135 100" fill="#E5E7EB"/>
            </svg>
            <h2>My Groups</h2>
            <p>Create and manage student groups for targeted assignments and assessments.</p>
          </div>
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
