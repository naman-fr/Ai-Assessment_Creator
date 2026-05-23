// ============================================
// VedaAI Assessment Creator - Shared Types
// ============================================

export interface QuestionTypeConfig {
  type: string;
  count: number;
  marks: number;
}

export interface AssignmentInput {
  title?: string;
  fileUrl?: string;
  fileName?: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInfo?: string;
  school?: string;
  subject?: string;
  className?: string;
}

export interface Question {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  options?: string[]; // for MCQs
}

export interface PaperSection {
  title: string;
  sectionType: string;
  instruction: string;
  questions: Question[];
}

export interface AnswerKeyItem {
  number: number;
  answer: string;
}

export interface GeneratedPaper {
  school: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstruction: string;
  sections: PaperSection[];
  answerKey: AnswerKeyItem[];
}

export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IAssignment {
  _id: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInfo?: string;
  fileUrl?: string;
  fileName?: string;
  status: AssignmentStatus;
  result?: GeneratedPaper;
  jobId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WSJobProgress {
  assignmentId: string;
  progress: number;
  message: string;
}

export interface WSJobCompleted {
  assignmentId: string;
  result: GeneratedPaper;
}

export interface WSJobFailed {
  assignmentId: string;
  error: string;
}
