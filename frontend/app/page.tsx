"use client";

import { WalletPanel } from "./components/wallet-panel";
import { useStacks } from "@/lib/hooks/use-stacks";
import Link from "next/link";
import { ShieldCheck, Search, FileCheck, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { isConnected } = useStacks();

  const features = [
    {
      title: "Issuer Dashboard",
      desc: "Organizations can register and manage official service verification records.",
      href: "/issuers",
      icon: ShieldCheck,
      action: "Open Dashboard",
      id: "issuer-card"
    },
    {
      title: "Verify Proof",
      desc: "Anyone can instantly verify the authenticity of a credential hash on-chain.",
      href: "/verify",
      icon: Search,
      action: "Open Tool",
      id: "verify-card"
    },
    {
      title: "My Proofs",
      desc: "View and manage all service verifications associated with your identity.",
      href: "/proofs",
      icon: FileCheck,
      action: "View Vault",
      id: "proofs-card"
    }
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#0B0E14] text-foreground relative overflow-hidden flex flex-col justify-center">
      {/* Background Gradients - Shape Morphing feel */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -mr-96 -mt-96 pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none z-0" 
      />
      
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-12 md:py-20 relative z-10 w-full">
        <header className="flex flex-col gap-8 text-left items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 w-fit bg-primary/10 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              Bitcoin-Anchored Trust
            </span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.95] max-w-4xl"
            >
              {isConnected ? (
                <>Welcome back to <br /><span className="text-primary italic">SCredence</span></>
              ) : (
                <>Trustless <br /><span className="text-primary italic">Verification</span></>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed font-medium"
            >
              {isConnected 
                ? "Your identity is connected. Explore the dashboard or verify a new credential instantly."
                : "The professional verification layer for the Bitcoin ecosystem. Issue and verify immutable proofs on Stacks."}
            </motion.p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div 
              key="features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            >
              {features.map((feat, i) => (
                <motion.div
                  key={feat.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -10 }}
                  layoutId={feat.id}
                >
                  <Link 
                    href={feat.href}
                    className="group relative flex flex-col gap-10 p-10 rounded-[48px] border border-white/5 bg-[#0F172A]/40 hover:bg-[#0F172A]/80 hover:border-primary/50 transition-all duration-500 shadow-2xl overflow-hidden backdrop-blur-2xl h-full border-b-4 border-b-white/5 hover:border-b-primary shadow-black/50"
                  >
                    {/* Zoom Match Cut Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-primary opacity-0 group-active:opacity-10 transition-opacity"
                      layoutId={`zoom-${feat.id}`}
                    />
                    
                    <div className="relative z-10">
                      <motion.div 
                        layoutId={`icon-box-${feat.id}`}
                        className="p-5 bg-primary/10 rounded-[28px] text-primary w-fit border border-primary/20 shadow-[inset_0_0_30px_rgba(249,115,22,0.1)] group-hover:rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-500"
                      >
                        <feat.icon className="w-8 h-8" />
                      </motion.div>
                    </div>

                    <div className="space-y-4 relative z-10 flex-grow">
                      <motion.h3 
                        layoutId={`title-${feat.id}`}
                        className="text-3xl font-black text-white italic tracking-tighter uppercase leading-[0.9] group-hover:text-primary transition-colors"
                      >
                        {feat.title.split(' ').map((word, idx) => (
                          <span key={idx} className="block">{word}</span>
                        ))}
                      </motion.h3>
                      <p className="text-base text-slate-400 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        {feat.desc}
                      </p>
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 0.3, x: 0 }}
                        whileHover={{ opacity: 1, x: 5 }}
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-primary"
                      >
                        {feat.action} <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>

                    {/* Shape Morphing Decorative Background */}
                    <motion.div 
                      animate={{ 
                        borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                        rotate: [0, 90, 0]
                      }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/5 blur-[60px] group-hover:bg-primary/20 transition-all duration-1000 pointer-events-none" 
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="col-span-full max-w-2xl mx-auto md:mx-0 w-full"
            >
              <div className="p-12 md:p-20 rounded-[80px] border border-white/10 bg-[#0F172A]/40 shadow-[0_0_120px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl shadow-black">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none" />
                 <div className="relative z-10 scale-110 md:scale-125 origin-top-left py-8">
                    <WalletPanel />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
