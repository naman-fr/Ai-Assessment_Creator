import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";
import { buildPrompt } from "../utils/promptBuilder";
import { parseAndValidate, generateFallbackPaper } from "./parseService";
import { QuestionTypeConfig, GeneratedPaper } from "../types";

const MAX_RETRIES = 3;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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

  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🤖 Gemini attempt ${attempt}/${MAX_RETRIES}...`);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const paper = parseAndValidate(text);
      console.log(`✅ AI generation successful on attempt ${attempt}`);
      return paper;
    } catch (error: any) {
      console.error(`❌ Gemini attempt ${attempt} failed:`, error.message?.substring(0, 200));
      
      // If rate limited, wait and retry
      if (error.message?.includes("429") || error.message?.includes("quota")) {
        const waitTime = attempt * 25000; // 25s, 50s, 75s
        console.log(`⏳ Rate limited — waiting ${waitTime / 1000}s before retry...`);
        await sleep(waitTime);
        continue;
      }
      
      // For other errors, don't retry
      break;
    }
  }

  console.warn("⚠️ All Gemini attempts failed — using fallback paper");
  return generateFallbackPaper(questionTypes);
}
