"use client";

import { type ChangeEvent, useMemo, useState } from "react";

import { normalizeOcrItems, type OcrExtractionResult, type OcrProvider } from "@/lib/ocr/extract-menu";
import type { MenuItemDraft } from "@/lib/store/repository";
import type { Category } from "@/lib/types";
import { formatWon } from "@/lib/utils";

type PhotoImportInput = {
  imageUrl?: string;
  imageDataUrl?: string;
  provider: Exclude<OcrProvider, "demo">;
  apiKey?: string;
};

type PhotoImportPanelProps = {
  categories?: Category[];
  onRunOcr: (
    input: PhotoImportInput
  ) => Promise<
    Pick<OcrExtractionResult, "items"> &
      Partial<Pick<OcrExtractionResult, "confidence" | "provider" | "warnings">>
  >;
  onImportItems: (drafts: MenuItemDraft[]) => Promise<void> | void;
};

export function PhotoImportPanel({
  categories = [],
  onRunOcr,
  onImportItems
}: PhotoImportPanelProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [fileName, setFileName] = useState("");
  const [provider, setProvider] = useState<Exclude<OcrProvider, "demo">>("openai");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState<OcrExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const normalizedDrafts = useMemo(() => {
    if (!result) {
      return [];
    }

    if (categories.length > 0) {
      return normalizeOcrItems(result.items, categories);
    }

    return result.items.map((item) => ({
      categoryId: item.category?.trim().toLowerCase() ?? "",
      name: item.name.trim(),
      price: Math.round(item.price),
      description: item.description?.trim() || undefined
    }));
  }, [categories, result]);

  const hasImageSource = Boolean(imageUrl.trim() || imageDataUrl);

  async function handleRunImport() {
    if (!hasImageSource) {
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const nextResult = await onRunOcr({
        imageUrl: imageUrl.trim() || undefined,
        imageDataUrl,
        provider,
        apiKey: apiKey.trim() || undefined
      });

      setResult({
        items: nextResult.items,
        confidence: nextResult.confidence ?? 0.8,
        provider: nextResult.provider ?? provider,
        warnings: nextResult.warnings
      });
    } catch (runError) {
      setResult(null);
      setError(
        runError instanceof Error ? runError.message : "Photo import failed."
      );
    } finally {
      setIsRunning(false);
    }
  }

  async function handleImportItems() {
    if (normalizedDrafts.length === 0) {
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      await onImportItems(normalizedDrafts);
      setResult(null);
      setImageUrl("");
      setImageDataUrl(undefined);
      setFileName("");
    } catch (importError) {
      setError(
        importError instanceof Error ? importError.message : "Import failed."
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageDataUrl(undefined);
      setFileName("");
      return;
    }

    setFileName(file.name);
    setImageUrl("");

    const nextDataUrl = await readFileAsDataUrl(file);
    setImageDataUrl(nextDataUrl);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Import menu from a photo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Paste a public image URL or upload a menu photo. If no OCR key is
              available, the panel falls back to a demo payload so you can keep
              moving.
            </p>
          </div>

          <label className="block space-y-2 text-sm text-slate-200">
            Image URL
            <input
              aria-label="Image URL"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/menu-board.jpg"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            Upload photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="block w-full rounded-2xl border border-dashed border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300"
            />
            {fileName ? (
              <span className="text-xs text-cyan-200">{fileName}</span>
            ) : null}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm text-slate-200">
              OCR provider
              <select
                value={provider}
                onChange={(event) =>
                  setProvider(event.target.value as Exclude<OcrProvider, "demo">)
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
              </select>
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              API key (optional)
              <input
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="sk-..."
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleRunImport}
            disabled={!hasImageSource || isRunning}
            className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? "Running OCR..." : "Run photo import"}
          </button>

          {error ? (
            <p className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </p>
          ) : null}
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Extracted items</h3>
              <p className="mt-1 text-sm text-slate-300">
                Review the parsed menu before adding it to the shared store.
              </p>
            </div>
            {result ? (
              <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
                {result.provider}
              </span>
            ) : null}
          </div>

          {result?.warnings?.length ? (
            <div className="space-y-2">
              {result.warnings.map((warning) => (
                <p
                  key={warning}
                  className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100"
                >
                  {warning}
                </p>
              ))}
            </div>
          ) : null}

          <div className="space-y-3">
            {result?.items.length ? (
              result.items.map((item) => (
                <article
                  key={`${item.name}-${item.price}`}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="text-sm text-slate-400">
                        {item.category || "Category will be auto-mapped"}
                      </p>
                      {item.description ? (
                        <p className="text-sm text-slate-300">{item.description}</p>
                      ) : null}
                    </div>
                    <div className="text-right text-sm text-slate-200">
                      <p>{formatWon(item.price)}</p>
                      <p className="text-xs text-slate-400">
                        {(item.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
                Run OCR to see extracted menu items here.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleImportItems}
            disabled={normalizedDrafts.length === 0 || isImporting}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isImporting ? "Importing..." : "Import extracted items"}
          </button>
        </div>
      </div>
    </section>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the image file."));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the image file."));
    };

    reader.readAsDataURL(file);
  });
}
