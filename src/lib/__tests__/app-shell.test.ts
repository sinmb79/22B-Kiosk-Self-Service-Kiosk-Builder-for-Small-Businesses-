import { describe, expect, it } from "vitest";

import { getSurfaceLinks } from "@/lib/navigation";

describe("getSurfaceLinks", () => {
  it("returns the three MVP surfaces in a stable order", () => {
    expect(getSurfaceLinks().map((item) => item.href)).toEqual([
      "/admin",
      "/kiosk",
      "/kds"
    ]);
  });
});
