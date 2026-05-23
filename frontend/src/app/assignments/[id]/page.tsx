"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import { api } from "@/lib/api";
import { Download, RefreshCw, ArrowLeft } from "lucide-react";
import type { GeneratedPaper } from "@/types";

export default function AssignmentViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { current, loading, fetchAssignment } = useAssignmentStore();
  const [regenerating, setRegenerating] = useState(false);
  useWebSocket(id);

  useEffect(() => { if (id) fetchAssignment(id); }, [id, fetchAssignment]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try { await api.regenerate(id); } catch (e) { console.error(e); }
    setRegenerating(false);
  };

  if (loading || !current) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="status-msg">
          {current?.status === "processing" ? "Generating your question paper..." : "Loading assignment..."}
        </p>
        {current?.status === "processing" && (
          <div className="progress-status"><div className="progress-status-fill" style={{ width: "60%" }} /></div>
        )}
      </div>
    );
  }

  if (current.status === "processing") {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="status-msg">AI is generating your question paper...</p>
        <div className="progress-status"><div className="progress-status-fill" style={{ width: "60%" }} /></div>
      </div>
    );
  }

  if (current.status === "failed") {
    return (
      <div className="loading-container">
        <p className="status-msg" style={{ color: "var(--badge-red)" }}>Generation failed. Please try again.</p>
        <button className="btn-primary" onClick={handleRegenerate}><RefreshCw size={14} /> Regenerate</button>
      </div>
    );
  }

  const paper: GeneratedPaper | undefined = current.result;
  if (!paper) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="status-msg">Waiting for results...</p>
      </div>
    );
  }

  return (
    <div>
      {/* AI Message Bar */}
      <div className="ai-bar">
        <p>
          Certainly, Lakshya! Here are customized Question Paper for your {paper.className} {paper.subject} classes on the NCERT chapters:
        </p>
        <a href={api.getPdfUrl(id)} target="_blank" rel="noopener noreferrer" className="ai-bar-btn">
          <Download size={14} /> Download as PDF
        </a>
      </div>

      {/* Question Paper */}
      <div className="paper" id="question-paper">
        <div className="paper-header">
          <h1>{paper.school}</h1>
          <p>Subject: {paper.subject}</p>
          <p>Class: {paper.className}</p>
        </div>

        <div className="paper-meta">
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.maxMarks}</span>
        </div>

        <p className="paper-instruction">{paper.generalInstruction}</p>

        <div className="paper-student">
          <p>Name: <span className="line" /></p>
          <p>Roll Number: <span className="line" /></p>
          <p>Class: {paper.className} Section: <span className="line" /></p>
        </div>

        {paper.sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h3 className="section-title">{section.title}</h3>
            <div className="section-type">{section.sectionType}</div>
            <p className="section-instr">{section.instruction}</p>
            {section.questions.map((q) => (
              <div key={q.number} className="question-item">
                <span className="q-num">{q.number}. </span>
                <span className={`diff-badge diff-${q.difficulty.toLowerCase()}`}>
                  {q.difficulty}
                </span>
                {q.text}
                <span className="q-marks"> [{q.marks} Marks]</span>
                {q.options && q.options.length > 0 && (
                  <div style={{ marginLeft: 20, marginTop: 4 }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ fontSize: 13 }}>({String.fromCharCode(97 + oi)}) {opt}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        <p className="paper-end">End of Question Paper</p>

        {paper.answerKey && paper.answerKey.length > 0 && (
          <div className="answer-key">
            <h2>Answer Key:</h2>
            {paper.answerKey.map((ak) => (
              <div key={ak.number} className="answer-key-item">
                <strong>{ak.number}.</strong> {ak.answer}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="form-nav" style={{ marginTop: 24 }}>
        <button className="btn-outline" onClick={() => router.push("/assignments")}>
          <ArrowLeft size={14} /> Back to Assignments
        </button>
        <button className="btn-primary" onClick={handleRegenerate} disabled={regenerating}>
          <RefreshCw size={14} /> {regenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </div>
  );
}
