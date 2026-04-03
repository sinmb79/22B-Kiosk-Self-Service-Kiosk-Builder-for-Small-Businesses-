import type { BrandPresentation } from "@/lib/theme";
import type {
  AccessibilitySettings,
  BusinessInfo,
  Category,
  MenuItem
} from "@/lib/types";

export type TemplateSurfaceProps = {
  business: BusinessInfo;
  categories: Category[];
  items: MenuItem[];
  locale: string;
  accessibility?: AccessibilitySettings;
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onAddItem: (item: MenuItem) => void;
  presentation: BrandPresentation;
};
