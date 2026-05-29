import {
  pipeline,
  type FeatureExtractionPipeline,
} from "@huggingface/transformers";

const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMENSIONS = 384;
export type EmbeddingGenerator = (text: string) => Promise<number[]>;

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getExtractor() {
  extractorPromise ??= pipeline("feature-extraction", EMBEDDING_MODEL);

  return extractorPromise;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  const embedding = Array.from(output.data, Number);

  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Expected embedding with ${EMBEDDING_DIMENSIONS} dimensions, received ${embedding.length}`,
    );
  }

  return embedding;
}
