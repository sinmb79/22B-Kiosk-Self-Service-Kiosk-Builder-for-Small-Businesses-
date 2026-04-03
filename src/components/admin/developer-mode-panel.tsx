"use client";

import { useState } from "react";

import type { Customizations } from "@/lib/types";

type DeveloperModePanelProps = {
  customizations: Customizations;
  onSaveDeveloperMode: (customizations: Customizations) => Promise<void> | void;
};

export function DeveloperModePanel({
  customizations,
  onSaveDeveloperMode
}: DeveloperModePanelProps) {
  const [enabled, setEnabled] = useState(customizations.level === 2);
  const [figmaUrl, setFigmaUrl] = useState(customizations.figmaUrl ?? "");
  const [webhookUrl, setWebhookUrl] = useState(customizations.webhookUrl ?? "");
  const [cssOverride, setCssOverride] = useState(customizations.cssOverride ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);

    try {
      await onSaveDeveloperMode({
        ...customizations,
        level: 2,
        figmaUrl: figmaUrl.trim() || undefined,
        webhookUrl: webhookUrl.trim() || undefined,
        cssOverride: cssOverride.trim() || undefined
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            Developer mode
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Lv.2 advanced controls
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Keep advanced Figma links, CSS overrides, and webhook placeholders
            in the local snapshot without exposing them in the 기본 flow.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled((current) => !current)}
          className="rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100"
        >
          {enabled ? "Hide developer mode" : "Enable developer mode"}
        </button>
      </div>

      {enabled ? (
        <div className="mt-5 space-y-4">
          <label className="block space-y-2 text-sm text-slate-200">
            Figma URL
            <input
              aria-label="Figma URL"
              value={figmaUrl}
              onChange={(event) => setFigmaUrl(event.target.value)}
              placeholder="https://figma.com/design/..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            Webhook URL
            <input
              aria-label="Webhook URL"
              value={webhookUrl}
              onChange={(event) => setWebhookUrl(event.target.value)}
              placeholder="https://example.com/kiosk-hook"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            CSS override
            <textarea
              aria-label="CSS override"
              value={cssOverride}
              onChange={(event) => setCssOverride(event.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-sm text-white outline-none"
            />
          </label>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save developer mode"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
