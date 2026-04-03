import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CartPanel } from "@/components/kiosk/cart-panel";

describe("CartPanel", () => {
  it("shows the cart total and submit action", async () => {
    const user = userEvent.setup();

    render(
      <CartPanel
        items={[
          { id: "1", menuItemId: "americano", name: "Americano", quantity: 2, price: 4500 }
        ]}
        onSubmit={async () => {}}
      />
    );

    expect(screen.getByText("9,000원")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /place order/i }));
  });
});
