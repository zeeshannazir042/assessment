import Link from "next/link";
import { getWorkOrder } from "@/lib/data/workOrders";
import { formatDate } from "@/lib/utils/date";

export default async function WorkOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Await params since it's a Promise
  const { id } = await params;

  const item = await getWorkOrder(id);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg p-6 text-center">
          Not found.
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
          {item.title}
        </h1>
        <Link
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition"
          href={`/work-orders/${item.id}/edit`}
        >
          Edit
        </Link>
      </div>

      {/* Metadata */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6 grid gap-4 sm:grid-cols-3">
        <div>
          <span className="font-medium text-gray-700 dark:text-zinc-300">Priority:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.priority === "High"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                : item.priority === "Medium"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            }`}
          >
            {item.priority}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-zinc-300">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.status === "Done"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : item.status === "In Progress"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-zinc-300"
            }`}
          >
            {item.status}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-zinc-400">
          Last updated: {formatDate(item.updatedAt)}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="mb-2 font-semibold text-zinc-800 dark:text-zinc-100 text-lg">Description</h2>
        <p className="text-gray-700 dark:text-zinc-300 whitespace-pre-wrap">{item.description}</p>
      </div>
    </section>
  );
}
