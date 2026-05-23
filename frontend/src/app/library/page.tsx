import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function LibraryPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <TopBar title="My Library" />
        <div className="app-content">
          <div className="empty-state">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
              <circle cx="100" cy="80" r="60" fill="#F3F4F6"/>
              <rect x="60" y="50" width="40" height="55" rx="4" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
              <rect x="75" y="45" width="40" height="55" rx="4" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="2"/>
              <rect x="90" y="40" width="40" height="55" rx="4" fill="white" stroke="#D1D5DB" strokeWidth="2"/>
              <line x1="97" y1="55" x2="123" y2="55" stroke="#D1D5DB" strokeWidth="2"/>
              <line x1="97" y1="62" x2="118" y2="62" stroke="#E5E7EB" strokeWidth="2"/>
              <line x1="97" y1="69" x2="120" y2="69" stroke="#E5E7EB" strokeWidth="2"/>
            </svg>
            <h2>My Library</h2>
            <p>Your saved question papers and templates will appear here. Create an assignment to get started!</p>
          </div>
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
