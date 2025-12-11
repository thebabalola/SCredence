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

    it("should not allow non-owner to initialize", () => {
      const result = simnet.callPublicFn(
        contractName,
        "initialize",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(100)); // ERR_NOT_OWNER
    });

    it("should prevent re-initialization", () => {
      // First initialization
      const init1 = simnet.callPublicFn(
        contractName,
        "initialize",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(init1.result).toBeOk(Cl.bool(true));

      // Attempt second initialization
      const init2 = simnet.callPublicFn(
        contractName,
        "initialize",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(init2.result).toBeErr(Cl.uint(101)); // ERR_ALREADY_INITIALIZED
    });
  });

  describe("Price Updates", () => {
    it("should allow updater to update price", () => {
      // Initialize first
      const init = simnet.callPublicFn(
        contractName,
        "initialize",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(init.result).toBeOk(Cl.bool(true));

      // Update price as updater
      const newPrice = Cl.uint(50000);
      const result = simnet.callPublicFn(
        contractName,
        "update-price",
        [newPrice],
        wallet1
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Verify price was updated
      const price = simnet.callReadOnlyFn(
        contractName,
        "get-price",
        [],
        deployer
      );
      expect(price.result).toBeOk(newPrice);
    });
  });
});

