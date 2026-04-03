import React from "react";
import { render, screen } from "@testing-library/react";

import { TemplateRenderer } from "@/components/kiosk/template-renderer";
import { createDefaultStore } from "@/lib/store/defaults";

describe("TemplateRenderer", () => {
  it("renders greeting, categories, and item actions for the selected template", () => {
    const store = createDefaultStore();

    render(
      <TemplateRenderer
        templateId={store.templateId}
        business={store.business}
        categories={store.categories}
        items={store.items}
        activeCategoryId={store.categories[0].id}
        onSelectCategory={vi.fn()}
        onAddItem={vi.fn()}
      />
    );

    expect(screen.getByText(store.business.greeting)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "커피" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add 아메리카노/i })
    ).toBeInTheDocument();
  });
});
