"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TemplateGallery } from "@/components/admin/template-gallery";
import { getTemplates } from "@/lib/templates";
import type { KioskStore, PaymentSettings, TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";

type OnboardingWizardProps = {
  store: KioskStore;
  onSaveBusinessInfo?: (
    business: Pick<KioskStore["business"], "name" | "type" | "greeting">
  ) => Promise<void>;
  onSaveTemplateSelection?: (templateId: TemplateId) => Promise<void>;
  onSavePaymentSettings?: (payment: PaymentSettings) => Promise<void>;
};

const steps = [
  { id: 1, label: "Business" },
  { id: 2, label: "Design" },
  { id: 3, label: "Menu" },
  { id: 4, label: "Payment" },
  { id: 5, label: "Launch" }
] as const;

export function OnboardingWizard({
  store,
  onSaveBusinessInfo,
  onSaveTemplateSelection,
  onSavePaymentSettings
}: OnboardingWizardProps) {
  const templates = getTemplates();
  const [activeStep, setActiveStep] = useState(1);
  const [businessName, setBusinessName] = useState(store.business.name);
  const [businessType, setBusinessType] = useState(store.business.type);
  const [greeting, setGreeting] = useState(store.business.greeting);
  const [selectedTemplate, setSelectedTemplate] = useState(store.templateId);
  const [provider, setProvider] = useState(store.settings.payment.provider);
  const [merchantKey, setMerchantKey] = useState(store.settings.payment.merchantKey);
  const [clientKey, setClientKey] = useState(store.settings.payment.clientKey);

  const menuSummary = useMemo(
    () => ({
      categories: store.categories.length,
      items: store.items.length
    }),
    [store.categories.length, store.items.length]
  );

  async function handleBusinessSave() {
    await onSaveBusinessInfo?.({
      name: businessName,
      type: businessType,
      greeting
    });
  }

  async function handlePaymentSave() {
    await onSavePaymentSettings?.({
      provider,
      merchantKey,
      clientKey
    });
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            Setup Wizard
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Launch your kiosk in five moves
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            Keep it local-first, pick a polished template, and ship the full
            ordering flow from one device.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <Link
            href="/kiosk"
            role="button"
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Launch kiosk
          </Link>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {store.orders.length} live orders tracked
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStep(step.id)}
            className={cn(
              "rounded-2xl border px-4 py-3 text-left transition",
              activeStep === step.id
                ? "border-cyan-300 bg-cyan-500/10 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
            )}
          >
            <span className="block text-xs uppercase tracking-[0.24em]">
              {step.id}. {step.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
        {activeStep === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              Store name
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Business type
              <select
                value={businessType}
                onChange={(event) =>
                  setBusinessType(
                    event.target.value as KioskStore["business"]["type"]
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              >
                <option value="cafe">Cafe</option>
                <option value="restaurant">Restaurant</option>
                <option value="bakery">Bakery</option>
                <option value="general">General</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
              Greeting
              <textarea
                value={greeting}
                onChange={(event) => setGreeting(event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handleBusinessSave}
              className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              Save business profile
            </button>
          </div>
        ) : null}

        {activeStep === 2 ? (
          <div className="space-y-4">
            <TemplateGallery
              selectedId={selectedTemplate}
              templates={templates}
              onSelect={async (templateId) => {
                setSelectedTemplate(templateId);
                await onSaveTemplateSelection?.(templateId);
              }}
            />
          </div>
        ) : null}

        {activeStep === 3 ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Categories</p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {menuSummary.categories}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Menu items</p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {menuSummary.items}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Next action</p>
              <Link
                href="/admin/menu"
                className="mt-4 inline-flex rounded-2xl border border-cyan-300/40 px-4 py-3 text-sm font-medium text-cyan-200"
              >
                Open menu editor
              </Link>
            </div>
          </div>
        ) : null}

        {activeStep === 4 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              Provider
              <select
                value={provider}
                onChange={(event) =>
                  setProvider(event.target.value as PaymentSettings["provider"])
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              >
                <option value="toss">TossPayments</option>
                <option value="nhn-kcp">NHN KCP</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Merchant key
              <input
                value={merchantKey}
                onChange={(event) => setMerchantKey(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
              Client key
              <input
                value={clientKey}
                onChange={(event) => setClientKey(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handlePaymentSave}
              className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              Save payment config
            </button>
          </div>
        ) : null}

        {activeStep === 5 ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,_rgba(34,197,94,0.18),_rgba(15,23,42,0.1))] p-6">
              <h2 className="text-2xl font-semibold text-white">
                Launch checks
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                <li>Business profile saved with greeting and business type.</li>
                <li>Template selected for kiosk rendering.</li>
                <li>Menu editor ready with starter categories and items.</li>
                <li>Payment config stored locally for future integration.</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <Link
                href="/kiosk"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                Launch kiosk
              </Link>
              <Link
                href="/kds"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-4 py-3 font-medium text-white"
              >
                Open kitchen display
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
