"use client";

import { getMessages } from "@/lib/i18n";
import type { CartItem } from "@/lib/types";
import { formatWon } from "@/lib/utils";

type CartPanelProps = {
  items: CartItem[];
  onSubmit: () => Promise<void>;
  submitLabel?: string;
  locale?: string;
  largeText?: boolean;
  simpleMode?: boolean;
};

export function CartPanel({
  items,
  onSubmit,
  submitLabel,
  locale = "en",
  largeText = false,
  simpleMode = false
}: CartPanelProps) {
  const messages = getMessages(locale);
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const nextSubmitLabel = submitLabel ?? messages.placeOrder;

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 text-white">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
          {messages.cart}
        </p>
        <h2 className={largeText ? "text-3xl font-semibold" : "text-2xl font-semibold"}>
          {messages.reviewOrder}
        </h2>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-300">
            {messages.noItemsYet}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 ${
                simpleMode ? "py-4" : "py-3"
              }`}
            >
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-slate-300">
                  {item.quantity} x {formatWon(item.price)}
                </p>
              </div>
              <span className="font-semibold text-cyan-200">
                {item.quantity} {messages.quantityUnit}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{messages.total}</span>
          <span className={largeText ? "text-3xl font-semibold text-white" : "text-2xl font-semibold text-white"}>
            {formatWon(total)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void onSubmit()}
        disabled={items.length === 0}
        className="mt-5 w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {nextSubmitLabel}
      </button>
    </aside>
  );
}
