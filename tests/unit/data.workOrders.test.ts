import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import path from "path";

const TMP = path.join(process.cwd(), "data", "work-orders.tmp.test.json");
process.env.WO_DATA_FILE = TMP;

import {
  createWorkOrder,
  listWorkOrders,
  updateWorkOrder,
  deleteWorkOrder,
} from "@/lib/data/workOrders";

async function resetFile() {
  await fs.mkdir(path.dirname(TMP), { recursive: true });
  await fs.writeFile(TMP, "[]", "utf8");
}

describe("lib/data/workOrders", () => {
  beforeEach(resetFile);
  afterEach(resetFile);

  it("create → list → update → delete flow", async () => {
    const created = await createWorkOrder({
      title: "Unit test order",
      description: "Check the thing",
      priority: "High",
      status: "Open",
    });

    expect(created.id).toBeTruthy();

    const list1 = await listWorkOrders();
    expect(list1.find((w) => w.id === created.id)).toBeTruthy();

    const updated = await updateWorkOrder(created.id, {
      title: "Updated title",
      description: "Updated desc",
      priority: "Low",
      status: "In Progress",
    });
    expect(updated?.title).toBe("Updated title");

    const ok = await deleteWorkOrder(created.id);
    expect(ok).toBe(true);

    const list2 = await listWorkOrders();
    expect(list2.find((w) => w.id === created.id)).toBeFalsy();
  });

  it("status filter works", async () => {
    await createWorkOrder({ title: "Open one", description: "", priority: "Medium", status: "Open" });
    await createWorkOrder({ title: "Done one", description: "", priority: "Low", status: "Done" });

    const onlyDone = await listWorkOrders({ status: "Done" });
    expect(onlyDone.every((w) => w.status === "Done")).toBe(true);
  });
});
