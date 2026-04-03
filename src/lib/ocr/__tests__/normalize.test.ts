import { describe, expect, it } from "vitest";

import { createDemoOcrResult, normalizeOcrItems } from "@/lib/ocr/extract-menu";

describe("OCR extraction helpers", () => {
  it("normalizes extracted OCR items into menu drafts", () => {
    const result = normalizeOcrItems(
      [
        { name: "Ice Americano", price: 4500, confidence: 0.93, category: "Coffee" },
        { name: "Salt Bread", price: 3800, confidence: 0.9 }
      ],
      [
        { id: "coffee", name: "커피", emoji: "☕", sortOrder: 1 },
        { id: "dessert", name: "디저트", emoji: "🥐", sortOrder: 2 }
      ]
    );

    expect(result[0]).toEqual(
      expect.objectContaining({
        categoryId: "coffee",
        name: "Ice Americano",
        price: 4500
      })
    );
    expect(result[1].categoryId).toBe("dessert");
  });

  it("returns a demo OCR payload when no provider key is available", () => {
    const result = createDemoOcrResult();

    expect(result.items.length).toBeGreaterThan(1);
    expect(result.items[0].confidence).toBeGreaterThan(0.8);
  });
});
