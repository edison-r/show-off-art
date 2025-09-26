"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-transparent backdrop-blur border-b border-blue-grey-ghost">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white font-mono text-xs">S</span>
          <span className="font-grotesk tracking-wide">show-off</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#work" className="hover:underline">work</Link>
          <Link href="#about" className="hover:underline">about</Link>
          <Link href="#contact" className="hover:underline">contact</Link>
        </nav>
        <Link
          href="/join"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-200"
        >
          join us
        </Link>
      </div>
    </header>
  );
}
