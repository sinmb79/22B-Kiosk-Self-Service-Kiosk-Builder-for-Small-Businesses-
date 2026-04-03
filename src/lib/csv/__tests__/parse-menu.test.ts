import { describe, expect, it } from "vitest";

import { parseMenuCsv } from "@/lib/csv/parse-menu";

describe("parseMenuCsv", () => {
  it("maps CSV rows into menu drafts with category ids", () => {
    const result = parseMenuCsv(
      [
        "category,name,price,description,nameEn",
        "coffee,아메리카노,4500,진한 기본 커피,Americano",
        "dessert,소금빵,3800,짭짤한 버터 브레드,Salt Bread"
      ].join("\n"),
      [
        { id: "coffee", name: "커피", emoji: "☕", sortOrder: 1 },
        { id: "dessert", name: "디저트", emoji: "🥐", sortOrder: 2 }
      ]
    );

    expect(result.skipped).toBe(0);
    expect(result.items[0]).toEqual(
      expect.objectContaining({
        categoryId: "coffee",
        name: "아메리카노",
        price: 4500,
        nameEn: "Americano"
      })
    );
    expect(result.items[1].categoryId).toBe("dessert");
  });
});
