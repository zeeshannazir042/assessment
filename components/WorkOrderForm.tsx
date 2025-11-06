"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { WorkOrder } from "@/types/work-order";
import { Button, Input, Select, Textarea } from "./Ui";

type FormState = {
  title: string;
  description: string;
  priority: WorkOrder["priority"];
  status: WorkOrder["status"];
};

const defaultState: FormState = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Open",
};

export default function WorkOrderForm({ initial }: { initial?: WorkOrder }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    initial
      ? { title: initial.title, description: initial.description, priority: initial.priority, status: initial.status }
      : defaultState
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const payload = {
      title: state.title.trim(),
      description: state.description,
      priority: state.priority,
      status: state.status,
    };

    try {
      const res = await fetch(initial ? `/api/work-orders/${initial.id}` : "/api/work-orders", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(data?.fields ?? { form: data?.error ?? "Something went wrong" });
        return;
      }

      const createdOrUpdated: WorkOrder = await res.json();
      router.push(`/`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm("Delete this work order?")) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/work-orders/${initial.id}`, { method: "DELETE" });
      if (res.status === 204) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data?.error ?? "Delete failed" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      onSubmit={onSubmit}
      noValidate
    >
      {errors.form && <div className="text-red-600 text-sm font-medium">{errors.form}</div>}

      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300" htmlFor="title">
          Title
        </label>
        <Input
          id="title"
          placeholder="Enter work order title"
          value={state.title}
          onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
          required
          minLength={2}
          maxLength={80}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300" htmlFor="description">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Describe the work order"
          rows={5}
          value={state.description}
          onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
          maxLength={2000}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300" htmlFor="priority">
            Priority
          </label>
          <Select
            id="priority"
            value={state.priority}
            onChange={(e) => setState((s) => ({ ...s, priority: e.target.value as WorkOrder["priority"] }))}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </Select>
          {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300" htmlFor="status">
            Status
          </label>
          <Select
            id="status"
            value={state.status}
            onChange={(e) => setState((s) => ({ ...s, status: e.target.value as WorkOrder["status"] }))}
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Done</option>
          </Select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition rounded-md"
        >
          {initial ? "Save changes" : "Create"}
        </Button>

        {initial && (
          <Button
            type="button"
            variant="danger"
            onClick={onDelete}
            disabled={submitting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white transition rounded-md"
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
