"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStacks } from "@/lib/hooks/use-stacks";

import { ThemeToggle } from "./ui/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, stxAddress, connect, disconnect } = useStacks();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Issuers", href: "/issuers" },
    { name: "Proofs", href: "/proofs" },
    { name: "Verify", href: "/verify" },
  ];

  function formatAddress(address?: string | null) {
    if (!address) return "";
    return `${address.slice(0, 5)}…${address.slice(address.length - 5)}`;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            SCredence
          </Link>
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isConnected ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-mono text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                {formatAddress(stxAddress)}
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground transition hover:bg-secondary/80"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={connect}
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
