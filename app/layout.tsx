import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Technician Work Orders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-zinc-900 backdrop-blur-sm transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Work Orders
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-3">
              <Link
                href="/work-orders/new"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-sm sm:text-base transition"
              >
                Add New Order
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 transition-colors">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
