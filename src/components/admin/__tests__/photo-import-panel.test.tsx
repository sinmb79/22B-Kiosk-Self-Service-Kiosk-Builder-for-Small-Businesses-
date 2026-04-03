import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PhotoImportPanel } from "@/components/admin/photo-import-panel";

describe("PhotoImportPanel", () => {
  it("submits extracted OCR items into the menu editor callback", async () => {
    const user = userEvent.setup();
    const handleImport = vi.fn().mockResolvedValue(undefined);

    render(
      <PhotoImportPanel
        onRunOcr={vi.fn().mockResolvedValue({
          items: [
            { name: "Americano", price: 4500, confidence: 0.92, category: "coffee" }
          ]
        })}
        onImportItems={handleImport}
      />
    );

    await user.type(screen.getByLabelText("Image URL"), "https://example.com/menu.jpg");
    await user.click(screen.getByRole("button", { name: /run photo import/i }));
    await screen.findByText("Americano");
    await user.click(screen.getByRole("button", { name: /import extracted items/i }));

    expect(handleImport).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Americano",
          price: 4500
        })
      ])
    );
  });
});
