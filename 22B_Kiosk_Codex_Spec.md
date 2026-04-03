# 22B Kiosk — Codex Implementation Spec

## Project: 22B-Kiosk (Self-Service Kiosk Builder for Small Businesses)
**Owner:** 22B Labs (sinmb79)
**Stack:** Next.js 15 + Tailwind CSS + shadcn/ui + PWA + Service Worker
**License:** MIT
**Repo:** `sinmb79/22b-kiosk`

---

## 1. Product Vision

A free, open-source kiosk builder that lets any small business owner create a
professional self-service kiosk on their own tablet in 15 minutes.

**Core Differentiators vs existing kiosk solutions:**
- No dedicated hardware required — runs on any tablet as PWA
- Free forever (₩0 subscription), PG fees go directly to payment provider
- Professional design via pre-made template gallery (not user-designed)
- 3-level customization: pick template → tweak colors → full Figma import
- Barrier-free (배리어프리) via software — no hardware swap needed
- Offline-capable via Service Worker + IndexedDB
- Menu auto-detection from photo (AI OCR)

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    3 Separate PWA Apps                   │
│                                                         │
│  ┌─────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │   Admin      │  │   Kiosk       │  │   KDS        │  │
│  │   Panel      │  │   Frontend    │  │   (Kitchen   │  │
│  │              │  │   (Customer)  │  │    Display)  │  │
│  │  - Menu edit │  │  - Browse     │  │  - Orders    │  │
│  │  - Design    │  │  - Order      │  │  - Status    │  │
│  │  - Sales     │  │  - Pay        │  │  - Timer     │  │
│  │  - Settings  │  │  - Receipt    │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         └────────┬────────┴──────────────────┘          │
│                  │                                      │
│         ┌────────▼─────────┐                            │
│         │    Sync Layer     │                            │
│         │  (IndexedDB +     │                            │
│         │   BroadcastChannel│                            │
│         │   + optional      │                            │
│         │   Supabase)       │                            │
│         └──────────────────┘                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            Design Supply Pipeline (Backend)              │
│                                                         │
│  Figma Community ──→ Design Connector ──→ Template DB   │
│  Canva Templates ──→ (automated)      ──→ (JSON Schema) │
│  22B Labs Designs ──→                                   │
│                                                         │
│  Figma REST API / Anima / Builder.io → React Components │
│  → Kiosk Schema (layout + slots + touch zones)          │
│  → QA Check (WCAG, touch target 44px+, font size)       │
│  → Publish to Template Gallery                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Phase 0 — MVP

### 3.1 Directory Structure

```
22b-kiosk/
├── apps/
│   ├── admin/                    # Admin Panel (Next.js PWA)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # Dashboard (today's sales)
│   │   │   │   ├── onboarding/       # First-time setup wizard
│   │   │   │   │   ├── step-1-business.tsx   # Business type selection
│   │   │   │   │   ├── step-2-design.tsx     # Template gallery
│   │   │   │   │   ├── step-3-menu.tsx       # Menu input
│   │   │   │   │   ├── step-4-payment.tsx    # PG setup
│   │   │   │   │   └── step-5-launch.tsx     # Deploy kiosk
│   │   │   │   ├── menu/
│   │   │   │   │   ├── editor.tsx            # Menu CRUD
│   │   │   │   │   ├── categories.tsx
│   │   │   │   │   ├── photo-import.tsx      # Camera → AI OCR
│   │   │   │   │   └── csv-import.tsx
│   │   │   │   ├── design/
│   │   │   │   │   ├── gallery.tsx           # Template browser
│   │   │   │   │   ├── preview.tsx           # Live preview
│   │   │   │   │   ├── customize/
│   │   │   │   │   │   ├── lv1-simple.tsx    # Color/logo/greeting
│   │   │   │   │   │   └── lv2-advanced.tsx  # Figma import, CSS override
│   │   │   │   │   └── figma-connector.tsx   # Design Connector UI
│   │   │   │   ├── orders/
│   │   │   │   │   ├── live.tsx              # Real-time order view
│   │   │   │   │   └── history.tsx
│   │   │   │   ├── sales/
│   │   │   │   │   ├── daily.tsx
│   │   │   │   │   └── report.tsx
│   │   │   │   └── settings/
│   │   │   │       ├── payment.tsx           # PG config
│   │   │   │       ├── accessibility.tsx     # 배리어프리 settings
│   │   │   │       ├── language.tsx          # Multi-language
│   │   │   │       └── developer.tsx         # Lv.2 advanced mode
│   │   │   ├── components/
│   │   │   │   ├── ui/                       # shadcn/ui
│   │   │   │   ├── menu-item-card.tsx
│   │   │   │   ├── template-card.tsx
│   │   │   │   ├── photo-capture.tsx
│   │   │   │   └── color-palette-picker.tsx
│   │   │   └── lib/
│   │   │       ├── store.ts                  # IndexedDB via Dexie
│   │   │       ├── sync.ts                   # BroadcastChannel
│   │   │       ├── ocr.ts                    # Menu photo → text
│   │   │       └── image-processor.ts        # Auto crop/enhance
│   │   └── package.json
│   │
│   ├── kiosk/                    # Customer-facing Kiosk (PWA)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx              # Splash / Welcome
│   │   │   │   ├── menu/                 # Browse menu
│   │   │   │   │   ├── categories.tsx
│   │   │   │   │   └── items.tsx
│   │   │   │   ├── cart/                 # Cart / Review order
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── confirm.tsx       # Order confirmation (anti-mistake)
│   │   │   │   ├── payment/              # Payment flow
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── result.tsx
│   │   │   │   └── receipt/              # Order number display
│   │   │   ├── components/
│   │   │   │   ├── template-renderer/    # Renders selected template
│   │   │   │   │   ├── renderer.tsx      # Template → React component
│   │   │   │   │   └── slot-binder.ts    # Binds menu JSON to template slots
│   │   │   │   ├── accessibility/
│   │   │   │   │   ├── large-text-mode.tsx
│   │   │   │   │   ├── voice-guide.tsx       # TTS navigation
│   │   │   │   │   ├── high-contrast.tsx
│   │   │   │   │   └── language-switcher.tsx
│   │   │   │   ├── cart-summary.tsx
│   │   │   │   └── order-timer.tsx
│   │   │   ├── lib/
│   │   │   │   ├── store.ts              # IndexedDB (same schema as admin)
│   │   │   │   ├── payment/
│   │   │   │   │   ├── toss.ts           # TossPayments SDK
│   │   │   │   │   ├── nhn-kcp.ts        # NHN KCP SDK
│   │   │   │   │   └── interface.ts      # Common payment interface
│   │   │   │   ├── offline.ts            # Service Worker registration
│   │   │   │   └── fullscreen.ts         # Kiosk mode (lock navigation)
│   │   │   └── sw.ts                     # Service Worker
│   │   └── package.json
│   │
│   └── kds/                      # Kitchen Display System (PWA)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx              # Order queue with timers
│       │   ├── components/
│       │   │   ├── order-card.tsx
│       │   │   ├── order-timer.tsx
│       │   │   └── status-toggle.tsx     # Preparing → Ready → Done
│       │   └── lib/
│       │       ├── store.ts
│       │       └── sync.ts
│       └── package.json
│
├── packages/
│   ├── shared/                   # Shared types, schemas, utils
│   │   ├── types/
│   │   │   ├── menu.ts           # Menu item, category types
│   │   │   ├── order.ts          # Order types
│   │   │   ├── template.ts       # Template schema types
│   │   │   └── payment.ts        # Payment types
│   │   ├── schema/
│   │   │   └── kiosk-schema.ts   # Unified template schema
│   │   └── utils/
│   │       ├── image.ts          # Background removal, crop
│   │       └── currency.ts       # KRW formatting
│   │
│   └── design-connector/         # Figma → Kiosk Schema converter
│       ├── src/
│       │   ├── figma-api.ts      # Figma REST API client
│       │   ├── converter.ts      # Figma JSON → Kiosk Schema
│       │   ├── qa-checker.ts     # WCAG, touch target, font size
│       │   └── publisher.ts      # Publish to template gallery
│       └── package.json
│
├── templates/                    # Pre-made design templates
│   ├── cafe-modern/
│   │   ├── manifest.json         # Template metadata
│   │   ├── components/           # React components
│   │   ├── preview.png
│   │   └── theme.ts              # Tailwind preset
│   ├── cafe-warm/
│   ├── restaurant-classic/
│   ├── restaurant-minimal/
│   ├── bakery-natural/
│   ├── convenience-dark/
│   └── parking-simple/
│
└── scripts/
    ├── template-builder.ts       # CLI to build template from Figma URL
    └── qa-report.ts              # Accessibility audit
```

### 3.2 Template Schema (kiosk-schema.ts)

```typescript
interface KioskTemplate {
  id: string;
  name: string;
  businessType: "cafe" | "restaurant" | "bakery" | "convenience" | "parking" | "general";
  version: string;
  author: string;
  preview: string;                 // Preview image URL

  // Theme
  theme: {
    palette: "warm" | "modern" | "classic" | "natural" | "dark";
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      accent: string;
    };
    fontFamily: string;
    borderRadius: string;
  };

  // Layout
  layout: {
    type: "grid-2" | "grid-3" | "card" | "list";
    header: {
      showLogo: boolean;
      greeting: string;              // e.g. "어서오세요!"
      showLanguageSwitcher: boolean;
    };
    categories: {
      position: "top" | "left" | "bottom";
      style: "tabs" | "pills" | "icons";
    };
    menuItem: {
      showImage: boolean;
      showDescription: boolean;
      showBadge: boolean;            // "인기", "신메뉴", "추천"
      imageRatio: "1:1" | "4:3" | "16:9";
    };
    cart: {
      position: "bottom" | "right";
      style: "bar" | "drawer";
    };
  };

  // Accessibility
  accessibility: {
    minFontSize: number;             // px, default 16
    minTouchTarget: number;          // px, default 44
    colorContrast: number;           // WCAG AA ratio, default 4.5
    voiceGuide: boolean;
  };

  // Components (React)
  components: {
    entry: string;                   // Main component path
    // Slots that accept dynamic data
    slots: KioskSlot[];
  };
}

interface KioskSlot {
  id: string;
  type: "menu-grid" | "category-nav" | "cart" | "header" | "footer" | "custom";
  dataBinding: string;               // JSONPath to menu data
}
```

### 3.3 Menu Data Schema

```typescript
interface KioskStore {
  // Business info
  business: {
    name: string;
    type: string;
    logo?: string;                    // Base64 or URL
    greeting: string;
  };

  // Menu
  categories: Category[];
  items: MenuItem[];

  // Design
  templateId: string;
  customizations: {
    level: 0 | 1 | 2;
    colors?: Partial<ThemeColors>;
    logo?: string;
    greeting?: string;
    backgroundImage?: string;
    cssOverride?: string;             // Lv.2 only
  };

  // Orders
  orders: Order[];

  // Settings
  settings: {
    payment: {
      provider: "toss" | "nhn-kcp";
      merchantKey: string;
      clientKey: string;
    };
    accessibility: AccessibilitySettings;
    languages: string[];              // ["ko", "en", "zh", "ja"]
  };
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;                       // Korean name
  nameEn?: string;
  nameZh?: string;
  nameJa?: string;
  price: number;                      // KRW
  description?: string;
  image?: string;
  badge?: "인기" | "신메뉴" | "추천" | "매진" | null;
  options?: MenuOption[];             // Size, temperature, etc.
  soldOut: boolean;
  sortOrder: number;
}

interface Order {
  id: string;
  orderNumber: number;                // Sequential per day
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "paid" | "preparing" | "ready" | "done" | "cancelled";
  paymentId?: string;
  createdAt: string;
}
```

### 3.4 Customization Levels

```typescript
// Lv.0 — Just Use It
// User selects template, enters menu, done.
// No customization UI shown.

// Lv.1 — Simple Tweaks (in-app settings)
interface Lv1Customization {
  primaryColor: string;               // Color picker (5 presets + custom)
  logo: File;                         // Upload
  greeting: string;                   // Text input
  backgroundImage?: File;             // Optional
  menuItemStyle: "photo" | "text-only" | "compact";
  categoryIcons: boolean;
}

// Lv.2 — Developer Mode (hidden behind toggle)
interface Lv2Customization extends Lv1Customization {
  figmaUrl?: string;                  // Import from Figma
  cssOverride?: string;               // Raw CSS
  customComponents?: File;            // Upload React component bundle
  webhookUrl?: string;                // Order notification webhook
  customPaymentProvider?: PaymentConfig;
}
```

### 3.5 Menu Photo Import (AI OCR)

```typescript
// lib/ocr.ts
interface MenuOCRResult {
  items: {
    name: string;
    price: number;
    category?: string;
    confidence: number;
  }[];
}

async function extractMenuFromPhoto(
  imageBase64: string,
  apiKey: string,           // BYOK
  provider: "anthropic" | "openai" | "google"
): Promise<MenuOCRResult> {
  // 1. Send image to LLM with structured prompt
  // 2. Prompt: "Extract all menu items with name and price from this menu board photo.
  //            Return JSON array. Korean text expected."
  // 3. Parse structured response
  // 4. User reviews & confirms before saving
  return result;
}
```

### 3.6 Payment Integration

```typescript
// lib/payment/interface.ts
interface PaymentProvider {
  initialize(config: PaymentConfig): Promise<void>;
  requestPayment(order: Order): Promise<PaymentResult>;
  cancelPayment(paymentId: string): Promise<CancelResult>;
  getStatus(paymentId: string): Promise<PaymentStatus>;
}

// lib/payment/toss.ts
// Uses TossPayments JavaScript SDK
// https://docs.tosspayments.com/

// lib/payment/nhn-kcp.ts
// Uses NHN KCP JavaScript SDK
```

### 3.7 Offline Mode (Service Worker)

```typescript
// sw.ts
// Strategy: Cache-First for static assets, IndexedDB for data

// Cached:
// - All template components
// - Menu data (synced from IndexedDB)
// - Images (menu item photos)

// Not cached (requires network):
// - Payment processing
// - Order sync to cloud (if configured)

// Behavior when offline:
// - Menu browsing: ✅ works
// - Order placement: ✅ saved locally, queued for sync
// - Payment: ❌ requires network (show "현금 결제" fallback)
```

### 3.8 Accessibility (배리어프리)

```typescript
// components/accessibility/
// Software-based barrier-free features (no hardware swap needed)

interface AccessibilitySettings {
  largeText: boolean;                 // 1.5x font size
  highContrast: boolean;              // WCAG AAA colors
  voiceGuide: boolean;                // TTS for all interactions
  simpleMode: boolean;                // Reduced UI, bigger buttons
  autoTimeout: number;                // Seconds before session reset (default 60)
  languages: string[];                // Available languages
}

// Voice guide uses Web Speech API (built into browsers)
// No external TTS service needed
```

---

## 4. Phase 0 Deliverables

| # | Task | Priority |
|---|------|----------|
| 1 | Shared types/schema package | P0 |
| 2 | IndexedDB store (Dexie) with menu/order/settings | P0 |
| 3 | Kiosk app: menu browsing + cart + order placement | P0 |
| 4 | Admin app: onboarding wizard (5 steps) | P0 |
| 5 | Admin app: menu editor (CRUD + photo upload) | P0 |
| 6 | 3 built-in templates (cafe-modern, restaurant-classic, bakery-natural) | P0 |
| 7 | Template renderer + slot binding | P0 |
| 8 | BroadcastChannel sync (admin ↔ kiosk ↔ KDS) | P0 |
| 9 | KDS app: order queue with status toggle | P1 |
| 10 | TossPayments integration | P1 |
| 11 | Service Worker + offline mode | P1 |
| 12 | Menu photo OCR (BYOK) | P1 |
| 13 | Lv.1 customization (color/logo/greeting) | P1 |
| 14 | Accessibility: large text + high contrast + voice guide | P1 |
| 15 | Multi-language (ko/en/zh/ja) | P2 |
| 16 | Design Connector (Figma import) | P2 |
| 17 | Lv.2 developer mode | P2 |
| 18 | CSV menu import | P2 |

---

## 5. Design Template Development Guide

### For 22B Labs (initial templates)

1. Design in Figma using 1080×1920 artboard (portrait tablet)
2. Use Auto Layout for all containers
3. Name layers semantically: `menu-grid`, `category-nav`, `cart-bar`, `header`
4. Export via Design Connector → generates React components + manifest
5. Run QA checker: `npx qa-check ./templates/cafe-modern/`
6. QA rules:
   - All text ≥ 16px
   - All touch targets ≥ 44×44px
   - Color contrast ≥ 4.5:1
   - No horizontal scroll
   - Max 3 taps to complete order

### For Community Designers (future marketplace)

1. Fork template starter: `npx create-22b-template`
2. Design in Figma → export via connector
3. Submit PR to template gallery repo
4. Automated QA + human review
5. Published with designer credit + optional revenue share

---

## 6. Revenue Model

| Item | Price | Notes |
|------|-------|-------|
| Software | ₩0 | Free forever, MIT license |
| Basic templates (5) | ₩0 | Included |
| Premium templates | ₩10,000~30,000 | One-time purchase |
| Designer marketplace | 70/30 split | Designer gets 70% |
| PG fees | Pass-through | Business pays PG directly |
| Cloud sync (optional) | TBD (Phase 2) | Supabase backend |

---

## 7. Non-Goals (Phase 0)

- Cloud backend / multi-device sync (local-only for now)
- Hardware integration (receipt printer, card reader)
- POS integration
- Inventory management
- Employee management
- Delivery platform integration (배민/요기요)
