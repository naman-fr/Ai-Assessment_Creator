import { QuestionTypeConfig } from "../types";

export function buildPrompt(questionTypes: QuestionTypeConfig[], additionalInfo?: string, extractedText?: string): string {
  const totalQuestions = questionTypes.reduce((s, q) => s + q.count, 0);
  const totalMarks = questionTypes.reduce((s, q) => s + q.count * q.marks, 0);

  const sections = questionTypes.map((qt, idx) => {
    const sectionLetter = String.fromCharCode(65 + idx);
    return `Section ${sectionLetter}: ${qt.type} — ${qt.count} questions, each carrying ${qt.marks} marks`;
  }).join("\n");

  let prompt = `You are an expert academic question paper generator. Generate a well-structured question paper with the following specifications:

Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}

Sections:
${sections}

${additionalInfo ? `Additional Instructions: ${additionalInfo}` : ""}
${extractedText ? `\nReference Material:\n${extractedText.substring(0, 3000)}` : ""}

IMPORTANT: Respond ONLY with valid JSON matching this exact schema:
{
  "school": "Delhi Public School, Sector-4, Bokaro",
  "subject": "Science",
  "className": "8th",
  "timeAllowed": "45 minutes",
  "maxMarks": ${totalMarks},
  "generalInstruction": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "title": "Section A",
      "sectionType": "Short Answer Questions",
      "instruction": "Attempt all questions. Each question carries 2 marks",
      "questions": [
        {
          "number": 1,
          "text": "Question text here",
          "difficulty": "Easy",
          "marks": 2
        }
      ]
    }
  ],
  "answerKey": [
    {
      "number": 1,
      "answer": "Answer text here"
    }
  ]
}

Rules:
- difficulty must be one of: "Easy", "Moderate", "Challenging"
- Mix difficulty levels across questions (roughly 30% Easy, 40% Moderate, 30% Challenging)
- Generate exactly the number of questions specified per section
- Questions should be academically rigorous and well-formed
- Answer key must cover all questions
- For MCQ type, add "options" array with 4 choices
- DO NOT include any text outside the JSON`;

  return prompt;
}
