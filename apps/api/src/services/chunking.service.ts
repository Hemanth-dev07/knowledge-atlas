export type TextChunk = {
  text: string;
  index: number;
};

export function chunkText(input: string, maxCharacters = 900): TextChunk[] {
  const paragraphs = input
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: TextChunk[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;

    if (next.length <= maxCharacters) {
      current = next;
      continue;
    }

    if (current) {
      chunks.push({
        text: current,
        index: chunks.length,
      });
    }

    current = paragraph;
  }

  if (current) {
    chunks.push({
      text: current,
      index: chunks.length,
    });
  }

  return chunks;
}
