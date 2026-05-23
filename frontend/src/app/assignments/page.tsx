"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Search, Filter, MoreVertical, Plus } from "lucide-react";

export default function AssignmentsPage() {
  const router = useRouter();
  const { assignments, loading, fetchAssignments, deleteAssignment } = useAssignmentStore();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  useWebSocket();

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const filtered = assignments.filter((a: any) =>
    (a.fileName || "Assignment").toLowerCase().includes(search.toLowerCase())
  );

  if (loading && assignments.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="status-msg">Loading assignments...</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-img" width="200" height="160" viewBox="0 0 200 160" fill="none">
          <circle cx="100" cy="80" r="60" fill="#F3F4F6"/>
          <rect x="70" y="50" width="60" height="60" rx="8" fill="#E5E7EB"/>
          <circle cx="100" cy="70" r="20" stroke="#9CA3AF" strokeWidth="3" fill="none"/>
          <line x1="115" y1="85" x2="130" y2="100" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="130" cy="55" r="15" fill="#FEE2E2"/>
          <path d="M124 49L136 61M136 49L124 61" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="60" cy="110" r="4" fill="#E5E7EB"/>
          <circle cx="150" cy="40" r="3" fill="#DBEAFE"/>
          <circle cx="45" cy="60" r="2" fill="#E5E7EB"/>
        </svg>
        <h2>No assignments yet</h2>
        <p>Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.</p>
        <button className="empty-state-cta" onClick={() => router.push("/assignments/create")}>
          <Plus size={16} /> Create Your First Assignment
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="assignments-header">
        <h1>Assignments</h1>
        <p>Manage and create assignments for your classes.</p>
      </div>

      <div className="assignments-toolbar">
        <button className="filter-btn"><Filter size={14} /> Filter By</button>
        <div className="search-wrap">
          <Search size={16} />
          <input className="search-input" placeholder="Search Assignment" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
      </div>

      <div className="assignments-grid">
        {filtered.map((a: any) => (
          <div key={a._id} className="assignment-card" onClick={() => router.push(`/assignments/${a._id}`)}>
            <h3>{a.fileName || "Quiz on Electricity"}</h3>
            <div className="assignment-card-meta">
              <span>Assigned on : {new Date(a.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}</span>
              {a.dueDate && <span>Due : {a.dueDate}</span>}
            </div>
            <button className="assignment-card-menu" onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === a._id ? null : a._id); }}>
              <MoreVertical size={18} />
            </button>
            {menuOpen === a._id && (
              <div className="card-dropdown">
                <button onClick={(e) => { e.stopPropagation(); router.push(`/assignments/${a._id}`); setMenuOpen(null); }}>View Assignment</button>
                <button className="delete" onClick={(e) => { e.stopPropagation(); deleteAssignment(a._id); setMenuOpen(null); }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="floating-cta" onClick={() => router.push("/assignments/create")}>
        <Plus size={16} /> Create Assignment
      </button>
    </div>
  );
}
