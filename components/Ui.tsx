import { clsx } from "clsx";
import { ComponentProps } from "react";

// ------------------------ BUTTON ------------------------
export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "danger" }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700",
        variant === "danger" &&
          "bg-red-600 text-white border border-red-500/30 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
        className
      )}
      {...props}
    />
  );
}

// ------------------------ INPUT ------------------------
export function Input(props: ComponentProps<"input">) {
  return (
    <input
      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      {...props}
    />
  );
}

// ------------------------ TEXTAREA ------------------------
export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
      {...props}
    />
  );
}

// ------------------------ SELECT ------------------------
export function Select(props: ComponentProps<"select">) {
  return (
    <select
      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      {...props}
    />
  );
}
