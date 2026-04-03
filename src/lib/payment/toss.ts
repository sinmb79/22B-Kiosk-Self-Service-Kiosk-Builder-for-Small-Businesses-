import { buildOrderName, type PendingCheckout } from "@/lib/payment/checkout";

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      payment: (params: { customerKey: string }) => {
        requestPayment: (params: {
          method: "CARD";
          amount: {
            currency: "KRW";
            value: number;
          };
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
        }) => void | Promise<void>;
      };
    };
  }
}

const TOSS_SDK_URL = "https://js.tosspayments.com/v2/standard";

async function loadTossPayments() {
  if (typeof window === "undefined") {
    throw new Error("TossPayments SDK requires a browser environment.");
  }

  if (window.TossPayments) {
    return window.TossPayments;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TOSS_SDK_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load TossPayments SDK.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = TOSS_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load TossPayments SDK."));
    document.head.appendChild(script);
  });

  if (!window.TossPayments) {
    throw new Error("TossPayments SDK did not initialize correctly.");
  }

  return window.TossPayments;
}

export async function requestTossCardPayment(input: {
  clientKey: string;
  checkout: PendingCheckout;
  successUrl: string;
  failUrl: string;
}) {
  const TossPayments = await loadTossPayments();
  const tossPayments = TossPayments(input.clientKey);
  const payment = tossPayments.payment({
    customerKey: input.checkout.customerKey
  });

  return payment.requestPayment({
    method: "CARD",
    amount: {
      currency: "KRW",
      value: input.checkout.amount
    },
    orderId: input.checkout.orderId,
    orderName: buildOrderName(input.checkout.items),
    successUrl: input.successUrl,
    failUrl: input.failUrl
  });
}
