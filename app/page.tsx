import StatusFilter from "@/components/StatusFilter";
import WorkOrderTable from "@/components/WorkOrderTable";
import { listWorkOrders, deleteWorkOrder } from "@/lib/data/workOrders";
import type { WorkOrder } from "@/types/work-order";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const VALID_STATUSES: WorkOrder["status"][] = ["Open", "In Progress", "Done"];

export default async function Page({ searchParams }: PageProps) {
  const raw = typeof searchParams?.status === "string" ? searchParams.status : undefined;
  const decoded = raw ? decodeURIComponent(raw) : undefined;
  const status = (VALID_STATUSES as readonly string[]).includes(decoded ?? "")
    ? (decoded as WorkOrder["status"])
    : undefined;

  const items = await listWorkOrders({ status });

  async function handleDelete(id: string) {
    "use server";
    const success = await deleteWorkOrder(id);
    if (!success) throw new Error("Failed to delete work order");
  }

  return (
    <section className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="card shadow-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Work Orders</h1>
          <div className="w-full sm:w-auto">
            <StatusFilter value={status} />
          </div>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Manage and track all work orders efficiently — filter by status to focus on specific tasks.</p>
      </div>
      <WorkOrderTable items={items} onDelete={handleDelete} />
    </section>
  );
}
