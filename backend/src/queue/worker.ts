import { Worker, Job } from "bullmq";
import { redis } from "../config/redis";
import { Assignment } from "../models/Assignment";
import { generateQuestionPaper } from "../services/aiService";
import { Server as SocketServer } from "socket.io";

let io: SocketServer | null = null;
export function setSocketIO(socketIO: SocketServer) { io = socketIO; }

function emitToRoom(assignmentId: string, event: string, data: any) {
  if (io) io.to(assignmentId).emit(event, data);
}

export function startWorkers() {
  // Generation worker
  const generationWorker = new Worker("generation", async (job: Job) => {
    const { assignmentId } = job.data;
    console.log(`🔄 Processing generation job for assignment: ${assignmentId}`);

    try {
      // Update status to processing
      await Assignment.findByIdAndUpdate(assignmentId, { status: "processing" });
      emitToRoom(assignmentId, "job:progress", { assignmentId, progress: 20, message: "Starting AI generation..." });

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error("Assignment not found");

      emitToRoom(assignmentId, "job:progress", { assignmentId, progress: 50, message: "Generating questions..." });

      // Generate the paper
      const result = await generateQuestionPaper(
        assignment.questionTypes,
        assignment.additionalInfo,
        undefined // extractedText from file would go here
      );

      emitToRoom(assignmentId, "job:progress", { assignmentId, progress: 90, message: "Finalizing..." });

      // Save result
      await Assignment.findByIdAndUpdate(assignmentId, { status: "completed", result });
      emitToRoom(assignmentId, "job:completed", { assignmentId });

      console.log(`✅ Generation completed for: ${assignmentId}`);
      return { success: true };
    } catch (error: any) {
      console.error(`❌ Generation failed for ${assignmentId}:`, error.message);
      await Assignment.findByIdAndUpdate(assignmentId, { status: "failed" });
      emitToRoom(assignmentId, "job:failed", { assignmentId, error: error.message });
      throw error;
    }
  }, { connection: redis, concurrency: 2 });

  generationWorker.on("failed", (job, err) => {
    console.error(`Worker job ${job?.id} failed:`, err.message);
  });

  console.log("✅ BullMQ workers started");
}
