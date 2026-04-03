import { describe, expect, it } from "vitest";

import { createSyncMessage } from "@/lib/sync/channel";

describe("createSyncMessage", () => {
  it("creates a sync packet with surface and timestamp", () => {
    const packet = createSyncMessage("admin", "menu.updated");

    expect(packet.surface).toBe("admin");
    expect(packet.type).toBe("menu.updated");
    expect(typeof packet.timestamp).toBe("number");
  });
});
