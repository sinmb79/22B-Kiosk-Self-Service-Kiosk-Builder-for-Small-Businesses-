import type { MenuItemDraft } from "@/lib/store/repository";
import type { Category } from "@/lib/types";

type CsvParseResult = {
  items: MenuItemDraft[];
  skipped: number;
};

export function parseMenuCsv(csvText: string, categories: Category[]): CsvParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      items: [],
      skipped: 0
    };
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.trim().toLowerCase());
  const items: MenuItemDraft[] = [];
  let skipped = 0;

  for (const line of lines.slice(1)) {
    const values = splitCsvLine(line);
    const row = headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = values[index]?.trim() ?? "";
      return record;
    }, {});

    const price = Number.parseInt(row.price?.replaceAll(/[^0-9]/g, "") ?? "", 10);
    const name = row.name?.trim();

    if (!name || Number.isNaN(price) || price <= 0) {
      skipped += 1;
      continue;
    }

    items.push({
      categoryId: resolveCategoryId(row.category, categories),
      name,
      price,
      description: row.description || undefined,
      nameEn: row.nameen || undefined,
      nameZh: row.namezh || undefined,
      nameJa: row.nameja || undefined
    });
  }

  return {
    items,
    skipped
  };
}

function resolveCategoryId(rawCategory: string | undefined, categories: Category[]) {
  const normalized = normalizeToken(rawCategory ?? "");

  for (const category of categories) {
    if (
      normalizeToken(category.id) === normalized ||
      normalizeToken(category.name) === normalized
    ) {
      return category.id;
    }
  }

  if (normalized.includes("dessert") || normalized.includes("bread") || normalized.includes("디저트")) {
    return categories.find((category) => category.id === "dessert")?.id ?? categories[0]?.id ?? "";
  }

  if (normalized.includes("tea") || normalized.includes("차") || normalized.includes("에이드")) {
    return categories.find((category) => category.id === "tea")?.id ?? categories[0]?.id ?? "";
  }

  return categories.find((category) => category.id === "coffee")?.id ?? categories[0]?.id ?? "";
}

function normalizeToken(value: string) {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9가-힣]+/g, " ");
}

function splitCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current);
  return values;
}
