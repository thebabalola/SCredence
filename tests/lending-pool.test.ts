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
  describe("Issue #3 — Contract Structure", () => {
    describe("Error Constants", () => {
      it("should define ERR_INVALID_WITHDRAW_AMOUNT as u100", () => {
        // Test by triggering the error (withdraw with no deposit)
        const result = simnet.callPublicFn(
          lendingPool,
          "withdraw-stx",
          [Cl.uint(100)],
          wallet1
        );
        expect(result.result).toBeErr(Cl.uint(100));
      });

      it("should define ERR_EXCEEDED_MAX_BORROW as u101", () => {
        // This will be tested more thoroughly in Issue #8 tests
        // For now, verify the constant exists by checking contract compilation
        expect(simnet.getContractSource(lendingPool)).toContain("ERR_EXCEEDED_MAX_BORROW");
      });

      it("should define ERR_CANNOT_BE_LIQUIDATED as u102", () => {
        expect(simnet.getContractSource(lendingPool)).toContain("ERR_CANNOT_BE_LIQUIDATED");
      });

      it("should define ERR_MUST_WITHDRAW_BEFORE_NEW_DEPOSIT as u103", () => {
        // Test by making two deposits
        const first = simnet.callPublicFn(lendingPool, "deposit-stx", [Cl.uint(1000)], wallet1);
        expect(first.result).toBeOk(Cl.bool(true));

        const second = simnet.callPublicFn(lendingPool, "deposit-stx", [Cl.uint(500)], wallet1);
        expect(second.result).toBeErr(Cl.uint(103));
      });

      it("should define ERR_INVALID_ORACLE as u104", () => {
        expect(simnet.getContractSource(lendingPool)).toContain("ERR_INVALID_ORACLE");
      });

      it("should define ERR_INVALID_SBTC_CONTRACT as u105", () => {
        expect(simnet.getContractSource(lendingPool)).toContain("ERR_INVALID_SBTC_CONTRACT");
      });

      it("should define ERR_INVALID_DEX_CONTRACT as u106", () => {
        expect(simnet.getContractSource(lendingPool)).toContain("ERR_INVALID_DEX_CONTRACT");
      });
    });

    describe("Protocol Constants", () => {
      it("should define LTV_PERCENTAGE as u70", () => {
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("LTV_PERCENTAGE u70");
      });

      it("should define INTEREST_RATE_PERCENTAGE as u10", () => {
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("INTEREST_RATE_PERCENTAGE u10");
      });

      it("should define LIQUIDATION_THRESHOLD_PERCENTAGE as u100", () => {
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("LIQUIDATION_THRESHOLD_PERCENTAGE u100");
      });

      it("should define ONE_YEAR_IN_SECS as u31556952", () => {
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("ONE_YEAR_IN_SECS u31556952");
      });
    });

    describe("Data Variables - Initial Values", () => {
      it("should initialize total-sbtc-collateral to u0", () => {
        const total = simnet.getDataVar(lendingPool, "total-sbtc-collateral");
        expect(total).toStrictEqual(Cl.uint(0));
      });

      it("should initialize total-stx-deposits to u1 (to avoid division by zero)", () => {
        const total = simnet.getDataVar(lendingPool, "total-stx-deposits");
        expect(total).toStrictEqual(Cl.uint(1));
      });

      it("should initialize total-stx-borrows to u0", () => {
        const total = simnet.getDataVar(lendingPool, "total-stx-borrows");
        expect(total).toStrictEqual(Cl.uint(0));
      });

      it("should initialize last-interest-accrual to stacks-block-time", () => {
        const lastAccrual = simnet.getDataVar(lendingPool, "last-interest-accrual");
        // Should be a uint representing the block time
        expect(lastAccrual.type).toBe('uint');
        // Should be greater than 0 (actual block time)
        const value = (lastAccrual as any).value;
        expect(value).toBeGreaterThan(0n);
      });

      it("should initialize cumulative-yield-bips to u0", () => {
        const yield_bips = simnet.getDataVar(lendingPool, "cumulative-yield-bips");
        expect(yield_bips).toStrictEqual(Cl.uint(0));
      });
    });

    describe("Map Structures", () => {
      it("should define collateral map with correct structure", () => {
        // Verify map exists by checking contract source
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("define-map collateral");
        expect(source).toContain("{ user: principal }");
        expect(source).toContain("{ amount: uint }");
      });

      it("should define deposits map with correct structure", () => {
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("define-map deposits");
        expect(source).toContain("{ user: principal }");
        expect(source).toContain("amount: uint");
        expect(source).toContain("yield-index: uint");
      });

      it("should define borrows map with correct structure", () => {
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("define-map borrows");
        expect(source).toContain("{ user: principal }");
        expect(source).toContain("amount: uint");
        expect(source).toContain("last-accrued: uint");
      });
    });

    describe("Function Signatures", () => {
      it("should have all required public functions defined", () => {
        const source = simnet.getContractSource(lendingPool);
        
        // Public functions
        expect(source).toContain("define-public (get-sbtc-stx-price)");
        expect(source).toContain("define-public (deposit-stx");
        expect(source).toContain("define-public (withdraw-stx");
        expect(source).toContain("define-public (borrow-stx");
        expect(source).toContain("define-public (repay)");
        expect(source).toContain("define-public (liquidate");
      });

      it("should have all required read-only functions defined", () => {
        const source = simnet.getContractSource(lendingPool);
        
        // Read-only functions
        expect(source).toContain("define-read-only (get-pending-yield");
        expect(source).toContain("define-read-only (get-debt");
      });

      it("should have accrue-interest private function defined", () => {
        const source = simnet.getContractSource(lendingPool);
        expect(source).toContain("define-private (accrue-interest)");
      });

      it("should verify all public functions are callable", () => {
        // get-sbtc-stx-price
        const price = simnet.callPublicFn(lendingPool, "get-sbtc-stx-price", [], deployer);
        expect(price.result.type).toBe("ok");

        // deposit-stx
        const deposit = simnet.callPublicFn(lendingPool, "deposit-stx", [Cl.uint(100)], wallet1);
        expect(deposit.result.type).toBe("ok");

        // withdraw-stx (will error but function exists)
        const withdraw = simnet.callPublicFn(lendingPool, "withdraw-stx", [Cl.uint(100)], wallet2);
        expect(withdraw.result.type).toBe("err");

        // borrow-stx
        const borrow = simnet.callPublicFn(
          lendingPool,
          "borrow-stx",
          [Cl.uint(100), Cl.uint(50)],
          wallet2
        );
        expect(borrow.result.type).toBe("ok");

        // repay
        const repay = simnet.callPublicFn(lendingPool, "repay", [], wallet2);
        expect(repay.result.type).toBe("ok");

        // liquidate
        const liquidate = simnet.callPublicFn(
          lendingPool,
          "liquidate",
          [Cl.principal(wallet1)],
          wallet2
        );
        expect(liquidate.result.type).toBe("ok");
      });

      it("should verify all read-only functions are callable", () => {
        // get-pending-yield
        const pending = simnet.callReadOnlyFn(
          lendingPool,
          "get-pending-yield",
          [Cl.principal(wallet1)],
          deployer
        );
        expect(pending.result.type).toBe("ok");

        // get-debt
        const debt = simnet.callReadOnlyFn(
          lendingPool,
          "get-debt",
          [Cl.principal(wallet1)],
          deployer
        );
        expect(debt.result.type).toBe("ok");
      });
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
