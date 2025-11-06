// tests/components/WorkOrderTable.test.tsx
import { render, screen } from "@testing-library/react";
import type { WorkOrder } from "@/types/work-order";
import { vi } from "vitest";

// Mock next/navigation so useSearchParams() works in tests
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<any>("next/navigation");
  return {
    ...actual,
    useSearchParams: () => new URLSearchParams(""), // no status filter by default
  };
});

import WorkOrderTable from "@/components/WorkOrderTable";

const items: WorkOrder[] = [
  {
    id: "abc-123",
    title: "Paint door",
    description: "Use matte white",
    priority: "Low",
    status: "Open",
    updatedAt: new Date().toISOString(),
  },
];

describe("<WorkOrderTable />", () => {
  it("renders rows and a View link", () => {
    render(<WorkOrderTable items={items} />);
    expect(screen.getByText("Paint door")).toBeInTheDocument();

    // ✅ The link text is "View" (not "Open")
    const viewLink = screen.getByRole("link", { name: /view/i });
    expect(viewLink).toHaveAttribute("href", "/work-orders/abc-123");
  });

  it("renders 'No work orders' for empty list", () => {
    render(<WorkOrderTable items={[]} />);
    expect(screen.getByText(/no work orders/i)).toBeInTheDocument();
  });
});
