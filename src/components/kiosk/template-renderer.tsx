"use client";

import { CafeModernTemplate } from "@/templates/cafe-modern";
import { RestaurantClassicTemplate } from "@/templates/restaurant-classic";
import { BakeryNaturalTemplate } from "@/templates/bakery-natural";
import {
  applyHighContrastTheme,
  resolveBrandPresentation
} from "@/lib/theme";
import type {
  AccessibilitySettings,
  BusinessInfo,
  Category,
  Customizations,
  MenuItem,
  TemplateId
} from "@/lib/types";

type TemplateRendererProps = {
  templateId: TemplateId;
  business: BusinessInfo;
  categories: Category[];
  items: MenuItem[];
  locale?: string;
  accessibility?: AccessibilitySettings;
  customizations?: Customizations;
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onAddItem: (item: MenuItem) => void;
};

export function TemplateRenderer(props: TemplateRendererProps) {
  const filteredItems = props.items.filter(
    (item) => item.categoryId === props.activeCategoryId && !item.soldOut
  );
  const presentation = resolveBrandPresentation(
    props.templateId,
    props.business,
    props.customizations
  );
  const sharedProps = {
    ...props,
    locale: props.locale ?? "ko",
    items: filteredItems.length > 0 ? filteredItems : props.items,
    presentation: props.accessibility?.highContrast
      ? {
          ...presentation,
          colors: applyHighContrastTheme(presentation.colors)
        }
      : presentation
  };

  if (props.templateId === "restaurant-classic") {
    return <RestaurantClassicTemplate {...sharedProps} />;
  }

  if (props.templateId === "bakery-natural") {
    return <BakeryNaturalTemplate {...sharedProps} />;
  }

  return <CafeModernTemplate {...sharedProps} />;
}
