import { create } from "zustand";
import type { QuestionTypeConfig } from "@/types";

interface FormState {
  file: File | null;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInfo: string;
  errors: Record<string, string>;
  setFile: (f: File | null) => void;
  setDueDate: (d: string) => void;
  addQuestionType: () => void;
  removeQuestionType: (idx: number) => void;
  updateQuestionType: (idx: number, field: keyof QuestionTypeConfig, value: string | number) => void;
  setAdditionalInfo: (s: string) => void;
  validate: () => boolean;
  reset: () => void;
  totalQuestions: () => number;
  totalMarks: () => number;
}

const defaultQT: QuestionTypeConfig[] = [
  { type: "Multiple Choice Questions", count: 4, marks: 1 },
  { type: "Short Questions", count: 3, marks: 2 },
];

const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Answer Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "True/False",
  "Fill in the Blanks",
  "Match the Following",
];

export { QUESTION_TYPE_OPTIONS };

export const useFormStore = create<FormState>((set, get) => ({
  file: null,
  dueDate: "",
  questionTypes: [...defaultQT],
  additionalInfo: "",
  errors: {},

  setFile: (f) => set({ file: f, errors: { ...get().errors, file: "" } }),
  setDueDate: (d) => set({ dueDate: d, errors: { ...get().errors, dueDate: "" } }),
  setAdditionalInfo: (s) => set({ additionalInfo: s }),

  addQuestionType: () => {
    const used = get().questionTypes.map((q) => q.type);
    const next = QUESTION_TYPE_OPTIONS.find((o) => !used.includes(o));
    if (next) {
      set({ questionTypes: [...get().questionTypes, { type: next, count: 1, marks: 1 }] });
    }
  },

  removeQuestionType: (idx) => {
    const qt = [...get().questionTypes];
    qt.splice(idx, 1);
    set({ questionTypes: qt });
  },

  updateQuestionType: (idx, field, value) => {
    const qt = [...get().questionTypes];
    (qt[idx] as any)[field] = value;
    if (field === "count" && (qt[idx].count < 1)) qt[idx].count = 1;
    if (field === "marks" && (qt[idx].marks < 1)) qt[idx].marks = 1;
    set({ questionTypes: qt });
  },

  validate: () => {
    const { dueDate, questionTypes } = get();
    const errors: Record<string, string> = {};
    if (!dueDate) errors.dueDate = "Due date is required";
    if (questionTypes.length === 0) errors.questionTypes = "Add at least one question type";
    questionTypes.forEach((qt, i) => {
      if (qt.count < 1) errors[`qt_${i}_count`] = "Min 1";
      if (qt.marks < 1) errors[`qt_${i}_marks`] = "Min 1";
    });
    set({ errors });
    return Object.keys(errors).length === 0;
  },

  reset: () => set({ file: null, dueDate: "", questionTypes: [...defaultQT], additionalInfo: "", errors: {} }),

  totalQuestions: () => get().questionTypes.reduce((s, q) => s + q.count, 0),
  totalMarks: () => get().questionTypes.reduce((s, q) => s + q.count * q.marks, 0),
}));
