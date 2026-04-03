"use client";

import Link from "next/link";

import { DesignStudio } from "@/components/admin/design-studio";
import { DeveloperModePanel } from "@/components/admin/developer-mode-panel";
import { ExperienceSettingsPanel } from "@/components/admin/experience-settings-panel";
import { useStoreSnapshot } from "@/lib/store/use-store-snapshot";

export default function AdminPage() {
  const {
    store,
    isLoading,
    saveTemplateSelection,
    saveCustomizations,
    saveAccessibilitySettings,
    saveLanguages
  } = useStoreSnapshot("admin");

  if (isLoading || !store) {
    return <main className="p-8 text-white">Loading admin surface...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(37,99,235,0.32),_rgba(15,23,42,0.88),_rgba(34,197,94,0.18))] p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            Admin Surface
          </p>
          <h1 className="mt-3 text-4xl font-semibold">{store.business.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
            Configure the business, tune the design, and keep the menu source of
            truth ready for the kiosk and kitchen.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/onboarding"
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-slate-400">Setup wizard</p>
            <h2 className="mt-2 text-2xl font-medium text-white">Onboarding</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Business profile, template selection, payment settings, and launch.
            </p>
          </Link>
          <Link
            href="/admin/menu"
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-slate-400">Menu editor</p>
            <h2 className="mt-2 text-2xl font-medium text-white">
              {store.items.length} items
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Add products, manage sold-out states, and keep categories tidy.
            </p>
          </Link>
          <Link
            href="/kiosk"
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-slate-400">Customer preview</p>
            <h2 className="mt-2 text-2xl font-medium text-white">Open kiosk</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              See how the chosen template renders to customers in real time.
            </p>
          </Link>
        </section>

        <DesignStudio
          store={store}
          onSaveTemplateSelection={saveTemplateSelection}
          onSaveCustomizations={saveCustomizations}
        />

        <ExperienceSettingsPanel
          settings={store.settings}
          onSaveAccessibility={saveAccessibilitySettings}
          onSaveLanguages={saveLanguages}
        />

        <DeveloperModePanel
          customizations={store.customizations}
          onSaveDeveloperMode={saveCustomizations}
        />
      </div>
    </main>
  );
}
