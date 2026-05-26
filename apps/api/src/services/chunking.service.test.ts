import { describe, expect, it } from "vitest";
import { chunkText } from "./chunking.service.js";

describe("chunkText", () => {
  it("keeps short text as one chunk", () => {
    const chunks = chunkText("One short paragraph.");

    expect(chunks).toEqual([
      {
        text: "One short paragraph.",
        index: 0,
      },
    ]);
  });

  it("splits text into multiple chunks when the max size is small", () => {
    const chunks = chunkText("First paragraph.\n\nSecond paragraph.", 20);

    expect(chunks).toHaveLength(2);
    expect(chunks[0]?.text).toBe("First paragraph.");
    expect(chunks[0]?.index).toBe(0);
    expect(chunks[1]?.text).toBe("Second paragraph.");
    expect(chunks[1]?.index).toBe(1);
  });

  it("removes empty paragraphs", () => {
    const chunks = chunkText(
      "\n\nFirst paragraph.\n\n\n\nSecond paragraph.\n\n",
    );

    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.text).toBe("First paragraph.\n\nSecond paragraph.");
  });
});
