# 22B Kiosk Local MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable local-only MVP from the spec with shared schema, admin setup, kiosk ordering, KDS queue, and same-origin sync.

**Architecture:** Use one Next.js 15 App Router application with three route areas (`/admin`, `/kiosk`, `/kds`) so IndexedDB and BroadcastChannel stay on the same origin. Keep product data and order state in Dexie, expose pure helpers in `src/lib`, and render templates from local JSON manifests plus React components.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Dexie, BroadcastChannel, Vitest, React Testing Library

---

### Task 1: Scaffold The Application Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Test: `src/lib/__tests__/app-shell.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { getSurfaceLinks } from "../navigation";

describe("getSurfaceLinks", () => {
  it("returns the three MVP surfaces in a stable order", () => {
    expect(getSurfaceLinks().map((item) => item.href)).toEqual([
      "/admin",
      "/kiosk",
      "/kds",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run src/lib/__tests__/app-shell.test.ts`
Expected: FAIL with missing `navigation` module or missing export

- [ ] **Step 3: Write minimal implementation**

```ts
export function getSurfaceLinks() {
  return [
    { href: "/admin", label: "Admin" },
    { href: "/kiosk", label: "Kiosk" },
    { href: "/kds", label: "KDS" },
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- --run src/lib/__tests__/app-shell.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: scaffold local kiosk mvp shell"
```

### Task 2: Define Shared Schema And Store

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/store/defaults.ts`
- Create: `src/lib/store/db.ts`
- Create: `src/lib/store/repository.ts`
- Test: `src/lib/store/__tests__/defaults.test.ts`
- Test: `src/lib/store/__tests__/repository.test.ts`

- [ ] **Step 1: Write the failing schema test**

```ts
import { describe, expect, it } from "vitest";
import { createDefaultStore } from "../defaults";

describe("createDefaultStore", () => {
  it("creates the expected starter business, templates, and settings", () => {
    const store = createDefaultStore();
    expect(store.business.name).toBe("22B Demo Store");
    expect(store.templateId).toBe("cafe-modern");
    expect(store.settings.languages).toEqual(["ko", "en", "zh", "ja"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run src/lib/store/__tests__/defaults.test.ts`
Expected: FAIL with missing defaults module

- [ ] **Step 3: Write minimal implementation**

Create the shared TypeScript types, starter data factory, and repository helpers for business info, menu items, template selection, cart state, and orders.

- [ ] **Step 4: Run targeted tests**

Run: `npm run test -- --run src/lib/store/__tests__/defaults.test.ts src/lib/store/__tests__/repository.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add kiosk store schema and repository"
```

### Task 3: Build Admin Setup And Menu Editing

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/onboarding/page.tsx`
- Create: `src/app/admin/menu/page.tsx`
- Create: `src/components/admin/onboarding-wizard.tsx`
- Create: `src/components/admin/menu-editor.tsx`
- Create: `src/components/admin/template-gallery.tsx`
- Test: `src/components/admin/__tests__/onboarding-wizard.test.tsx`
- Test: `src/components/admin/__tests__/menu-editor.test.tsx`

- [ ] **Step 1: Write the failing onboarding test**

```tsx
import { render, screen } from "@testing-library/react";
import { OnboardingWizard } from "../onboarding-wizard";

it("shows five setup steps and a launch action", () => {
  render(<OnboardingWizard />);
  expect(screen.getByText("1. Business")).toBeInTheDocument();
  expect(screen.getByText("5. Launch")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /launch kiosk/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run src/components/admin/__tests__/onboarding-wizard.test.tsx`
Expected: FAIL with missing component

- [ ] **Step 3: Write minimal implementation**

Implement the admin dashboard, five-step setup wizard, template selection, business settings, and menu CRUD with local image URLs and preset categories.

- [ ] **Step 4: Run targeted tests**

Run: `npm run test -- --run src/components/admin/__tests__/onboarding-wizard.test.tsx src/components/admin/__tests__/menu-editor.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add admin onboarding and menu editor"
```

### Task 4: Build Kiosk Ordering Flow And Template Renderer

**Files:**
- Create: `src/app/kiosk/page.tsx`
- Create: `src/app/kiosk/checkout/page.tsx`
- Create: `src/components/kiosk/template-renderer.tsx`
- Create: `src/components/kiosk/menu-browser.tsx`
- Create: `src/components/kiosk/cart-panel.tsx`
- Create: `src/lib/templates.ts`
- Create: `src/templates/cafe-modern.tsx`
- Create: `src/templates/restaurant-classic.tsx`
- Create: `src/templates/bakery-natural.tsx`
- Test: `src/components/kiosk/__tests__/template-renderer.test.tsx`
- Test: `src/components/kiosk/__tests__/cart-panel.test.tsx`

- [ ] **Step 1: Write the failing cart test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartPanel } from "../cart-panel";

it("shows cart total and submit action", async () => {
  render(<CartPanel items={[{ id: "1", name: "Americano", quantity: 2, price: 4500 }]} onSubmit={async () => {}} />);
  expect(screen.getByText("9,000원")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /place order/i }));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run src/components/kiosk/__tests__/cart-panel.test.tsx`
Expected: FAIL with missing component

- [ ] **Step 3: Write minimal implementation**

Implement menu browsing, category filters, cart interactions, template rendering, and local order creation that writes into the shared store.

- [ ] **Step 4: Run targeted tests**

Run: `npm run test -- --run src/components/kiosk/__tests__/template-renderer.test.tsx src/components/kiosk/__tests__/cart-panel.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add kiosk ordering flow and templates"
```

### Task 5: Build KDS And Cross-Surface Sync

**Files:**
- Create: `src/app/kds/page.tsx`
- Create: `src/components/kds/order-queue.tsx`
- Create: `src/lib/sync/channel.ts`
- Create: `src/lib/sync/use-live-store.ts`
- Test: `src/lib/sync/__tests__/channel.test.ts`
- Test: `src/components/kds/__tests__/order-queue.test.tsx`

- [ ] **Step 1: Write the failing sync test**

```ts
import { describe, expect, it } from "vitest";
import { createSyncMessage } from "../channel";

describe("createSyncMessage", () => {
  it("creates a sync packet with surface and timestamp", () => {
    const packet = createSyncMessage("admin", "menu.updated");
    expect(packet.surface).toBe("admin");
    expect(packet.type).toBe("menu.updated");
    expect(typeof packet.timestamp).toBe("number");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run src/lib/sync/__tests__/channel.test.ts`
Expected: FAIL with missing sync helper

- [ ] **Step 3: Write minimal implementation**

Implement the KDS queue, status transitions, live store subscription, and BroadcastChannel publishing for menu and order updates.

- [ ] **Step 4: Run targeted tests**

Run: `npm run test -- --run src/lib/sync/__tests__/channel.test.ts src/components/kds/__tests__/order-queue.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add kds queue and same-origin sync"
```

### Task 6: Verify The Full MVP

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Run the full automated suite**

Run: `npm run test -- --run`
Expected: PASS

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: PASS with Next.js production output

- [ ] **Step 3: Run the app and smoke-test the three surfaces**

Run: `npm run dev`
Expected: `/admin`, `/kiosk`, and `/kds` all load locally

- [ ] **Step 4: Document how to run the MVP**

Add quick-start, route map, and local limitations to `README.md`.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document local kiosk mvp"
```
