import { afterEach, describe, expect, it } from "vitest";

import {
  clearPendingCheckout,
  readPendingCheckout,
  savePendingCheckout
} from "@/lib/payment/pending-storage";

describe("pending payment storage", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("saves and restores a pending checkout by order id", () => {
    const checkout = {
      orderId: "order_123",
      customerKey: "customer_123",
      amount: 9000,
      provider: "toss" as const,
      items: [
        { id: "1", menuItemId: "americano", name: "Americano", quantity: 2, price: 4500 }
      ],
      createdAt: new Date("2026-04-04T00:00:00.000Z").toISOString()
    };

    savePendingCheckout(checkout);

    expect(readPendingCheckout("order_123")).toEqual(checkout);

    clearPendingCheckout("order_123");
    expect(readPendingCheckout("order_123")).toBeNull();
  });
});
