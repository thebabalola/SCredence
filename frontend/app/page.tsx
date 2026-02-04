"use client";

import { WalletPanel } from "./components/wallet-panel";
import { useStacks } from "@/lib/hooks/use-stacks";
import Link from "next/link";
import { ShieldCheck, Search, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <main className="min-h-[calc(100vh-4rem)] bg-[#0B0E14] text-white relative overflow-hidden flex flex-col justify-center">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 md:py-24 relative z-10 w-full">
        <header className="flex flex-col gap-8 text-left items-start">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#FF4444]/50 w-fit bg-[#FF4444]/10"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF4444]">
              Protocol v1.0 Live
            </span>
          </motion.div>
          
          {/* Heading */}
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight"
            >
              Welcome back to
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black italic tracking-tight text-[#FF4444] leading-tight"
            >
              sCredence
            </motion.h1>
          </div>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed"
          >
            Your identity is connected. Explore the dashboard or verify a new credential instantly.
          </motion.p>
        </header>

        {/* Feature Cards */}
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div 
              key="features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
            >
              {features.map((feat, i) => (
                <motion.div
                  key={feat.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                >
                  <Link 
                    href={feat.href}
                    className="group flex flex-col gap-6 p-8 rounded-2xl border border-[#FF4444]/30 bg-[#0F172A]/60 hover:bg-[#0F172A]/80 hover:border-[#FF4444]/60 transition-all duration-300 backdrop-blur-sm h-full"
                  >
                    {/* Icon */}
                    <div className="p-3 bg-[#FF4444]/15 rounded-lg w-fit group-hover:bg-[#FF4444]/25 transition-colors">
                      <feat.icon className="w-6 h-6 text-[#FF4444]" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3 flex-grow">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#FF4444] transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl w-full"
            >
              <div className="p-8 rounded-2xl border border-white/10 bg-[#0F172A]/40 backdrop-blur-sm">
                <WalletPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
