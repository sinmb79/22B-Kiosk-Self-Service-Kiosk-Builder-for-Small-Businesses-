import { describe, expect, it } from "vitest";

import { describeOfflineCapabilities } from "@/lib/offline/status";

describe("describeOfflineCapabilities", () => {
  it("explains that payment requires network while browsing stays available", () => {
    expect(describeOfflineCapabilities(false)).toEqual({
      title: "Offline mode",
      detail: "Menu browsing stays available, but card payment needs a network connection."
    });
  });
});
