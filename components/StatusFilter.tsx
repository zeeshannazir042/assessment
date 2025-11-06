"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "./Ui";
import type { WorkOrder } from "@/types/work-order";

const statuses: (WorkOrder["status"] | "All")[] = ["All", "Open", "In Progress", "Done"];

export default function StatusFilter({ value }: { value?: WorkOrder["status"] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = value ?? searchParams.get("status") ?? "All";

  function onChange(nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextStatus === "All") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-zinc-300" htmlFor="status">Status</label>
      <Select id="status" value={currentStatus} onChange={(e) => onChange(e.target.value)}>
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
    </div>
  );
}
