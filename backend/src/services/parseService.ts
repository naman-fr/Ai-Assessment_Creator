import { GeneratedPaper } from "../types";

export function parseAndValidate(raw: string): GeneratedPaper {
  // Extract JSON from potential markdown code blocks
  let jsonStr = raw.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();

  // Try to find JSON object boundaries
  const startIdx = jsonStr.indexOf("{");
  const endIdx = jsonStr.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1) {
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);
  }

  let paper: GeneratedPaper;
  try {
    paper = JSON.parse(jsonStr);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  // Validate required fields
  if (!paper.school) paper.school = "Delhi Public School, Sector-4, Bokaro";
  if (!paper.subject) paper.subject = "General";
  if (!paper.className) paper.className = "8th";
  if (!paper.timeAllowed) paper.timeAllowed = "45 minutes";
  if (!paper.maxMarks) paper.maxMarks = 0;
  if (!paper.generalInstruction) paper.generalInstruction = "All questions are compulsory unless stated otherwise.";
  if (!Array.isArray(paper.sections)) paper.sections = [];
  if (!Array.isArray(paper.answerKey)) paper.answerKey = [];

  // Validate each section and question
  let globalQNum = 1;
  paper.sections = paper.sections.map((section, idx) => {
    if (!section.title) section.title = `Section ${String.fromCharCode(65 + idx)}`;
    if (!section.sectionType) section.sectionType = "Questions";
    if (!section.instruction) section.instruction = "Attempt all questions";
    if (!Array.isArray(section.questions)) section.questions = [];

    section.questions = section.questions.map((q) => {
      if (!q.number) q.number = globalQNum++;
      if (!q.text) q.text = "Question text unavailable";
      if (!["Easy", "Moderate", "Challenging"].includes(q.difficulty)) q.difficulty = "Moderate";
      if (!q.marks || q.marks < 1) q.marks = 1;
      return q;
    });

    return section;
  });

  // Calculate max marks
  paper.maxMarks = paper.sections.reduce(
    (total, s) => total + s.questions.reduce((st, q) => st + q.marks, 0), 0
  );

  return paper;
}

export function generateFallbackPaper(questionTypes: { type: string; count: number; marks: number }[]): GeneratedPaper {
  let qNum = 1;
  const sections = questionTypes.map((qt, idx) => ({
    title: `Section ${String.fromCharCode(65 + idx)}`,
    sectionType: qt.type,
    instruction: `Attempt all questions. Each question carries ${qt.marks} marks`,
    questions: Array.from({ length: qt.count }, (_, i) => ({
      number: qNum++,
      text: `Sample ${qt.type.toLowerCase()} question ${i + 1}. (AI generation failed — please regenerate)`,
      difficulty: (["Easy", "Moderate", "Challenging"] as const)[i % 3],
      marks: qt.marks,
    })),
  }));

  return {
    school: "Delhi Public School, Sector-4, Bokaro",
    subject: "General",
    className: "8th",
    timeAllowed: "45 minutes",
    maxMarks: questionTypes.reduce((s, q) => s + q.count * q.marks, 0),
    generalInstruction: "All questions are compulsory unless stated otherwise.",
    sections,
    answerKey: [],
  };
}
