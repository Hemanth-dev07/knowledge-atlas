import type { RetrievedChunk } from "@knowledge-atlas/shared";

export type GenerateAnswerInput = {
  question: string;
  evidence: RetrievedChunk[];
};

export type AnswerGenerator = (input: GenerateAnswerInput) => Promise<string>;

export function buildGroundedAnswerPrompt(input: GenerateAnswerInput) {
  const context = input.evidence
    .map(
      (chunk, index) =>
        `[${index + 1}] Document: ${chunk.documentTitle}\nChunk: ${chunk.text}`,
    )
    .join("\n\n");

  return `You are Knowledge Atlas, a careful AI research assistant.
    
    Answer the user's question using only the provided context. 
    
    Rules:
    - If the context does not contain enough information, say that the saved documents do not contain enough evidence.
    - Do not invent facts.
    - Keep the answer concise and beginner friendly.
    - Mention evidence numbers like [1] when using information from a chunk.
    
    Question:
    ${input.question}
    
    Context:
    ${context}`;
}
