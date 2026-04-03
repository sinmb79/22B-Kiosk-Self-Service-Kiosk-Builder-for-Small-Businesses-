import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PaymentCheckoutPanel } from "@/components/kiosk/payment-checkout-panel";

describe("PaymentCheckoutPanel", () => {
  it("uses demo checkout when Toss keys are missing", async () => {
    const user = userEvent.setup();
    const handleDemoPayment = vi.fn();

    render(
      <PaymentCheckoutPanel
        items={[
          { id: "1", menuItemId: "americano", name: "Americano", quantity: 2, price: 4500 }
        ]}
        payment={{
          provider: "toss",
          merchantKey: "",
          clientKey: ""
        }}
        onDemoPayment={handleDemoPayment}
        onLivePayment={vi.fn()}
      />
    );

    expect(screen.getByText("Demo checkout")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /complete demo payment/i }));

    expect(handleDemoPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 9000
      })
    );
  });
});
