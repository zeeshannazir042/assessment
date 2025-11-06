import { describe, expect, it } from "vitest";
import { createWorkOrderSchema, updateWorkOrderSchema } from "@/lib/validation/workOrder";

describe("lib/validation/workOrder", () => {
  const good = {
    title: "Ok",
    description: "x".repeat(10),
    priority: "High" as const,
    status: "Open" as const,
  };

  it("accepts valid payloads", () => {
    expect(createWorkOrderSchema.parse(good)).toBeTruthy();
    expect(updateWorkOrderSchema.parse(good)).toBeTruthy();
  });

  it("rejects too-short title", () => {
    const res = createWorkOrderSchema.safeParse({ ...good, title: "A" });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message.toLowerCase()).toContain("least 2");
    }
  });

  it("rejects long description", () => {
    const res = createWorkOrderSchema.safeParse({ ...good, description: "x".repeat(2001) });
    expect(res.success).toBe(false);
  });

  it("rejects invalid priority", () => {
    const res = createWorkOrderSchema.safeParse({ ...good, priority: "Urgent" });
    expect(res.success).toBe(false);
  });
});
