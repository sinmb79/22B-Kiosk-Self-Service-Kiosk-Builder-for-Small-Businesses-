import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuEditor } from "@/components/admin/menu-editor";
import { createDefaultStore } from "@/lib/store/defaults";

describe("MenuEditor", () => {
  it("submits a new item with the selected category", async () => {
    const user = userEvent.setup();
    const store = createDefaultStore();
    const handleCreate = vi.fn();

    render(
      <MenuEditor
        categories={store.categories}
        items={store.items}
        onCreateItem={handleCreate}
        onDeleteItem={vi.fn()}
        onToggleSoldOut={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText("Name"), "허니 브레드");
    await user.type(screen.getByLabelText("Price"), "6800");
    await user.selectOptions(screen.getByLabelText("Category"), "dessert");
    await user.click(screen.getByRole("button", { name: /add item/i }));

    expect(handleCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "허니 브레드",
        price: 6800,
        categoryId: "dessert"
      })
    );
  });
});
