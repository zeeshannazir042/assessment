"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { WorkOrder } from "@/types/work-order";
import { formatDate } from "@/lib/utils/date";

type Props = {
  items: WorkOrder[];
  showActions?: boolean;
  onDelete?: (id: string) => Promise<void>;
};

export default function WorkOrderTable({ items: initialItems, showActions = true, onDelete }: Props) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") as WorkOrder["status"] | null;
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = (id: string) => {
    startTransition(async () => {
      await onDelete?.(id);
      setItems((prev) => prev.filter((w) => w.id !== id));
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      startTransition(async () => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());
        if (status) params.set("status", status);
        const res = await fetch(`/api/work-orders?${params.toString()}`);
        const data: WorkOrder[] = await res.json();
        setItems(data);
      });
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, status]);

  return (
    <div className="overflow-x-auto space-y-2">
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:text-white"
      />
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Priority</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Updated</th>
            {showActions && <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-zinc-300">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
          {items.map((w) => (
            <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-200">{w.title}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  w.priority === "High"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : w.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                }`}>{w.priority}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  w.status === "Done"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : w.status === "In Progress"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-zinc-300"
                }`}>{w.status}</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-zinc-400">{formatDate(w.updatedAt)}</td>
              {showActions && (
                <td className="px-4 py-3 text-right flex gap-2 justify-end">
                  <Link href={`/work-orders/${w.id}`} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">View</Link>
                  <button onClick={() => handleDeleteClick(w.id)} disabled={isPending} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition">Delete</button>
                </td>
              )}
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={showActions ? 5 : 4} className="py-8 text-center text-gray-500 dark:text-zinc-400 text-sm">No work orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
