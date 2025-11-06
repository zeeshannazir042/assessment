import { getWorkOrder } from "@/lib/data/workOrders";
import WorkOrderForm from "@/components/WorkOrderForm";

export default async function EditWorkOrderPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Await params since it's a Promise
  const { id } = await params;

  const item = await getWorkOrder(id);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg p-6 text-center">
          Work order not found.
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Edit Work Order
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
          Update the details below and save changes.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6">
        <WorkOrderForm initial={item} />
      </div>
    </section>
  );
}
