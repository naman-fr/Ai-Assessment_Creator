import mongoose, { Schema, Document } from "mongoose";

interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

interface IQuestion {
  number: number;
  text: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  marks: number;
  options?: string[];
}

interface ISection {
  title: string;
  sectionType: string;
  instruction: string;
  questions: IQuestion[];
}

interface IAnswerKey {
  number: number;
  answer: string;
}

interface IResult {
  school: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstruction: string;
  sections: ISection[];
  answerKey: IAnswerKey[];
}

export interface IAssignmentDoc extends Document {
  dueDate: string;
  questionTypes: IQuestionType[];
  additionalInfo?: string;
  fileUrl?: string;
  fileName?: string;
  status: "pending" | "processing" | "completed" | "failed";
  result?: IResult;
  jobId?: string;
}

const assignmentSchema = new Schema<IAssignmentDoc>(
  {
    dueDate: { type: String, required: true },
    questionTypes: [{
      type: { type: String, required: true },
      count: { type: Number, required: true, min: 1 },
      marks: { type: Number, required: true, min: 1 },
    }],
    additionalInfo: String,
    fileUrl: String,
    fileName: String,
    status: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
    result: { type: Schema.Types.Mixed },
    jobId: String,
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignmentDoc>("Assignment", assignmentSchema);
