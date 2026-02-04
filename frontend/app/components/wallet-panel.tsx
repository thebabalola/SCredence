"use client";

import { useMemo } from "react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { Shield, Wallet, RefreshCw, LogOut, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function formatAddress(address?: string | null) {
  if (!address || typeof address !== 'string') return "—";
  return address.length <= 10
    ? address
    : `${address.slice(0, 6)}…${address.slice(address.length - 6)}`;
}

export function WalletPanel() {
  const {
    status,
    providerName,
    isLoading,
    isPending,
    isConnected,
    stxAddress,
    btcAddress,
    error,
    connect,
    disconnect,
    refresh,
  } = useStacks();

  const statusCopy = useMemo(() => {
    switch (status) {
      case "connected": return "Identity Secure";
      case "pending": return "Authorizing...";
      case "error": return "Auth Failed";
      case "disconnected": return "Wallet Disconnected";
      default: return "Initializing";
    }
  }, [status]);

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{statusCopy}</p>
          </div>
          <p className="text-3xl font-black text-white italic uppercase tracking-tighter">
            {isConnected ? "Welcome back" : "Get Started"}
          </p>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={refresh}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
          
          {isConnected && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={disconnect}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </motion.button>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-6">
          <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              Connect your Stacks wallet to issue credentials or view your professional proof vault.
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={connect}
            disabled={isLoading || isPending}
            className="w-full flex items-center justify-center gap-3 py-6 rounded-[24px] bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Wallet className="w-6 h-6" />
                Connect Identity
              </>
            )}
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-colors">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors">STX Network</p>
            <p className="font-mono text-sm text-white select-all">{formatAddress(stxAddress)}</p>
          </div>
          <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-colors">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-amber-500 transition-colors">BTC Layer</p>
            <p className="font-mono text-sm text-white select-all">{formatAddress(btcAddress)}</p>
          </div>
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
