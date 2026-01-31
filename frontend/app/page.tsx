"use client";

import { WalletPanel } from "./components/wallet-panel";
import { useStacks } from "@/lib/hooks/use-stacks";
import Link from "next/link";
import { ShieldCheck, Search, ArrowRight, FileCheck, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected } = useStacks();

  const features = [
    {
      title: "Issuer Dashboard",
      desc: "Organizations can register and manage official service verification records.",
      tip: "For organizations to issue credentials.",
      href: "/issuers",
      icon: ShieldCheck,
      color: "from-orange-500/20 to-orange-500/5",
      iconColor: "text-orange-500",
    },
    {
      title: "Verify Proof",
      desc: "Anyone can instantly verify the authenticity of a credential hash on-chain.",
      tip: "For anyone to verify a document.",
      href: "/verify",
      icon: Search,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      title: "My Proofs",
      desc: "View and manage all service verifications associated with your identity.",
      tip: "For individuals to view their history.",
      href: "/proofs",
      icon: FileCheck,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-500",
    }
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground relative overflow-hidden flex flex-col items-center justify-center">
      {/* Morphing Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 20% 80% 50% 50%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/10 blur-3xl pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%"]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-primary/5 blur-3xl pointer-events-none z-0"
      />
      
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12 md:py-20 relative z-10 w-full">
        <header className="flex flex-col gap-6 text-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Bitcoin-Anchored Trust
            </span>
          </motion.div>
          
          <div className="space-y-4 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground"
            >
              {isConnected ? (
                <>Identity <span className="text-primary italic">Verified.</span></>
              ) : (
                <>Digital <span className="text-primary italic text-6xl md:text-8xl block font-black">SCredence.</span></>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {isConnected 
                ? "Your Stacks wallet is connected. Manage your credentials or verify proof of service instantly below."
                : "The professional verification layer for the Bitcoin ecosystem. Issue and verify immutable proofs on Stacks."}
            </motion.p>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {isConnected ? (
            features.map((feat, idx) => (
              <Link 
                key={feat.href}
                href={feat.href}
                className="group relative flex flex-col gap-5 p-8 rounded-[40px] border border-border bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all shadow-sm hover:shadow-2xl hover:shadow-primary/5 overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center ${feat.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                  <feat.icon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors italic uppercase tracking-tighter">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                {/* Info Tip */}
                <div className="mt-auto pt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 w-fit group-hover:border-primary/20 transition-colors">
                    <Info className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">
                      {feat.tip}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Get Started <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
                
                {/* Decorative cut-out shadow effect */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
              </Link>
            ))
          ) : (
            <div className="col-span-full max-w-2xl mx-auto w-full">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-8 md:p-12 rounded-[48px] border-2 border-border bg-card shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:bg-primary/20 transition-colors duration-1000" />
                <div className="relative z-10">
                  <WalletPanel />
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
