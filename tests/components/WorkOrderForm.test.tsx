import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WorkOrderForm from "@/components/WorkOrderForm";
import { vi } from "vitest";    

// Mock router
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<any>("next/navigation");
  const push = vi.fn();
  const refresh = vi.fn();
  return { ...actual, useRouter: () => ({ push, refresh }) };
});

describe("<WorkOrderForm />", () => {
  it("submits create payload", async () => {
    const mockJson = vi.fn().mockResolvedValue({
      id: "xyz-1",
      title: "New",
      description: "Desc",
      priority: "High",
      status: "Open",
      updatedAt: new Date().toISOString(),
    });
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: mockJson });
    vi.stubGlobal("fetch", mockFetch);

    render(<WorkOrderForm />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "New" } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Desc" } });
    fireEvent.change(screen.getByLabelText(/^priority$/i), { target: { value: "High" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/work-orders",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });
});
