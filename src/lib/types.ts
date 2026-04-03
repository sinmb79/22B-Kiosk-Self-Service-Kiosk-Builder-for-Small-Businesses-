export type BusinessType =
  | "cafe"
  | "restaurant"
  | "bakery"
  | "convenience"
  | "parking"
  | "general";

export type TemplateId =
  | "cafe-modern"
  | "restaurant-classic"
  | "bakery-natural";

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "ready"
  | "done"
  | "cancelled";

export type Surface = "admin" | "kiosk" | "kds";

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
};

export type AccessibilitySettings = {
  largeText: boolean;
  highContrast: boolean;
  voiceGuide: boolean;
  simpleMode: boolean;
  autoTimeout: number;
};

export type PaymentProvider = "toss" | "nhn-kcp";

export type PaymentSettings = {
  provider: PaymentProvider;
  merchantKey: string;
  clientKey: string;
};

export type BusinessInfo = {
  name: string;
  type: BusinessType;
  logo?: string;
  greeting: string;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  sortOrder: number;
};

export type MenuOptionChoice = {
  id: string;
  label: string;
  priceDelta: number;
};

export type MenuOption = {
  id: string;
  name: string;
  choices: MenuOptionChoice[];
};

export type MenuBadge = "best" | "new" | "recommended" | "popular" | null;

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  nameJa?: string;
  price: number;
  description?: string;
  image?: string;
  badge?: MenuBadge;
  options?: MenuOption[];
  soldOut: boolean;
  sortOrder: number;
};

export type CartItem = {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
};

export type OrderItem = CartItem;

export type Order = {
  id: string;
  orderNumber: number;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentId?: string;
  createdAt: string;
};

export type Customizations = {
  level: 0 | 1 | 2;
  colors?: Partial<ThemeColors>;
  logo?: string;
  greeting?: string;
  backgroundImage?: string;
  figmaUrl?: string;
  webhookUrl?: string;
  cssOverride?: string;
};

export type TemplateManifest = {
  id: TemplateId;
  name: string;
  businessType: BusinessType;
  description: string;
  palette: string;
  theme: ThemeColors;
};

export type SyncLogEntry = {
  id: string;
  surface: Surface;
  type: string;
  createdAt: string;
};

export type KioskStore = {
  business: BusinessInfo;
  categories: Category[];
  items: MenuItem[];
  templateId: TemplateId;
  customizations: Customizations;
  cart: CartItem[];
  orders: Order[];
  settings: {
    payment: PaymentSettings;
    accessibility: AccessibilitySettings;
    languages: string[];
  };
  syncLog: SyncLogEntry[];
};
