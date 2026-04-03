import type { CartItem, PaymentSettings } from "@/lib/types";

export type PaymentMode = "live-toss" | "demo";

export type PendingCheckout = {
  orderId: string;
  customerKey: string;
  amount: number;
  provider: PaymentSettings["provider"];
  items: CartItem[];
  createdAt: string;
};

export type PaymentSuccessQuery = {
  paymentKey: string;
  orderId: string;
  amount: string;
};

export function resolvePaymentMode(payment: PaymentSettings): PaymentMode {
  if (payment.provider === "toss" && payment.clientKey.trim()) {
    return "live-toss";
  }

  return "demo";
}

export function createPendingCheckout(input: {
  items: CartItem[];
  payment: PaymentSettings;
}): PendingCheckout {
  return {
    orderId: `order_${crypto.randomUUID()}`,
    customerKey: `customer_${crypto.randomUUID()}`,
    amount: input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    provider: input.payment.provider,
    items: input.items,
    createdAt: new Date().toISOString()
  };
}

export function finalizeSuccessfulPayment(
  checkout: PendingCheckout,
  query: PaymentSuccessQuery
) {
  const amount = Number(query.amount);

  if (query.orderId !== checkout.orderId) {
    throw new Error("Payment order id mismatch.");
  }

  if (amount !== checkout.amount) {
    throw new Error("Payment amount mismatch.");
  }

  return {
    orderId: checkout.orderId,
    paymentId: query.paymentKey,
    status: "paid" as const,
    amount
  };
}

export function buildOrderName(items: CartItem[]) {
  const [first, ...rest] = items;

  if (!first) {
    return "22B Kiosk Order";
  }

  if (rest.length === 0) {
    return first.name;
  }

  return `${first.name} 외 ${rest.length}건`;
}
