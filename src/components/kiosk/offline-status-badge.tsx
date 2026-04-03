"use client";

import { getMessages } from "@/lib/i18n";

type OfflineStatusBadgeProps = {
  online: boolean;
  locale?: string;
  largeText?: boolean;
};

export function OfflineStatusBadge({
  online,
  locale = "en",
  largeText = false
}: OfflineStatusBadgeProps) {
  const messages = getMessages(locale);
  const title = online ? messages.onlineTitle : messages.offlineTitle;
  const detail = online ? messages.onlineDetail : messages.offlineDetail;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 text-white">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            {messages.connection}
          </p>
          <h2 className={largeText ? "mt-2 text-3xl font-semibold" : "mt-2 text-2xl font-semibold"}>
            {title}
          </h2>
        </div>
        <span
          className={
            online
              ? "rounded-full border border-emerald-300/30 px-3 py-1 text-sm text-emerald-100"
              : "rounded-full border border-amber-300/30 px-3 py-1 text-sm text-amber-100"
          }
        >
          {online ? messages.networkReady : messages.offline}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{detail}</p>
    </section>
  );
}
