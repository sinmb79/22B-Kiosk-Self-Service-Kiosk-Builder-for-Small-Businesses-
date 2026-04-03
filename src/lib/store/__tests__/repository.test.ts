import "fake-indexeddb/auto";

import { afterEach, describe, expect, it } from "vitest";

import { createDefaultStore } from "@/lib/store/defaults";
import {
  clearStoreState,
  createMenuItems,
  loadStoreState,
  saveAccessibilitySettings,
  saveCustomizations,
  saveLanguages,
  saveStoreState
} from "@/lib/store/repository";

describe("store repository", () => {
  afterEach(async () => {
    await clearStoreState();
  });

  it("persists and reloads the kiosk store snapshot", async () => {
    const store = createDefaultStore();
    const updated = {
      ...store,
      business: {
        ...store.business,
        name: "Boss Coffee"
      }
    };

    await saveStoreState(updated);
    const loaded = await loadStoreState();

    expect(loaded.business.name).toBe("Boss Coffee");
    expect(loaded.items).toHaveLength(updated.items.length);
  });

  it("adds multiple menu items in a single operation", async () => {
    await loadStoreState();
    await createMenuItems([
      {
        categoryId: "coffee",
        name: "Einspanner",
        price: 5800
      },
      {
        categoryId: "dessert",
        name: "Financier",
        price: 3200
      }
    ]);

    const loaded = await loadStoreState();

    expect(loaded.items.some((item) => item.name === "Einspanner")).toBe(true);
    expect(loaded.items.some((item) => item.name === "Financier")).toBe(true);
  });

  it("persists level 1 customizations for the kiosk surface", async () => {
    await loadStoreState();
    await saveCustomizations({
      level: 1,
      greeting: "See you at the pickup counter.",
      logo: "https://example.com/logo.png",
      colors: {
        primary: "#112233",
        accent: "#ffcc00"
      }
    });

    const loaded = await loadStoreState();

    expect(loaded.customizations.level).toBe(1);
    expect(loaded.customizations.greeting).toBe("See you at the pickup counter.");
    expect(loaded.customizations.logo).toBe("https://example.com/logo.png");
    expect(loaded.customizations.colors?.primary).toBe("#112233");
  });

  it("updates accessibility settings and enabled languages", async () => {
    await loadStoreState();
    await saveAccessibilitySettings({
      largeText: true,
      highContrast: true,
      voiceGuide: true,
      simpleMode: true,
      autoTimeout: 90
    });
    await saveLanguages(["ko", "en"]);

    const loaded = await loadStoreState();

    expect(loaded.settings.accessibility.largeText).toBe(true);
    expect(loaded.settings.accessibility.highContrast).toBe(true);
    expect(loaded.settings.accessibility.voiceGuide).toBe(true);
    expect(loaded.settings.languages).toEqual(["ko", "en"]);
  });
});
