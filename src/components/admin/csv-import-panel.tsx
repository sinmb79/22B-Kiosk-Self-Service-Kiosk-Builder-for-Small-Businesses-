"use client";

import { type ChangeEvent, useState } from "react";

import { parseMenuCsv } from "@/lib/csv/parse-menu";
import type { MenuItemDraft } from "@/lib/store/repository";
import type { Category } from "@/lib/types";
import { formatWon } from "@/lib/utils";

type CsvImportPanelProps = {
  categories: Category[];
  onImportItems: (drafts: MenuItemDraft[]) => Promise<void> | void;
};

type ParsedState = {
  items: MenuItemDraft[];
  skipped: number;
} | null;

export function CsvImportPanel({
  categories,
  onImportItems
}: CsvImportPanelProps) {
  const [csvText, setCsvText] = useState("");
  const [parsed, setParsed] = useState<ParsedState>(null);
  const [isImporting, setIsImporting] = useState(false);

  function handleParse() {
    setParsed(parseMenuCsv(csvText, categories));
  }

  async function handleImport() {
    if (!parsed?.items.length) {
      return;
    }

    setIsImporting(true);

    try {
      await onImportItems(parsed.items);
      setParsed(null);
      setCsvText("");
    } finally {
      setIsImporting(false);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCsvText(await file.text());
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Import menu from CSV</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Paste rows with `category,name,price,description,nameEn,nameZh,nameJa`
              or upload a CSV file to bulk-create menu items.
            </p>
          </div>

          <label className="block space-y-2 text-sm text-slate-200">
            CSV data
            <textarea
              aria-label="CSV data"
              value={csvText}
              onChange={(event) => setCsvText(event.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-sm text-white outline-none"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            CSV upload
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="block w-full rounded-2xl border border-dashed border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300"
            />
          </label>

          <button
            type="button"
            onClick={handleParse}
            disabled={!csvText.trim()}
            className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            Parse CSV
          </button>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">CSV preview</h3>
              <p className="mt-1 text-sm text-slate-300">
                {parsed?.items.length ?? 0} items ready
                {parsed?.skipped ? `, ${parsed.skipped} skipped` : ""}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {parsed?.items.length ? (
              parsed.items.map((item) => (
                <article
                  key={`${item.categoryId}-${item.name}`}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{item.categoryId}</p>
                      <h4 className="font-medium text-white">{item.name}</h4>
                      {item.description ? (
                        <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                      ) : null}
                    </div>
                    <span className="text-sm font-medium text-cyan-200">
                      {formatWon(item.price)}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
                Parse CSV to preview bulk menu items here.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={!parsed?.items.length || isImporting}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isImporting ? "Importing..." : "Import CSV items"}
          </button>
        </div>
      </div>
    </section>
  );
}
