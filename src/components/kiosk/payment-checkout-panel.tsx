"use client";

import {
  createPendingCheckout,
  resolvePaymentMode,
  type PendingCheckout
} from "@/lib/payment/checkout";
import { getMessages } from "@/lib/i18n";
import type { CartItem, PaymentSettings } from "@/lib/types";
import { formatWon } from "@/lib/utils";

type PaymentCheckoutPanelProps = {
  items: CartItem[];
  payment: PaymentSettings;
  onDemoPayment: (checkout: PendingCheckout) => Promise<void> | void;
  onLivePayment: (checkout: PendingCheckout) => Promise<void> | void;
  locale?: string;
  largeText?: boolean;
  simpleMode?: boolean;
};

export function PaymentCheckoutPanel({
  items,
  payment,
  onDemoPayment,
  onLivePayment,
  locale = "en",
  largeText = false,
  simpleMode = false
}: PaymentCheckoutPanelProps) {
  const messages = getMessages(locale);
  const mode = resolvePaymentMode(payment);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    const checkout = createPendingCheckout({ items, payment });

    if (mode === "live-toss") {
      await onLivePayment(checkout);
      return;
    }

    await onDemoPayment(checkout);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            {mode === "live-toss" ? messages.paymentLive : messages.paymentDemo}
          </p>
          <h2 className={largeText ? "mt-2 text-3xl font-semibold" : "mt-2 text-2xl font-semibold"}>
            {mode === "live-toss"
              ? messages.openTossPayment
              : messages.completeDemoPayment}
          </h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-100">
          {formatWon(total)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">
        {mode === "live-toss"
          ? messages.paymentLiveDescription
          : messages.paymentDemoDescription}
      </p>

      <button
        type="button"
        onClick={() => void handleCheckout()}
        disabled={items.length === 0}
        className={`mt-5 w-full rounded-2xl border border-cyan-300/40 bg-cyan-400 px-4 ${
          simpleMode ? "py-4" : "py-3"
        } font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-slate-800 disabled:text-slate-400`}
      >
        {mode === "live-toss"
          ? messages.openTossPayment
          : messages.completeDemoPayment}
      </button>
    </section>
  );
}
