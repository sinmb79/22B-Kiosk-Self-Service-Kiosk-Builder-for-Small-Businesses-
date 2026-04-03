import type { MenuItemDraft } from "@/lib/store/repository";
import type { Category } from "@/lib/types";

export type OcrProvider = "openai" | "anthropic" | "google" | "demo";

export type OcrExtractedItem = {
  name: string;
  price: number;
  confidence: number;
  category?: string;
  description?: string;
};

export type OcrExtractionResult = {
  items: OcrExtractedItem[];
  confidence: number;
  provider: OcrProvider;
  warnings?: string[];
};

type ExtractMenuOptions = {
  imageUrl?: string;
  imageDataUrl?: string;
  provider?: Exclude<OcrProvider, "demo">;
  apiKey?: string;
};

const CATEGORY_HINTS: Record<string, string[]> = {
  coffee: [
    "coffee",
    "americano",
    "latte",
    "espresso",
    "mocha",
    "cappuccino",
    "brew",
    "아메리카노",
    "라떼",
    "에스프레소",
    "커피"
  ],
  tea: [
    "tea",
    "ade",
    "juice",
    "grapefruit",
    "lemon",
    "유자",
    "자몽",
    "티",
    "차",
    "에이드"
  ],
  dessert: [
    "dessert",
    "bread",
    "salt bread",
    "croissant",
    "cookie",
    "cake",
    "bagel",
    "financier",
    "pastry",
    "bakery",
    "디저트",
    "빵",
    "브레드",
    "쿠키",
    "케이크"
  ]
};

export function createDemoOcrResult(): OcrExtractionResult {
  return {
    provider: "demo",
    confidence: 0.91,
    warnings: ["No OCR key was provided, so the demo menu payload is being used."],
    items: [
      {
        name: "Americano",
        price: 4500,
        confidence: 0.95,
        category: "coffee",
        description: "Classic espresso diluted with water."
      },
      {
        name: "Caffe Latte",
        price: 5200,
        confidence: 0.92,
        category: "coffee",
        description: "Espresso balanced with steamed milk."
      },
      {
        name: "Salt Bread",
        price: 3800,
        confidence: 0.87,
        category: "dessert",
        description: "Buttery bakery item with a light salty finish."
      }
    ]
  };
}

export function normalizeOcrItems(
  items: OcrExtractedItem[],
  categories: Category[]
): MenuItemDraft[] {
  const fallbackCategoryId = categories[0]?.id ?? "";

  return items
    .filter((item) => item.name.trim() && Number.isFinite(item.price) && item.price > 0)
    .map((item) => ({
      categoryId: resolveCategoryId(item, categories) ?? fallbackCategoryId,
      name: item.name.trim(),
      price: Math.round(item.price),
      description: item.description?.trim() || undefined
    }));
}

export async function extractMenuFromImage(
  options: ExtractMenuOptions
): Promise<OcrExtractionResult> {
  const provider = options.provider ?? "openai";
  const apiKey = options.apiKey?.trim() || process.env.OPENAI_API_KEY;
  const imageUrl = options.imageDataUrl?.trim() || options.imageUrl?.trim();

  if (!imageUrl) {
    throw new Error("Image URL or uploaded image is required.");
  }

  if (!apiKey) {
    return createDemoOcrResult();
  }

  if (provider !== "openai") {
    return {
      ...createDemoOcrResult(),
      warnings: [
        `${provider} OCR is not wired in this local MVP yet, so the demo payload was returned instead.`
      ]
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                "Extract menu items from this menu photo.",
                "Return only JSON with this shape:",
                '{"items":[{"name":"string","price":0,"category":"string","description":"string","confidence":0.0}],"confidence":0.0}',
                "Use KRW integer prices. Keep confidence between 0 and 1."
              ].join(" ")
            },
            {
              type: "input_image",
              image_url: imageUrl
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OCR request failed with ${response.status}.`);
  }

  const payload = (await response.json()) as Record<string, unknown>;
  const rawText = extractResponseText(payload);
  const parsed = parseOcrResponse(rawText);

  return {
    provider,
    confidence: clampConfidence(parsed.confidence ?? averageConfidence(parsed.items)),
    items: parsed.items.map((item) => ({
      name: item.name.trim(),
      price: Math.round(item.price),
      category: item.category?.trim(),
      description: item.description?.trim(),
      confidence: clampConfidence(item.confidence)
    }))
  };
}

function extractResponseText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const output = Array.isArray(payload.output) ? payload.output : [];

  for (const block of output) {
    if (!block || typeof block !== "object") {
      continue;
    }

    const content = Array.isArray((block as { content?: unknown[] }).content)
      ? (block as { content: unknown[] }).content
      : [];

    for (const item of content) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const text =
        typeof (item as { text?: unknown }).text === "string"
          ? (item as { text: string }).text
          : typeof (item as { output_text?: unknown }).output_text === "string"
            ? (item as { output_text: string }).output_text
            : null;

      if (text && text.trim()) {
        return text;
      }
    }
  }

  throw new Error("OCR response did not contain text output.");
}

function parseOcrResponse(rawText: string) {
  const normalizedText = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const parsed = JSON.parse(normalizedText) as {
    items?: OcrExtractedItem[];
    confidence?: number;
  };

  if (!Array.isArray(parsed.items)) {
    throw new Error("OCR response JSON did not include an items array.");
  }

  return {
    items: parsed.items,
    confidence: parsed.confidence
  };
}

function resolveCategoryId(
  item: Pick<OcrExtractedItem, "name" | "category" | "description">,
  categories: Category[]
) {
  const categoryHint = normalizeToken(item.category ?? "");
  const combinedHint = normalizeToken(
    [item.category, item.name, item.description].filter(Boolean).join(" ")
  );

  for (const category of categories) {
    const normalizedId = normalizeToken(category.id);
    const normalizedName = normalizeToken(category.name);

    if (
      categoryHint === normalizedId ||
      categoryHint === normalizedName ||
      combinedHint.includes(normalizedId) ||
      combinedHint.includes(normalizedName)
    ) {
      return category.id;
    }
  }

  for (const category of categories) {
    const hints = CATEGORY_HINTS[category.id] ?? [];
    if (hints.some((hint) => combinedHint.includes(normalizeToken(hint)))) {
      return category.id;
    }
  }

  return categories[0]?.id;
}

function normalizeToken(value: string) {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9가-힣]+/g, " ");
}

function clampConfidence(value: number | undefined) {
  if (!value || Number.isNaN(value)) {
    return 0.7;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return Math.round(value * 100) / 100;
}

function averageConfidence(items: OcrExtractedItem[]) {
  if (!items.length) {
    return 0.7;
  }

  return (
    items.reduce((sum, item) => sum + clampConfidence(item.confidence), 0) /
    items.length
  );
}
