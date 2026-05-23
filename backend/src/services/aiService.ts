import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";
import { buildPrompt } from "../utils/promptBuilder";
import { parseAndValidate, generateFallbackPaper } from "./parseService";
import { QuestionTypeConfig, GeneratedPaper } from "../types";

export async function generateQuestionPaper(
  questionTypes: QuestionTypeConfig[],
  additionalInfo?: string,
  extractedText?: string
): Promise<GeneratedPaper> {
  const prompt = buildPrompt(questionTypes, additionalInfo, extractedText);

  // If no API key, return fallback
  if (!config.geminiApiKey) {
    console.warn("⚠️ No Gemini API key — using fallback paper");
    return generateFallbackPaper(questionTypes);
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseAndValidate(text);
  } catch (error: any) {
    console.error("AI generation failed:", error.message);
    // Fallback to template-based paper
    return generateFallbackPaper(questionTypes);
  }
}
