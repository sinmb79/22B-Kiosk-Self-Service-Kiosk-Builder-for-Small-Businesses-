import { describe, expect, it } from "vitest";

import {
  getLocalizedCategoryName,
  getLocalizedItemName,
  getMessages
} from "@/lib/i18n";

describe("i18n helpers", () => {
  it("returns translated labels for supported locales", () => {
    expect(getMessages("en").cart).toBe("Cart");
    expect(getLocalizedCategoryName({ id: "coffee", name: "커피" }, "zh")).toBe(
      "咖啡"
    );
  });

  it("falls back to the base menu name when locale fields are missing", () => {
    expect(
      getLocalizedItemName(
        {
          id: "salt-bread",
          categoryId: "dessert",
          name: "소금빵",
          nameEn: "Salt Bread",
          price: 3800,
          soldOut: false,
          sortOrder: 1
        },
        "en"
      )
    ).toBe("Salt Bread");

    expect(
      getLocalizedItemName(
        {
          id: "latte",
          categoryId: "coffee",
          name: "카페라떼",
          price: 5200,
          soldOut: false,
          sortOrder: 2
        },
        "ja"
      )
    ).toBe("카페라떼");
  });
});
