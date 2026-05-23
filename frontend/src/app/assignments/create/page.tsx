"use client";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, Calendar, Plus, X, Minus, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useFormStore, QUESTION_TYPE_OPTIONS } from "@/store/useFormStore";
import { api } from "@/lib/api";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    file, dueDate, questionTypes, additionalInfo, errors,
    setFile, setDueDate, addQuestionType, removeQuestionType,
    updateQuestionType, setAdditionalInfo, validate, totalQuestions, totalMarks,
  } = useFormStore();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, [setFile]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      fd.append("dueDate", dueDate);
      fd.append("questionTypes", JSON.stringify(questionTypes));
      fd.append("additionalInfo", additionalInfo);
      const res = await api.createAssignment(fd);
      router.push(`/assignments/${res.data._id}`);
    } catch (e: any) {
      alert(e.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="create-header">
        <h1><span className="dot" /> Create Assignment</h1>
        <p>Set up a new assignment for your students</p>
      </div>
      <div className="progress-bar"><div className="progress-bar-fill" style={{ width: "50%" }} /></div>

      <div className="form-card">
        <h2>Assignment Details</h2>
        <p className="subtitle">Basic information about your assignment</p>

        {/* File Upload */}
        <div
          className={`file-upload ${dragOver ? "dragover" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="file-upload-icon"><Upload size={32} /></div>
          <p>Choose a file or drag & drop it here</p>
          <span className="formats">JPEG, PNG, PDF, upto 10MB</span>
          <button className="file-upload-browse" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>Browse Files</button>
          <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
        </div>
        {file && (
          <div className="file-upload-preview">
            <span>{file.name}</span>
            <button onClick={() => setFile(null)}><X size={16} /></button>
          </div>
        )}
        <p className="file-upload-hint">Upload images of your preferred document/image</p>

        {/* Due Date */}
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <div className="input-with-icon">
            <input className="form-input" type="date" placeholder="DD-MM-YYYY" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Calendar size={18} />
          </div>
          {errors.dueDate && <span style={{ color: "var(--badge-red)", fontSize: 12 }}>{errors.dueDate}</span>}
        </div>

        {/* Question Types */}
        <div className="form-group">
          <label className="form-label">Question Type</label>
          <div>
            {questionTypes.map((qt, idx) => (
              <div key={idx} className="qt-row">
                <select className="qt-select" value={qt.type} onChange={(e) => updateQuestionType(idx, "type", e.target.value)}>
                  {QUESTION_TYPE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <button className="qt-remove" onClick={() => removeQuestionType(idx)}><X size={16} /></button>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 80 }}>No. of Questions</span>
                  <div className="counter">
                    <button onClick={() => updateQuestionType(idx, "count", qt.count - 1)}><Minus size={14} /></button>
                    <span>{qt.count}</span>
                    <button onClick={() => updateQuestionType(idx, "count", qt.count + 1)}><Plus size={14} /></button>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 40 }}>Marks</span>
                  <div className="counter">
                    <button onClick={() => updateQuestionType(idx, "marks", qt.marks - 1)}><Minus size={14} /></button>
                    <span>{qt.marks}</span>
                    <button onClick={() => updateQuestionType(idx, "marks", qt.marks + 1)}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.questionTypes && <span style={{ color: "var(--badge-red)", fontSize: 12 }}>{errors.questionTypes}</span>}
          <button className="add-qt-btn" onClick={addQuestionType}>
            <Plus size={16} style={{ color: "var(--primary)" }} /> Add Question Type
          </button>
          <div className="qt-totals">
            Total Questions : <strong>{totalQuestions()}</strong><br />
            Total Marks : <strong>{totalMarks()}</strong>
          </div>
        </div>

        {/* Additional Info */}
        <div className="form-group">
          <label className="form-label">Additional Information (For better output)</label>
          <div style={{ position: "relative" }}>
            <textarea className="form-textarea" placeholder="e.g Generate a question paper for 3 hour exam duration.." value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
            <Sparkles size={16} style={{ position: "absolute", bottom: 12, right: 12, color: "var(--text-muted)" }} />
          </div>
        </div>
      </div>

      <div className="form-nav">
        <button className="btn-outline" onClick={() => router.back()}>
          <ArrowLeft size={14} /> Previous
        </button>
        <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Creating..." : "Next"} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
