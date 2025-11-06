import WorkOrderForm from "@/components/WorkOrderForm";

export const metadata = { title: "New Work Order" };

export default function NewWorkOrderPage() {
  return (
    <section className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Create New Work Order
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Fill in the details below to create a new work order.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6">
        <WorkOrderForm />
      </div>
    </section>
  );
}
