import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExperienceSettingsPanel } from "@/components/admin/experience-settings-panel";
import { createDefaultStore } from "@/lib/store/defaults";

describe("ExperienceSettingsPanel", () => {
  it("saves accessibility toggles and enabled languages", async () => {
    const user = userEvent.setup();
    const store = createDefaultStore();
    const handleSaveAccessibility = vi.fn().mockResolvedValue(undefined);
    const handleSaveLanguages = vi.fn().mockResolvedValue(undefined);

    render(
      <ExperienceSettingsPanel
        settings={store.settings}
        onSaveAccessibility={handleSaveAccessibility}
        onSaveLanguages={handleSaveLanguages}
      />
    );

    await user.click(screen.getByLabelText("Large text"));
    await user.click(screen.getByLabelText("High contrast"));
    await user.click(screen.getByLabelText("Chinese"));
    await user.click(screen.getByLabelText("Japanese"));
    await user.click(
      screen.getByRole("button", { name: /save accessibility & languages/i })
    );

    expect(handleSaveAccessibility).toHaveBeenCalledWith(
      expect.objectContaining({
        largeText: true,
        highContrast: true
      })
    );
    expect(handleSaveLanguages).toHaveBeenCalledWith(["ko", "en"]);
  });
});
