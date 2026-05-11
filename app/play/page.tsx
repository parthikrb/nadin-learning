import Link from "next/link";
import HelloScene from "@/components/HelloScene";

export const metadata = {
  title: "Hello scene · Nadin Learning",
};

export default function PlayPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-1 flex-col bg-sky-100 dark:bg-slate-900">
      <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-4 text-sm">
        <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-900 shadow-sm dark:bg-slate-800/80 dark:text-slate-100">
          Nadin · hello scene
        </span>
        <Link
          href="/"
          className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-900 shadow-sm hover:bg-white dark:bg-slate-800/80 dark:text-slate-100"
        >
          ← back
        </Link>
      </header>
      <HelloScene />
    </main>
  );
}
