import { WalletPanel } from "./components/wallet-panel";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            SCredence
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-foreground">
            Connect your Stacks wallet
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Use the wallet panel below to connect, disconnect, and reload your
            session. The hook tracks pending sign-in flows and persists your
            addresses so the app can hydrate immediately.
          </p>
        </header>

        <section>
          <WalletPanel />
        </section>
      </div>
    </main>
  );
}
