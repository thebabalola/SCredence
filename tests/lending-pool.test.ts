import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

/**
 * Lending Pool Contract Tests
 *
 * Covers:
 * - Issue #3: structure / storage / basic getters (sanity checks)
 * - Issue #4: helper price call (get-sbtc-stx-price calling oracle)
 * - Issue #5: deposit-stx behavior (first deposit works, second deposit blocked)
 *
 * Notes:
 * - In this repo, the deployed contract name is `stackslend-v1` (lending pool)
 * - The oracle contract is `mock-oracle-v1`
 * - These tests run in Clarinet simnet via vitest-environment-clarinet
 */

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const lendingPool = "stackslend-v1";
const oracle = "mock-oracle-v1";

describe("Lending Pool Contract Tests", () => {
  describe("Issue #3 — Contract structure sanity", () => {
    it("should expose counter read-only getter (temp test block) and start at 0", () => {
      const res = simnet.callReadOnlyFn(lendingPool, "get-counter", [], deployer);
      expect(res.result).toBeOk(Cl.uint(0));
    });

    it("should increment and decrement counter", () => {
      const inc1 = simnet.callPublicFn(lendingPool, "increment-counter", [], wallet1);
      expect(inc1.result).toBeOk(Cl.uint(1));

      const inc2 = simnet.callPublicFn(lendingPool, "increment-counter", [], wallet1);
      expect(inc2.result).toBeOk(Cl.uint(2));

      const dec1 = simnet.callPublicFn(lendingPool, "decrement-counter", [], wallet1);
      expect(dec1.result).toBeOk(Cl.uint(1));

      const dec2 = simnet.callPublicFn(lendingPool, "decrement-counter", [], wallet1);
      expect(dec2.result).toBeOk(Cl.uint(0));

      // should clamp at 0
      const dec3 = simnet.callPublicFn(lendingPool, "decrement-counter", [], wallet1);
      expect(dec3.result).toBeOk(Cl.uint(0));
    });

    it("should have get-pending-yield and get-debt read-only functions callable (even if stubbed)", () => {
      const pending = simnet.callReadOnlyFn(
        lendingPool,
        "get-pending-yield",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(pending.result.type).toBe("ok");

      const debt = simnet.callReadOnlyFn(
        lendingPool,
        "get-debt",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(debt.result.type).toBe("ok");
    });
  });

  describe("Issue #4 — Helper function: get-sbtc-stx-price", () => {
    it("should return price from oracle (after oracle is initialized and updated)", () => {
      // initialize oracle updater = wallet1
      const init = simnet.callPublicFn(
        oracle,
        "initialize",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(init.result).toBeOk(Cl.bool(true));

      // set price as wallet1 (updater)
      const newPrice = Cl.uint(123456);
      const upd = simnet.callPublicFn(oracle, "update-price", [newPrice], wallet1);
      expect(upd.result).toBeOk(Cl.bool(true));

      // call helper in lending pool
      const res = simnet.callPublicFn(lendingPool, "get-sbtc-stx-price", [], wallet2);

      // oracle get-price returns (ok uint), so lending helper should also return (ok uint)
      expect(res.result).toBeOk(newPrice);
    });
  });

  describe("Issue #5 — deposit-stx behavior", () => {
    it("should allow first STX deposit", () => {
      const amount = Cl.uint(1000);

      const res = simnet.callPublicFn(lendingPool, "deposit-stx", [amount], wallet1);

      // deposit-stx returns (ok true)
      expect(res.result).toBeOk(Cl.bool(true));
    });

    it("should prevent depositing again without withdrawing (ERR_MUST_WITHDRAW_BEFORE_NEW_DEPOSIT)", () => {
      const amount1 = Cl.uint(1000);
      const amount2 = Cl.uint(500);

      const first = simnet.callPublicFn(lendingPool, "deposit-stx", [amount1], wallet1);
      expect(first.result).toBeOk(Cl.bool(true));

      const second = simnet.callPublicFn(lendingPool, "deposit-stx", [amount2], wallet1);

      // ERR_MUST_WITHDRAW_BEFORE_NEW_DEPOSIT = err u103
      expect(second.result).toBeErr(Cl.uint(103));
    });
  });
});
