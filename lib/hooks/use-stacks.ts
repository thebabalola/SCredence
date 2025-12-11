import type { UserData } from "@stacks/auth";
import { AppConfig, UserSession } from "@stacks/auth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const userSessionRef = useRef<UserSession | null>(null);

  const isBrowser = typeof window !== "undefined";

  const getUserSession = useCallback(() => {
    if (!isBrowser) return null;
    if (userSessionRef.current) return userSessionRef.current;

    const appConfig = new AppConfig(["store_write"]);
    userSessionRef.current = new UserSession({ appConfig });
    return userSessionRef.current;
  }, [isBrowser]);

  const parseAddresses = useCallback((userData?: UserData | null) => {
    if (!userData) return {};
    const profile = userData.profile as Record<string, any>;
    const stxAddress =
      profile?.stxAddress ??
      profile?.stx_address ??
      profile?.addresses?.stx ??
      {};

    return {
      mainnet: stxAddress.mainnet || stxAddress.mainnetAddress,
      testnet: stxAddress.testnet || stxAddress.testnetAddress,
      btc: profile?.btcAddress || profile?.btc || profile?.btc_address,
    } satisfies WalletAddresses;
  }, []);

  const parseProfile = useCallback((userData?: UserData | null) => {
    if (!userData) return undefined;
    const profile = userData.profile as Record<string, any>;
    return {
      username: (userData as any).username ?? profile?.username ?? null,
      avatarUrl: profile?.image?.[0]?.contentUrl ?? null,
      raw: profile,
    } satisfies WalletProfile;
  }, []);

  const setConnectedState = useCallback(
    (userData: UserData | null) => {
      setState({
        status: userData ? "connected" : "disconnected",
        addresses: parseAddresses(userData),
        profile: parseProfile(userData),
        providerName: state.providerName ?? null,
        error: null,
        isLoading: false,
      });
    },
    [parseAddresses, parseProfile, state.providerName],
  );

  useEffect(() => {
    hasHydrated.current = true;
    if (!isBrowser) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [isBrowser]);

  const bootstrapSession = useCallback(async () => {
    const session = getUserSession();
    if (!session) {
      setState((prev) => ({
        ...prev,
        status: "disconnected",
        isLoading: false,
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      if (session.isSignInPending()) {
        setState((prev) => ({ ...prev, status: "pending" }));
        const userData = await session.handlePendingSignIn();
        setConnectedState(userData);
        return;
      }

      if (session.isUserSignedIn()) {
        const userData = await session.loadUserData();
        setConnectedState(userData);
        return;
      }

      setState((prev) => ({
        ...prev,
        status: "disconnected",
        isLoading: false,
        addresses: {},
        profile: undefined,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      }));
    }
  }, [getUserSession, setConnectedState]);

  useEffect(() => {
    if (!isBrowser) return;
    void bootstrapSession();
  }, [bootstrapSession, isBrowser]);

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
