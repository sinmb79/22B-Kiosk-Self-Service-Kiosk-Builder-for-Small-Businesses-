"use client";

import { useState } from "react";

import { coerceLanguage, type SupportedLanguage } from "@/lib/i18n";
import type { AccessibilitySettings, KioskStore } from "@/lib/types";

type ExperienceSettingsPanelProps = {
  settings: KioskStore["settings"];
  onSaveAccessibility: (settings: AccessibilitySettings) => Promise<void> | void;
  onSaveLanguages: (languages: SupportedLanguage[]) => Promise<void> | void;
};

const languages: Array<{ id: SupportedLanguage; label: string }> = [
  { id: "ko", label: "Korean" },
  { id: "en", label: "English" },
  { id: "zh", label: "Chinese" },
  { id: "ja", label: "Japanese" }
];

export function ExperienceSettingsPanel({
  settings,
  onSaveAccessibility,
  onSaveLanguages
}: ExperienceSettingsPanelProps) {
  const [accessibility, setAccessibility] = useState(settings.accessibility);
  const [enabledLanguages, setEnabledLanguages] = useState<SupportedLanguage[]>(
    settings.languages.map(coerceLanguage)
  );
  const [isSaving, setIsSaving] = useState(false);

  function toggleLanguage(language: SupportedLanguage) {
    setEnabledLanguages((current) => {
      if (language === "ko") {
        return current.includes("ko") ? current : ["ko", ...current];
      }

      return current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language];
    });
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      const nextLanguages = Array.from(
        new Set<SupportedLanguage>(["ko", ...enabledLanguages])
      );
      await onSaveAccessibility(accessibility);
      await onSaveLanguages(nextLanguages);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
          Accessibility & language
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-white">
          Guest experience settings
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Configure readable text, high-contrast mode, voice guidance, and the
          languages that should appear on the kiosk.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <ToggleCard
          label="Large text"
          description="Upsize the kiosk copy for easier reading."
          checked={accessibility.largeText}
          onChange={(checked) =>
            setAccessibility((current) => ({ ...current, largeText: checked }))
          }
        />
        <ToggleCard
          label="High contrast"
          description="Force stronger contrast for kiosk templates."
          checked={accessibility.highContrast}
          onChange={(checked) =>
            setAccessibility((current) => ({ ...current, highContrast: checked }))
          }
        />
        <ToggleCard
          label="Voice guide"
          description="Use browser speech guidance for key kiosk actions."
          checked={accessibility.voiceGuide}
          onChange={(checked) =>
            setAccessibility((current) => ({ ...current, voiceGuide: checked }))
          }
        />
        <ToggleCard
          label="Simple mode"
          description="Reduce visual density and keep targets larger."
          checked={accessibility.simpleMode}
          onChange={(checked) =>
            setAccessibility((current) => ({ ...current, simpleMode: checked }))
          }
        />
      </div>

      <label className="mt-5 block space-y-2 text-sm text-slate-200">
        Auto reset timeout (seconds)
        <input
          aria-label="Auto reset timeout"
          value={String(accessibility.autoTimeout)}
          onChange={(event) =>
            setAccessibility((current) => ({
              ...current,
              autoTimeout: Math.max(30, Number(event.target.value) || 60)
            }))
          }
          inputMode="numeric"
          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
        />
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {languages.map((language) => (
          <label
            key={language.id}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200"
          >
            <input
              aria-label={language.label}
              type="checkbox"
              checked={enabledLanguages.includes(language.id)}
              disabled={language.id === "ko"}
              onChange={() => toggleLanguage(language.id)}
            />
            <span>{language.label}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-5 w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save accessibility & languages"}
      </button>
    </section>
  );
}

type ToggleCardProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleCard({ label, description, checked, onChange }: ToggleCardProps) {
  return (
    <label className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-medium text-white">{label}</span>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <input
          aria-label={label}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
      </div>
    </label>
  );
}
