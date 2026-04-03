import { describe, expect, it } from "vitest";

import {
  createPendingCheckout,
  finalizeSuccessfulPayment,
  resolvePaymentMode
} from "@/lib/payment/checkout";

describe("payment checkout helpers", () => {
  it("creates a pending checkout with summed amount and generated ids", () => {
    const checkout = createPendingCheckout({
      items: [
        { id: "1", menuItemId: "americano", name: "Americano", quantity: 2, price: 4500 }
      ],
      payment: {
        provider: "toss",
        merchantKey: "",
        clientKey: ""
      }
    });

    expect(checkout.amount).toBe(9000);
    expect(checkout.orderId).toMatch(/^order_/);
    expect(checkout.customerKey).toMatch(/^customer_/);
  });

  it("falls back to demo mode when toss client key is missing", () => {
    expect(
      resolvePaymentMode({
        provider: "toss",
        merchantKey: "",
        clientKey: ""
      })
    ).toBe("demo");
  });

  it("finalizes a successful payment only when the amount matches", () => {
    const checkout = createPendingCheckout({
      items: [
        { id: "1", menuItemId: "americano", name: "Americano", quantity: 2, price: 4500 }
      ],
      payment: {
        provider: "toss",
        merchantKey: "",
        clientKey: ""
      }
    });

    const result = finalizeSuccessfulPayment(checkout, {
      paymentKey: "pay_123",
      orderId: checkout.orderId,
      amount: String(checkout.amount)
    });

    expect(result.paymentId).toBe("pay_123");
    expect(result.status).toBe("paid");
  });
});
