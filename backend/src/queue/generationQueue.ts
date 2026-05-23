import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const generationQueue = new Queue("generation", { connection: redis });
export const pdfQueue = new Queue("pdf-generation", { connection: redis });
