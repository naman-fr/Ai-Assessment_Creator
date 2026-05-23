import { GeneratedPaper } from "../types";

export function generatePaperHTML(paper: GeneratedPaper): string {
  const sectionsHTML = paper.sections.map((s) => {
    const questionsHTML = s.questions.map((q) => {
      const diffClass = q.difficulty === "Easy" ? "#d1fae5;color:#065f46" :
        q.difficulty === "Moderate" ? "#fef3c7;color:#92400e" : "#fee2e2;color:#991b1b";
      return `<p style="margin:6px 0;font-size:13px;line-height:1.6">
        <strong>${q.number}.</strong>
        <span style="display:inline-block;font-size:11px;font-weight:600;padding:1px 8px;border-radius:4px;background:${diffClass}">${q.difficulty}</span>
        ${q.text} <span style="color:#6B7280">[${q.marks} Marks]</span>
      </p>`;
    }).join("");

    return `<h3 style="text-align:center;margin:24px 0 8px;font-size:16px">${s.title}</h3>
      <p style="font-weight:600;font-size:14px">${s.sectionType}</p>
      <p style="font-size:13px;color:#6B7280;font-style:italic;margin-bottom:12px">${s.instruction}</p>
      ${questionsHTML}`;
  }).join("");

  const answerHTML = paper.answerKey.map((a) =>
    `<p style="margin:4px 0;font-size:13px"><strong>${a.number}.</strong> ${a.answer}</p>`
  ).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{font-family:'Times New Roman',serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a1a}</style>
    </head><body>
    <div style="text-align:center;margin-bottom:20px">
      <h1 style="font-size:18px;margin:0">${paper.school}</h1>
      <p style="font-size:14px;color:#6B7280;margin:4px 0">Subject: ${paper.subject}</p>
      <p style="font-size:14px;color:#6B7280;margin:0">Class: ${paper.className}</p>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:12px">
      <span>Time Allowed: ${paper.timeAllowed}</span><span>Maximum Marks: ${paper.maxMarks}</span>
    </div>
    <p style="font-size:13px;font-style:italic;color:#6B7280;margin-bottom:16px">${paper.generalInstruction}</p>
    <div style="margin-bottom:20px;font-size:13px">
      <p>Name: _______________</p><p>Roll Number: _______________</p>
      <p>Class: ${paper.className} Section: ___</p>
    </div>
    ${sectionsHTML}
    <p style="text-align:center;font-weight:600;margin:24px 0">End of Question Paper</p>
    ${paper.answerKey.length > 0 ? `<div style="border-top:2px solid #e5e7eb;padding-top:20px;margin-top:24px">
      <h2 style="font-size:16px;margin-bottom:12px">Answer Key:</h2>${answerHTML}</div>` : ""}
    </body></html>`;
}
