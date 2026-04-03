import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CsvImportPanel } from "@/components/admin/csv-import-panel";
import { createDefaultStore } from "@/lib/store/defaults";

describe("CsvImportPanel", () => {
  it("parses CSV rows and imports the extracted menu items", async () => {
    const user = userEvent.setup();
    const store = createDefaultStore();
    const handleImport = vi.fn().mockResolvedValue(undefined);

    render(
      <CsvImportPanel categories={store.categories} onImportItems={handleImport} />
    );

    await user.type(
      screen.getByLabelText("CSV data"),
      "category,name,price,description{enter}coffee,Americano,4500,House coffee"
    );
    await user.click(screen.getByRole("button", { name: /parse csv/i }));
    await screen.findByText("Americano");
    await user.click(screen.getByRole("button", { name: /import csv items/i }));

    expect(handleImport).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: "coffee",
          name: "Americano",
          price: 4500
        })
      ])
    );
  });
});
