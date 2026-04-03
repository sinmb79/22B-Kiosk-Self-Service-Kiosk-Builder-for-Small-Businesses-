import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DesignStudio } from "@/components/admin/design-studio";
import { createDefaultStore } from "@/lib/store/defaults";

describe("DesignStudio", () => {
  it("updates the live preview and saves level 1 customizations", async () => {
    const user = userEvent.setup();
    const store = createDefaultStore();
    const handleSaveCustomizations = vi.fn().mockResolvedValue(undefined);

    render(
      <DesignStudio
        store={store}
        onSaveCustomizations={handleSaveCustomizations}
        onSaveTemplateSelection={vi.fn().mockResolvedValue(undefined)}
      />
    );

    await user.clear(screen.getByLabelText("Greeting override"));
    await user.type(
      screen.getByLabelText("Greeting override"),
      "Fresh coffee is ready."
    );

    expect(
      within(screen.getByLabelText("Design preview")).getByText(
        "Fresh coffee is ready."
      )
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Primary color"));
    await user.type(screen.getByLabelText("Primary color"), "#112233");
    await user.click(
      screen.getByRole("button", { name: /save design settings/i })
    );

    expect(handleSaveCustomizations).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 1,
        greeting: "Fresh coffee is ready.",
        colors: expect.objectContaining({
          primary: "#112233"
        })
      })
    );
  });
});
