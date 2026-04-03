import { getLocalizedCategoryName, getLocalizedItemName } from "@/lib/i18n";
import { hexToRgba } from "@/lib/theme";
import type { TemplateSurfaceProps } from "@/templates/types";
import { formatWon } from "@/lib/utils";

export function RestaurantClassicTemplate({
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
      className="grid gap-5 rounded-[2rem] border p-6 md:grid-cols-[220px_1fr]"
      style={{
        color: colors.text,
        borderColor: hexToRgba(colors.primary, 0.16),
        background: backgroundImage
          ? `linear-gradient(160deg, ${hexToRgba(colors.secondary, 0.72)}, ${hexToRgba(colors.background, 0.92)}), url(${backgroundImage}) center/cover`
          : `linear-gradient(160deg, ${hexToRgba(colors.secondary, 0.42)}, ${colors.background})`
      }}
    >
      <aside
        className="rounded-[1.5rem] border p-4"
        style={{
          borderColor: hexToRgba(colors.primary, 0.14),
          backgroundColor: hexToRgba(colors.surface, 0.72)
        }}
      >
        <p
          className="text-sm uppercase tracking-[0.24em]"
          style={{ color: colors.primary }}
        >
          Restaurant Classic
        </p>
        {logo ? (
          <img
            src={logo}
            alt={`${business.name} logo`}
            className="mt-4 h-14 w-auto rounded-2xl bg-white/95 p-2"
          />
        ) : null}
        <h2 className={largeText ? "mt-4 text-4xl font-semibold" : "mt-4 text-3xl font-semibold"}>
          {business.name}
        </h2>
        <div className="mt-6 flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className="rounded-2xl border px-4 py-3 text-left"
              style={
                category.id === activeCategoryId
                  ? {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      color: colors.background
                    }
                  : {
                      borderColor: hexToRgba(colors.primary, 0.14),
                      color: hexToRgba(colors.text, 0.82)
                    }
              }
            >
              {getLocalizedCategoryName(category, locale)}
            </button>
          ))}
        </div>
      </aside>
      <div className="space-y-4">
        <p className="text-sm leading-6" style={{ color: hexToRgba(colors.text, 0.76) }}>
          {greeting}
        </p>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAddItem(item)}
            aria-label={`Add ${item.name}`}
            className="flex w-full items-center justify-between rounded-3xl border px-5 py-4 text-left"
            style={{
              borderColor: hexToRgba(colors.primary, 0.12),
              backgroundColor: hexToRgba(colors.surface, 0.66)
            }}
          >
            <div>
              <h3 className={largeText ? "text-2xl font-medium" : "text-xl font-medium"}>
                {getLocalizedItemName(item, locale)}
              </h3>
              {!simpleMode ? (
                <p
                  className="mt-2 text-sm"
                  style={{ color: hexToRgba(colors.text, 0.76) }}
                >
                  {item.description}
                </p>
              ) : null}
            </div>
            <span
              className={largeText ? "text-2xl font-semibold" : "text-lg font-semibold"}
              style={{ color: colors.primary }}
            >
              {formatWon(item.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
