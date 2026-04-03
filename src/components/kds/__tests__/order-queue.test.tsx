import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderQueue } from "@/components/kds/order-queue";

describe("OrderQueue", () => {
  it("shows queued orders and lets the operator change status", async () => {
    const user = userEvent.setup();
    const handleUpdateStatus = vi.fn();

    render(
      <OrderQueue
        orders={[
          {
            id: "ord-1",
            orderNumber: 12,
            items: [{ id: "line-1", menuItemId: "americano", name: "아메리카노", quantity: 2, price: 4500 }],
            totalPrice: 9000,
            status: "pending",
            createdAt: new Date("2026-04-04T07:00:00.000Z").toISOString()
          }
        ]}
        onUpdateStatus={handleUpdateStatus}
      />
    );

    expect(screen.getByText("Order #12")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /ready/i }));

    expect(handleUpdateStatus).toHaveBeenCalledWith("ord-1", "ready");
  });
});
