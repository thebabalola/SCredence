"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStacks } from "@/lib/hooks/use-stacks";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, stxAddress, connect, disconnect } = useStacks();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Issuers", href: "/issuers" },
    { name: "Proofs", href: "/proofs" },
  ];

  function formatAddress(address?: string | null) {
    if (!address) return "";
    return `${address.slice(0, 5)}…${address.slice(address.length - 5)}`;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
            SCredence
          </Link>
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  pathname === item.href ? "text-indigo-600" : "text-slate-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {formatAddress(stxAddress)}
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={connect}
              className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
