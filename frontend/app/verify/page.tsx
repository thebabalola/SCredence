"use client";

import { useState } from "react";
import { Search, ShieldCheck, XCircle, AlertTriangle, CheckCircle } from "lucide-react";

export default function VerifyPage() {
  const [proofId, setProofId] = useState("");
  const [hash, setHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setResult(null);

    // Simulate contract call delay
    setTimeout(() => {
      // Mock data for demonstration
      if (proofId === "1") {
        setResult({
          isValid: true,
          isRevoked: false,
          isExpired: false,
          participant: "SP1Y06...BWRQQJ9",
          issuer: "Andela Nigeria",
          serviceType: "Internship",
          issuedAt: "Jan 15, 2024",
        });
      } else if (proofId === "2") {
        setResult({
          isValid: false,
          isRevoked: true,
          isExpired: false,
          reason: "Information mismatch",
          participant: "SP3FD...GY3WJQTM",
          issuer: "Cisco Networking",
        });
      } else {
        setResult({
          error: "Proof not found on-chain.",
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Verify Service Proof
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Enter the unique credentials to verify authenticity on the Stacks blockchain.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="proofId" className="text-sm font-semibold text-slate-700">
                  Proof ID
                </label>
                <input
                  id="proofId"
                  type="text"
                  placeholder="e.g. 1"
                  className="rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={proofId}
                  onChange={(e) => setProofId(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="hash" className="text-sm font-semibold text-slate-700">
                  Credential Hash
                </label>
                <input
                  id="hash"
                  type="text"
                  placeholder="0x..."
                  className="rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Verify Authenticity
                </>
              )}
            </button>
          </form>
        </section>

        {result && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            {result.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                <XCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
                <h3 className="font-bold text-lg">Verification Failed</h3>
                <p className="mt-1">{result.error}</p>
              </div>
            ) : (
              <div className={`rounded-2xl border p-6 ${result.isValid ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-center gap-4 mb-6">
                  {result.isValid ? (
                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                  )}
                  <div>
                    <h3 className={`text-xl font-bold ${result.isValid ? 'text-emerald-900' : 'text-amber-900'}`}>
                      {result.isValid ? 'Valid Credential' : 'Invalid / Revoked'}
                    </h3>
                    <p className={`text-sm ${result.isValid ? 'text-emerald-700' : 'text-amber-700'}`}>
                      Verified on Stacks Block #782,104
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="font-semibold text-slate-500 uppercase tracking-wide text-xs">Participant</p>
                    <p className="mt-1 font-medium text-slate-900">{result.participant}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500 uppercase tracking-wide text-xs">Issuer</p>
                    <p className="mt-1 font-medium text-slate-900">{result.issuer}</p>
                  </div>
                  {result.serviceType && (
                    <div>
                      <p className="font-semibold text-slate-500 uppercase tracking-wide text-xs">Service Type</p>
                      <p className="mt-1 font-medium text-slate-900">{result.serviceType}</p>
                    </div>
                  )}
                  {result.issuedAt && (
                    <div>
                      <p className="font-semibold text-slate-500 uppercase tracking-wide text-xs">Issued Date</p>
                      <p className="mt-1 font-medium text-slate-900">{result.issuedAt}</p>
                    </div>
                  )}
                  {result.isRevoked && (
                    <div className="col-span-full mt-2 pt-4 border-t border-amber-200">
                      <p className="font-semibold text-amber-800">Revocation Reason</p>
                      <p className="mt-1 text-amber-700">{result.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
