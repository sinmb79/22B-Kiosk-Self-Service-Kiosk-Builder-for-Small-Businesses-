import { getLocalizedCategoryName, getLocalizedItemName } from "@/lib/i18n";
import { hexToRgba } from "@/lib/theme";
import type { TemplateSurfaceProps } from "@/templates/types";
import { formatWon } from "@/lib/utils";

export function BakeryNaturalTemplate({
  business,
  categories,
  items,
  locale,
  accessibility,
  activeCategoryId,
  onSelectCategory,
  onAddItem,
  presentation
}: TemplateSurfaceProps) {
  const { colors, greeting, logo, backgroundImage } = presentation;
  const largeText = accessibility?.largeText;
  const simpleMode = accessibility?.simpleMode;

  return (
    <div
      className="rounded-[2rem] border p-6"
      style={{
        color: colors.text,
        borderColor: hexToRgba(colors.primary, 0.22),
        background: backgroundImage
          ? `linear-gradient(180deg, ${hexToRgba(colors.accent, 0.18)}, ${hexToRgba(colors.background, 0.94)}), url(${backgroundImage}) center/cover`
          : `linear-gradient(180deg, ${hexToRgba(colors.accent, 0.12)}, ${colors.background})`
      }}
    >
      <header
        className="mb-6 flex flex-col gap-3 border-b pb-5"
        style={{ borderColor: hexToRgba(colors.primary, 0.18) }}
      >
        <p
          className="text-sm uppercase tracking-[0.24em]"
          style={{ color: colors.primary }}
        >
          Bakery Natural
        </p>
        {logo ? (
          <img
            src={logo}
            alt={`${business.name} logo`}
            className="h-14 w-auto rounded-2xl bg-white/95 p-2"
          />
        ) : null}
        <h2 className={largeText ? "text-5xl font-semibold" : "text-4xl font-semibold"}>
          {business.name}
        </h2>
        <p className="text-sm leading-6" style={{ color: hexToRgba(colors.text, 0.76) }}>
          {greeting}
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className="rounded-full border px-4 py-2"
            style={
              category.id === activeCategoryId
                ? {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    color: colors.background
                  }
                : {
                    borderColor: hexToRgba(colors.primary, 0.24),
                    color: hexToRgba(colors.text, 0.84)
                  }
            }
            >
              {getLocalizedCategoryName(category, locale)}
            </button>
          ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAddItem(item)}
            aria-label={`Add ${item.name}`}
            className="rounded-[1.75rem] border p-4 text-left"
            style={{
              borderColor: hexToRgba(colors.primary, 0.18),
              backgroundColor: hexToRgba(colors.surface, 0.62)
            }}
          >
            <div
              className="mb-4 h-36 rounded-[1.25rem]"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(colors.accent, 0.38)}, ${hexToRgba(colors.secondary, 0.2)}, ${hexToRgba(colors.primary, 0.24)})`
              }}
            />
            <h3 className={largeText ? "text-3xl font-medium" : "text-2xl font-medium"}>
              {getLocalizedItemName(item, locale)}
            </h3>
            {!simpleMode ? (
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: hexToRgba(colors.text, 0.76) }}
              >
                {item.description}
              </p>
            ) : null}
            <p
              className={largeText ? "mt-4 text-2xl font-semibold" : "mt-4 text-lg font-semibold"}
              style={{ color: colors.primary }}
            >
              {formatWon(item.price)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
