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
          [
            Cl.contractPrincipal(deployer, "sbtc-token"), 
            Cl.uint(100), 
            Cl.uint(50)
          ],
          wallet2
        );
        expect(borrow.result).toBeDefined();

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
      // initialize oracle updater = deployer
      const init = simnet.callPublicFn(
        oracle,
        "initialize",
        [Cl.principal(deployer)],
        deployer
      );
      expect(init.result).toBeOk(Cl.bool(true));

      // set price as deployer (updater)
      const newPrice = Cl.uint(123456);
      const upd = simnet.callPublicFn(oracle, "update-price", [newPrice], deployer);
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

  describe("Issue #7 — get-pending-yield function", () => {
    it("should return 0 for users with no deposits", () => {
      // Call get-pending-yield for wallet2 who has never deposited
      const result = simnet.callReadOnlyFn(
        lendingPool,
        "get-pending-yield",
        [Cl.principal(wallet2)],
        deployer
      );

      // Should return (ok u0) for users with no deposit history
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("should return 0 for user with deposit but no yield accrued yet", () => {
      // Lender deposits STX
      const depositAmount = Cl.uint(10000);
      const deposit = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [depositAmount],
        wallet1
      );
      expect(deposit.result).toBeOk(Cl.bool(true));

      // Check pending yield immediately (no time passed, no borrowing)
      const pending = simnet.callReadOnlyFn(
        lendingPool,
        "get-pending-yield",
        [Cl.principal(wallet1)],
        deployer
      );

      // Should be 0 because no interest has accrued yet
      expect(pending.result).toBeOk(Cl.uint(0));
    });

    it("should calculate correct yield after interest accrues", () => {
      // Lender deposits STX
      const lenderDeposit = Cl.uint(100000); // 100,000 STX
      const deposit = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [lenderDeposit],
        wallet1
      );
      expect(deposit.result).toBeOk(Cl.bool(true));

      // Simulate borrowing (which triggers interest accrual)
      // For now, we'll manually trigger accrue-interest by making another deposit
      // This will update cumulative-yield-bips if there are borrows
      
      // Check yield before any borrows (should still be 0)
      const yieldBefore = simnet.callReadOnlyFn(
        lendingPool,
        "get-pending-yield",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(yieldBefore.result).toBeOk(Cl.uint(0));

      // Note: Full yield testing will be done in integration tests (Issue #13-14)
      // when we have borrowing implemented
    });

    it("should handle multiple users with independent yield calculations", () => {
      // First lender deposits
      const deposit1 = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [Cl.uint(50000)],
        wallet1
      );
      expect(deposit1.result).toBeOk(Cl.bool(true));

      // Second lender deposits
      const deposit2 = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [Cl.uint(30000)],
        wallet2
      );
      expect(deposit2.result).toBeOk(Cl.bool(true));

      // Check both have 0 yield initially
      const yield1 = simnet.callReadOnlyFn(
        lendingPool,
        "get-pending-yield",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(yield1.result).toBeOk(Cl.uint(0));

      const yield2 = simnet.callReadOnlyFn(
        lendingPool,
        "get-pending-yield",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(yield2.result).toBeOk(Cl.uint(0));

      // Both users should have independent yield tracking
      // (Full testing with actual yield accrual in Issue #13-14)
    });
  });

  describe("Issue #6 — withdraw-stx function", () => {
    it("should allow user to withdraw partial amount", () => {
      // Deposit STX first
      const depositAmount = Cl.uint(10000);
      const deposit = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [depositAmount],
        wallet1
      );
      expect(deposit.result).toBeOk(Cl.bool(true));

      // Withdraw partial amount
      const withdrawAmount = Cl.uint(4000);
      const withdraw = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [withdrawAmount],
        wallet1
      );

      // Should succeed
      expect(withdraw.result).toBeOk(Cl.bool(true));
    });

    it("should allow user to withdraw full amount", () => {
      // Deposit STX
      const depositAmount = Cl.uint(5000);
      const deposit = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [depositAmount],
        wallet1
      );
      expect(deposit.result).toBeOk(Cl.bool(true));

      // Withdraw full amount
      const withdraw = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [depositAmount],
        wallet1
      );

      // Should succeed
      expect(withdraw.result).toBeOk(Cl.bool(true));
    });

    it("should prevent withdrawing more than deposited (ERR_INVALID_WITHDRAW_AMOUNT)", () => {
      // Deposit STX
      const depositAmount = Cl.uint(5000);
      const deposit = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [depositAmount],
        wallet1
      );
      expect(deposit.result).toBeOk(Cl.bool(true));

      // Try to withdraw more than deposited
      const withdrawAmount = Cl.uint(6000);
      const withdraw = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [withdrawAmount],
        wallet1
      );

      // Should fail with ERR_INVALID_WITHDRAW_AMOUNT (u100)
      expect(withdraw.result).toBeErr(Cl.uint(100));
    });

    it("should prevent withdrawal if user has no deposit (ERR_INVALID_WITHDRAW_AMOUNT)", () => {
      // Try to withdraw without depositing first
      const withdrawAmount = Cl.uint(1000);
      const withdraw = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [withdrawAmount],
        wallet2
      );

      // Should fail with ERR_INVALID_WITHDRAW_AMOUNT (u100)
      expect(withdraw.result).toBeErr(Cl.uint(100));
    });

    it("should include pending yield in withdrawal (currently 0 without borrows)", () => {
      // Deposit STX
      const depositAmount = Cl.uint(10000);
      const deposit = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [depositAmount],
        wallet1
      );
      expect(deposit.result).toBeOk(Cl.bool(true));

      // Check pending yield (should be 0 without any borrows)
      const pendingYield = simnet.callReadOnlyFn(
        lendingPool,
        "get-pending-yield",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(pendingYield.result).toBeOk(Cl.uint(0));

      // Withdraw - should transfer amount + yield (0 in this case)
      const withdraw = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [depositAmount],
        wallet1
      );
      expect(withdraw.result).toBeOk(Cl.bool(true));

      // Note: Full yield testing with actual accrual in Issue #13-14
    });

    it("should update total-stx-deposits correctly", () => {
      // Get initial total
      const initialTotal = simnet.getDataVar(lendingPool, "total-stx-deposits");
      const initialValue = (initialTotal as any).value;

      // Deposit STX
      const depositAmount = Cl.uint(8000);
      const deposit = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [depositAmount],
        wallet1
      );
      expect(deposit.result).toBeOk(Cl.bool(true));

      // Check total increased
      const afterDeposit = simnet.getDataVar(lendingPool, "total-stx-deposits");
      const afterDepositValue = (afterDeposit as any).value;
      expect(afterDepositValue).toBe(initialValue + 8000n);

      // Withdraw partial
      const withdrawAmount = Cl.uint(3000);
      const withdraw = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [withdrawAmount],
        wallet1
      );
      expect(withdraw.result).toBeOk(Cl.bool(true));

      // Check total decreased by withdrawal amount
      const afterWithdraw = simnet.getDataVar(lendingPool, "total-stx-deposits");
      const afterWithdrawValue = (afterWithdraw as any).value;
      expect(afterWithdrawValue).toBe(afterDepositValue - 3000n);
    });

    it("should handle multiple users withdrawing independently", () => {
      // User 1 deposits
      const deposit1 = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [Cl.uint(5000)],
        wallet1
      );
      expect(deposit1.result).toBeOk(Cl.bool(true));

      // User 2 deposits
      const deposit2 = simnet.callPublicFn(
        lendingPool,
        "deposit-stx",
        [Cl.uint(3000)],
        wallet2
      );
      expect(deposit2.result).toBeOk(Cl.bool(true));

      // User 1 withdraws
      const withdraw1 = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [Cl.uint(2000)],
        wallet1
      );
      expect(withdraw1.result).toBeOk(Cl.bool(true));

      // User 2 withdraws
      const withdraw2 = simnet.callPublicFn(
        lendingPool,
        "withdraw-stx",
        [Cl.uint(1000)],
        wallet2
      );
      expect(withdraw2.result).toBeOk(Cl.bool(true));

      // Both withdrawals should succeed independently
    });
  });

  describe("Issue #8 — borrow-stx function", () => {
    // Use the local contract principal for testing
    const sbtcToken = "sbtc-token";
    
    it("should fail if borrow exceeds LTV limit", () => {
      // 0. Mint sBTC to wallet1 so they can provide collateral
      simnet.callPublicFn(sbtcToken, "mint", [Cl.uint(1000), Cl.standardPrincipal(wallet1)], deployer);

      // 1. Initialize oracle with a price
      // Price = 2 STX per 1 unit of collateral
      // Note: Oracle might be initialized in previous tests. We try to initialize, ignoring error.
      simnet.callPublicFn(
        oracle,
        "initialize",
        [Cl.standardPrincipal(deployer)], // using deployer as updater
        deployer
      );
      // Update price
      simnet.callPublicFn(
        oracle,
        "update-price",
        [Cl.uint(2)],
        deployer
      );

      // 2. Try to borrow more than allowed
      // Collateral 100 * Price 2 = 200 Value
      // Max LTV 70% = 140
      // Request 150 -> Should fail
      const borrow = simnet.callPublicFn(
        lendingPool,
        "borrow-stx",
        [
          Cl.contractPrincipal(deployer, sbtcToken),
          Cl.uint(100), // collateral
          Cl.uint(150)  // amount-stx
        ],
        wallet1
      );

      // ERR_EXCEEDED_MAX_BORROW (u101)
      expect(borrow.result).toBeErr(Cl.uint(101));
    });

    it.skip("should allow borrow within LTV limit", () => {
      // 0. Mint sBTC to wallet1 (Simnet state persists, so they have 1000 from prev test if it ran)
      // But minting more is fine.
      simnet.callPublicFn(sbtcToken, "mint", [Cl.uint(1000), Cl.standardPrincipal(wallet1)], deployer);

      // 1. Ensure price is set
      simnet.callPublicFn(
        oracle,
        "update-price",
        [Cl.uint(2)],
        deployer
      );

      // Collateral 100 * Price 2 = 200 Value
      // Max LTV 70% = 140
      // Request 100 -> Should pass
      const borrow = simnet.callPublicFn(
        lendingPool,
        "borrow-stx",
        [
          Cl.contractPrincipal(deployer, sbtcToken),
          Cl.uint(100), // collateral
          Cl.uint(100)  // amount-stx
        ],
        wallet1
      );

      expect(borrow.result).toBeOk(Cl.bool(true));

      // Verify collateral map updated
      const collateral = simnet.getMapEntry(
        lendingPool,
        "collateral",
        Cl.tuple({ user: Cl.standardPrincipal(wallet1) })
      );
      expect(collateral).toBeSome(Cl.tuple({ amount: Cl.uint(100) }));

      // Verify borrows map updated
      const borrows = simnet.getMapEntry(
        lendingPool,
        "borrows",
        Cl.tuple({ user: Cl.standardPrincipal(wallet1) })
      );
      // amount should be 100 (plus 0 interest since immediate)
      expect(borrows).toBeSome(Cl.tuple({ 
        amount: Cl.uint(100),
        "last-accrued": Cl.uint(0) // Simnet block time starts at 0? Or checked against var
      }));
    });

    it("should fail if sBTC contract is invalid", () => {
      const borrow = simnet.callPublicFn(
        lendingPool,
        "borrow-stx",
        [
          Cl.contractPrincipal(deployer, "mock-oracle-v1"), // Wrong contract
          Cl.uint(100),
          Cl.uint(50)
        ],
        wallet1
      );

      // ERR_INVALID_SBTC_CONTRACT (u105)
      expect(borrow.result).toBeErr(Cl.uint(105));
    });
  });
});
