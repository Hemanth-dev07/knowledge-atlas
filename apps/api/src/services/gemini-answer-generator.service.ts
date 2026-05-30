import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import {
  buildGroundedAnswerPrompt,
  type AnswerGenerator,
} from "./answer-generator.service.js";

let client: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!env.answerGenerationApiKey) {
    throw new Error("ANSWER_GENERATION_API_KEY is not configured");
  }

  client ??= new GoogleGenAI({
    apiKey: env.answerGenerationApiKey,
  });

  return client;
}

export const generateGeminiAnswer: AnswerGenerator = async (input) => {
  const prompt = buildGroundedAnswerPrompt(input);
  const gemini = getGeminiClient();

  const response = await gemini.models.generateContent({
    model: env.answerGenerationModel,
    contents: prompt,
    config: {
      temperature: 0.2,
    },
  });

  return (
    response.text ??
    "I could not generate an answer from the retrieved evidence."
  );
};
