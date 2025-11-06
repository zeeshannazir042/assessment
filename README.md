# Technician Work Orders (Next.js + TypeScript)

A lean Work Orders app using the **Next.js App Router** with file-based JSON persistence, pragmatic server-side validation (Zod), and right-sized tests.

> **Scope choice:** Implemented **Status filter** (Open / In Progress / Done) on the list page. Text search is omitted to stay within the timebox.

---

## Quick Start

```bash
npm install
npm run seed
npm run dev
```

Open:
- List: `http://localhost:3000/`
- Create: `http://localhost:3000/work-orders/new`
- API list: `http://localhost:3000/api/work-orders`
- API item: `http://localhost:3000/api/work-orders/<id>`

---

## Project Structure

```
.
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ work-orders/
│     ├─ new/page.tsx
│     └─ [id]/
│        ├─ page.tsx
│        └─ edit/page.tsx
├─ app/api/work-orders/
│  ├─ route.ts
│  └─ [id]/route.ts
├─ components/
│  ├─ WorkOrderForm.tsx
│  ├─ WorkOrderTable.tsx
│  ├─ StatusFilter.tsx
│  └─ Ui.tsx
├─ lib/
│  ├─ data/workOrders.ts
│  ├─ validation/workOrder.ts
│  └─ utils/date.ts
├─ data/work-orders.json
├─ scripts/seed.ts
├─ tests/
│  ├─ unit/
│  │  ├─ data.workOrders.test.ts
│  │  └─ validation.workOrder.test.ts
│  ├─ components/
│  │  ├─ WorkOrderForm.test.tsx
│  │  └─ WorkOrderTable.test.tsx
│  └─ e2e/ (optional)
│     └─ workorders.spec.ts
├─ vitest.config.ts
├─ tests/setupTests.ts
└─ playwright.config.ts (optional)
```

**Path alias:** `@/*` → project root.

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setupTests.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: true
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) }
  },
});
```

---

## Data & Persistence

- File-based JSON at `data/work-orders.json`.
- Atomic writes via temp file + rename.
- Override path in tests via `WO_DATA_FILE=/abs/path.json`.

Seed:
```bash
npm run seed
```

---

## Types

```ts
export type WorkOrder = {
  id: string;
  title: string;              // 2–80 chars
  description: string;        // up to ~2,000 chars
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Done';
  updatedAt: string;          // ISO string
};
```

---

## API (Route Handlers)

All responses are JSON.

### GET `/api/work-orders?status=<Open|In%20Progress|Done>`
Returns list sorted by `updatedAt` desc.

### POST `/api/work-orders`
Body:
```json
{
  "title": "Replace air filter in Unit A",
  "description": "MERV 11...",
  "priority": "Medium",
  "status": "Open"
}
```
201: Created item

### GET `/api/work-orders/:id`
200: Item; 404 if missing

### PUT `/api/work-orders/:id`
Full update, same shape as POST; 200 or 404; 400 with `{ error, fields }` on validation issues

### DELETE `/api/work-orders/:id`
204 or 404

---

## Validation & Security

- **Zod** server-side (`lib/validation/workOrder.ts`)
- `title` 2–80, `description` ≤2000, strict enums
- Errors returned as `{ error, fields }`

---

## Caching

- `export const dynamic = 'force-dynamic'` and `export const revalidate = 0` on API routes.
- Server Components for list/detail; Client Components for forms & filters.

---

## UI/UX

- Tailwind utility classes; responsive table.
- Keyboard-friendly forms and clear error messages.

---

## Testing

### Commands

```bash
# Unit + Component
npm test
npm run test:ui

# E2E (optional)
npm run dev   # in one terminal
npm run e2e   # in another
npm run e2e:ui
npm run e2e:headed
npm run e2e:debug
```

### Unit tests (Vitest)

- `tests/unit/data.workOrders.test.ts` — CRUD against a temp JSON file.
- `tests/unit/validation.workOrder.test.ts` — Zod schema bounds & enums.

### Component tests (Vitest + Testing Library)

- `tests/components/WorkOrderForm.test.tsx` — mocks `fetch` & `useRouter`, verifies POST + navigation.
- `tests/components/WorkOrderTable.test.tsx` — mocks `useSearchParams`, checks rows and link.

### E2E (Playwright, optional)

- `tests/e2e/workorders.spec.ts` — create → detail → edit → list.

---

## Troubleshooting

- **404 on `/api/work-orders/:id`** → ensure path `app/api/work-orders/[id]/route.ts`, use real id, restart dev.
- **`@/` alias not resolved** → adjust `vitest.config.ts` and `tsconfig.json` as shown.
- **`useSearchParams()` in tests** → mock via `vi.mock("next/navigation", ...)`.

---

## Notes & Trade-offs

- Picked **status filter** over free-text search to stay within timebox.
- Minimal client-side interactivity; most pages are Server Components.
- File-based storage to keep setup simple and tests deterministic.
