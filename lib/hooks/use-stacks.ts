import { useEffect, useMemo, useRef, useState } from "react";

export type WalletStatus =
  | "idle"
  | "pending"
  | "connected"
  | "disconnected"
  | "error";

export type WalletAddresses = {
  mainnet?: string;
  testnet?: string;
  btc?: string;
};

export type WalletProfile = {
  username?: string | null;
  avatarUrl?: string | null;
  raw?: unknown;
};

export type WalletState = {
  status: WalletStatus;
  addresses: WalletAddresses;
  profile?: WalletProfile;
  error?: string | null;
  providerName?: string | null;
  isLoading: boolean;
};

export type ConnectWallet = () => Promise<void>;
export type DisconnectWallet = () => Promise<void>;
export type RefreshWallet = () => Promise<void>;

export type UseStacksResult = WalletState & {
  connect: ConnectWallet;
  disconnect: DisconnectWallet;
  refresh: RefreshWallet;
};

const initialState: WalletState = {
  status: "idle",
  addresses: {},
  profile: undefined,
  error: null,
  providerName: null,
  isLoading: true,
};

export function useStacks(): UseStacksResult {
  const [state, setState] = useState<WalletState>(initialState);
  const hasHydrated = useRef(false);

  useEffect(() => {
    hasHydrated.current = true;
  }, []);

  const connect = useMemo<ConnectWallet>(
    () => async () => {
      setState((prev) => ({ ...prev, status: "pending" }));
    },
    [],
  );

  const disconnect = useMemo<DisconnectWallet>(
    () => async () => {
      setState((prev) => ({ ...prev, status: "disconnected" }));
    },
    [],
  );

  const refresh = useMemo<RefreshWallet>(
    () => async () => {
      if (!hasHydrated.current) return;
      setState((prev) => ({ ...prev }));
    },
    [],
  );

  return {
    ...state,
    connect,
    disconnect,
    refresh,
  };
}
