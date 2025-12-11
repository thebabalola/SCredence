import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const contractName = "mock-oracle";

describe("Mock Oracle Contract Tests", () => {
  describe("Initialization", () => {
    it("should initialize with correct owner and updater", () => {
      const result = simnet.callPublicFn(
        contractName,
        "initialize",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(result.result).toBeOk(Cl.bool(true));
      
      // Verify initialized status
      const isInitialized = simnet.callReadOnlyFn(
        contractName,
        "is-initialized",
        [],
        deployer
      );
      expect(isInitialized.result).toBeOk(Cl.bool(true));
      
      // Verify updater is set correctly
      const updater = simnet.callReadOnlyFn(
        contractName,
        "get-updater",
        [],
        deployer
      );
      expect(updater.result).toBeSome(Cl.principal(wallet1));
    });
  });
});

