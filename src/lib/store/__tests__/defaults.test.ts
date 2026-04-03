import { describe, expect, it } from "vitest";

import { createDefaultStore } from "@/lib/store/defaults";

describe("createDefaultStore", () => {
  it("creates the expected starter business, template, and language settings", () => {
    const store = createDefaultStore();

    expect(store.business.name).toBe("22B Demo Store");
    expect(store.templateId).toBe("cafe-modern");
    expect(store.settings.languages).toEqual(["ko", "en", "zh", "ja"]);
    expect(store.categories.length).toBeGreaterThan(0);
    expect(store.items.length).toBeGreaterThan(0);
  });
});
