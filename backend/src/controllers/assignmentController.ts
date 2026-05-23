import { Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { generationQueue } from "../queue/generationQueue";
import { generatePaperHTML } from "../services/pdfService";
import { redis } from "../config/redis";

export const assignmentController = {
  // GET /api/assignments
  async getAll(_req: Request, res: Response) {
    try {
      const cached = await redis.get("assignments:all");
      if (cached) {
        return res.json({ success: true, data: JSON.parse(cached) });
      }
      const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
      await redis.set("assignments:all", JSON.stringify(assignments), "EX", 30);
      res.json({ success: true, data: assignments });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  // GET /api/assignments/:id
  async getById(req: Request, res: Response) {
    try {
      const cached = await redis.get(`assignment:${req.params.id}`);
      if (cached) {
        return res.json({ success: true, data: JSON.parse(cached) });
      }
      const assignment = await Assignment.findById(req.params.id).lean();
      if (!assignment) return res.status(404).json({ success: false, message: "Not found" });
      if (assignment.status === "completed") {
        await redis.set(`assignment:${req.params.id}`, JSON.stringify(assignment), "EX", 120);
      }
      res.json({ success: true, data: assignment });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  // POST /api/assignments
  async create(req: Request, res: Response) {
    try {
      const { dueDate, questionTypes, additionalInfo } = req.body;
      const parsedQT = typeof questionTypes === "string" ? JSON.parse(questionTypes) : questionTypes;

      const assignment = await Assignment.create({
        dueDate,
        questionTypes: parsedQT,
        additionalInfo,
        fileName: req.file?.originalname,
        fileUrl: req.file?.path,
        status: "pending",
      });

      // Add to generation queue
      const job = await generationQueue.add("generate", { assignmentId: assignment._id.toString() });
      await Assignment.findByIdAndUpdate(assignment._id, { jobId: job.id, status: "processing" });

      // Invalidate cache
      await redis.del("assignments:all");

      res.status(201).json({ success: true, data: assignment });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  // DELETE /api/assignments/:id
  async remove(req: Request, res: Response) {
    try {
      await Assignment.findByIdAndDelete(req.params.id);
      await redis.del("assignments:all");
      await redis.del(`assignment:${req.params.id}`);
      res.json({ success: true, message: "Deleted" });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  // POST /api/assignments/:id/regenerate
  async regenerate(req: Request, res: Response) {
    try {
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) return res.status(404).json({ success: false, message: "Not found" });

      await Assignment.findByIdAndUpdate(req.params.id, { status: "processing", result: null });
      const job = await generationQueue.add("generate", { assignmentId: req.params.id });
      await Assignment.findByIdAndUpdate(req.params.id, { jobId: job.id });

      await redis.del(`assignment:${req.params.id}`);
      await redis.del("assignments:all");

      res.json({ success: true, message: "Regeneration started" });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  // GET /api/assignments/:id/pdf
  async getPdf(req: Request, res: Response) {
    try {
      const assignment = await Assignment.findById(req.params.id).lean();
      if (!assignment || !assignment.result) {
        return res.status(404).json({ success: false, message: "Paper not ready" });
      }

      const html = generatePaperHTML(assignment.result as any);

      // Try puppeteer, fallback to HTML download
      try {
        const puppeteer = require("puppeteer");
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdf = await page.pdf({ format: "A4", margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=question-paper.pdf");
        res.send(pdf);
      } catch {
        // Fallback: send HTML
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Disposition", "attachment; filename=question-paper.html");
        res.send(html);
      }
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
};
