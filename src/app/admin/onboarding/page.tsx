"use client";

import Link from "next/link";

import { OnboardingWizard } from "@/components/admin/onboarding-wizard";
import { useStoreSnapshot } from "@/lib/store/use-store-snapshot";

export default function AdminOnboardingPage() {
  const {
    store,
    isLoading,
    saveBusinessInfo,
    savePaymentSettings,
    saveTemplateSelection
  } = useStoreSnapshot("admin");

  if (isLoading || !store) {
    return <main className="p-8 text-white">Loading onboarding...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-sm text-cyan-200">
            ← Back to admin
          </Link>
          <Link href="/admin/menu" className="text-sm text-cyan-200">
            Open menu editor
          </Link>
        </div>
        <OnboardingWizard
          store={store}
          onSaveBusinessInfo={saveBusinessInfo}
          onSavePaymentSettings={savePaymentSettings}
          onSaveTemplateSelection={saveTemplateSelection}
        />
      </div>
    </main>
  );
}
