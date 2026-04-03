import { getLocalizedCategoryName, getLocalizedItemName } from "@/lib/i18n";
import { hexToRgba } from "@/lib/theme";
import type { TemplateSurfaceProps } from "@/templates/types";
import { formatWon } from "@/lib/utils";

export function CafeModernTemplate({
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
          ? `linear-gradient(160deg, ${hexToRgba(colors.secondary, 0.7)}, ${hexToRgba(colors.background, 0.92)}), url(${backgroundImage}) center/cover`
          : `linear-gradient(160deg, ${hexToRgba(colors.secondary, 0.48)}, ${colors.background})`
      }}
    >
      <header className="mb-6 space-y-3">
        <p
          className="text-sm uppercase tracking-[0.24em]"
          style={{ color: colors.primary }}
        >
          Cafe Modern
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
        <p className="text-sm leading-6" style={{ color: hexToRgba(colors.text, 0.8) }}>
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
                    borderColor: hexToRgba(colors.primary, 0.35),
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
            className="rounded-3xl border p-5 text-left"
            aria-label={`Add ${item.name}`}
            style={{
              borderColor: hexToRgba(colors.primary, 0.12),
              backgroundColor: hexToRgba(colors.surface, 0.76)
            }}
          >
            <div className="space-y-3">
              <div
                className={simpleMode ? "h-32 rounded-2xl" : "h-28 rounded-2xl"}
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(colors.primary, 0.45)}, ${hexToRgba(colors.surface, 0.15)}, ${hexToRgba(colors.accent, 0.4)})`
                }}
              />
              <div>
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
              </div>
              <p
                className={largeText ? "text-2xl font-semibold" : "text-lg font-semibold"}
                style={{ color: colors.primary }}
              >
                {formatWon(item.price)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
