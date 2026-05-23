import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function AssignmentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <TopBar title="Assignment" />
        <div className="app-content">
          {children}
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
