"use client";

import { WalletPanel } from "./components/wallet-panel";
import { useStacks } from "@/lib/hooks/use-stacks";
import Link from "next/link";
import { ShieldCheck, Search, FileCheck, Info, ArrowRight } from "lucide-react";

export default function Home() {
  const { isConnected } = useStacks();

  const features = [
    {
      title: "Issuer Dashboard",
      desc: "Organizations can register and manage official service verification records.",
      href: "/issuers",
      icon: ShieldCheck,
    },
    {
      title: "Verify Proof",
      desc: "Anyone can instantly verify the authenticity of a credential hash on-chain.",
      href: "/verify",
      icon: Search,
    },
    {
      title: "My Proofs",
      desc: "View and manage all service verifications associated with your identity.",
      href: "/proofs",
      icon: FileCheck,
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 md:py-28">
        
        {/* Top Badge & Header */}
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 w-fit bg-primary/5">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Protocol v1.0 Live
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              {isConnected ? (
                <>Welcome back to <br /><span className="text-primary italic">SCredence</span></>
              ) : (
                <>Trustless <br /><span className="text-primary italic">Verification</span></>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl">
              {isConnected 
                ? "Your identity is connected. Explore the dashboard or verify a new credential instantly."
                : "The professional verification layer for the Bitcoin ecosystem. Issue and verify immutable proofs on Stacks."}
            </p>
          </div>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isConnected ? (
            features.map((feat) => (
              <Link 
                key={feat.href}
                href={feat.href}
                className="group flex flex-col gap-6 p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/30 transition-all shadow-2xl"
              >
                <div className="p-3 bg-primary/10 rounded-xl text-primary w-fit group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full max-w-xl">
              <WalletPanel />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
