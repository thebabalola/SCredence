"use client";

import { useStacks } from "@/lib/hooks/use-stacks";
import { Plus, ShieldCheck, Users, ExternalLink } from "lucide-react";

export default function IssuersPage() {
  const { isConnected } = useStacks();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Issuer Dashboard
            </h1>
            <p className="mt-1 text-lg text-slate-600">
              Manage authorized organizations and issue service proofs.
            </p>
          </div>
          {isConnected && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Register New Issuer
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Issuers</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Participants</p>
                <p className="text-2xl font-bold text-slate-900">1,204</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Proofs</p>
                <p className="text-2xl font-bold text-slate-900">45</p>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Registered Issuers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Organization</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Wallet</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { name: "Andela Nigeria", category: "Tech Training", status: "Active", wallet: "SP1Y...BWRQQJ9" },
                  { name: "Cisco Networking", category: "Certification", status: "Active", wallet: "SP3F...GY3WJQTM" },
                  { name: "HNG Internship", category: "Internship", status: "Active", wallet: "SP37...H4FHM06" },
                ].map((issuer, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{issuer.name}</td>
                    <td className="px-6 py-4">{issuer.category}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        {issuer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{issuer.wallet}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isConnected && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-slate-50/30">
              <p className="text-slate-600 font-medium">Connect your wallet to manage issuers</p>
              <p className="text-sm text-slate-500 mt-1">Authorized admins can register new organizations.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
