import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-12 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Nadin Learning
      </h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        A gamified, hands-on way for nine-year-olds to learn physics and
        chemistry with Nadin as their guide.
      </p>
      <Link
        href="/play"
        className="rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Open the hello scene →
      </Link>
      <p className="text-xs text-zinc-500">
        Built for iPad (1024×768 landscape). No telemetry on kid sessions.
      </p>
    </main>
  );
}
