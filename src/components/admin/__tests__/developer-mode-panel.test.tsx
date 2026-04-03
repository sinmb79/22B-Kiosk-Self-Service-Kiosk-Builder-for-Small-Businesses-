import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeveloperModePanel } from "@/components/admin/developer-mode-panel";
import { createDefaultStore } from "@/lib/store/defaults";

describe("DeveloperModePanel", () => {
  it("reveals advanced fields and saves developer overrides", async () => {
    const user = userEvent.setup();
    const store = createDefaultStore();
    const handleSave = vi.fn().mockResolvedValue(undefined);

    render(
      <DeveloperModePanel
        customizations={store.customizations}
        onSaveDeveloperMode={handleSave}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /enable developer mode/i })
    );
    await user.type(
      screen.getByLabelText("Figma URL"),
      "https://figma.com/design/demo"
    );
    await user.click(screen.getByLabelText("CSS override"));
    await user.paste("body { --accent: #ffffff; }");
    await user.click(
      screen.getByRole("button", { name: /save developer mode/i })
    );

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 2,
        figmaUrl: "https://figma.com/design/demo",
        cssOverride: "body { --accent: #ffffff; }"
      })
    );
  });
});
