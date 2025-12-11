# Clarity 4 Implementation Plan

## Overview

This document outlines the plan for upgrading the dual-asset lending protocol to use **Clarity 4** features. Clarity 4 was activated at Bitcoin block 923222 (November 2025) and introduces powerful new capabilities that enhance security, simplify code, and future-proof our smart contracts.

## Current Status

- **Current Clarity Version**: 3
- **Target Clarity Version**: 4
- **Activation Block**: Bitcoin block 923222 (November 2025)
- **Status**: ✅ Ready for implementation

## Clarity 4 Features to Implement

### 1. `stacks-block-time` - Block Timestamp Access

**Current Implementation (Clarity 3):**
```clarity
(define-private (get-latest-timestamp)
  (unwrap! (get time (unwrap! (get-stacks-block-info? time (- stacks-block-height u1)) (err u999))) (err u999))
)
```

**New Implementation (Clarity 4):**
```clarity
;; Direct access to current block timestamp
stacks-block-time
```

**Where to Use:**
- ✅ Replace `get-latest-timestamp` helper function in `lending-pool.clar`
- ✅ Initialize `last-interest-accrual` with `stacks-block-time` instead of `(get-latest-timestamp)`
- ✅ Use in `accrue-interest` function for time-based calculations
- ✅ Use in `get-debt` function for interest calculations
- ✅ Use for any time-based logic (lockups, expirations, etc.)

**Benefits:**
- Simpler, more readable code
- Direct access without helper function
- Reduced gas costs (fewer function calls)
- More accurate timestamp access

**Files to Update:**
- `contracts/lending-pool.clar` (when implemented)
- `issues.md` - Update Issue #4 to use `stacks-block-time`

---

### 2. `contract-hash?` - On-Chain Contract Verification

**Use Case:**
Verify that external contracts match expected implementations before interacting with them.

**Where to Use:**

#### A. Oracle Contract Verification
```clarity
;; Verify mock-oracle contract hash before price calls
(define-constant EXPECTED_ORACLE_HASH (some 0x...)) ;; Set during deployment

(define-private (verify-oracle-contract)
  (let ((oracle-hash (contract-hash? .mock-oracle)))
    (asserts! (is-eq oracle-hash EXPECTED_ORACLE_HASH) ERR_INVALID_ORACLE)
    (ok true)
  )
)
```

**Implementation Points:**
- ✅ Add verification in `get-sbtc-stx-price` function
- ✅ Verify oracle contract before any price queries
- ✅ Add error constant: `ERR_INVALID_ORACLE (err u104)`

#### B. sBTC Token Contract Verification
```clarity
;; Verify sBTC token contract before transfers
(define-constant EXPECTED_SBTC_HASH (some 0x...))

(define-private (verify-sbtc-contract)
  (let ((sbtc-hash (contract-hash? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token)))
    (asserts! (is-eq sbtc-hash EXPECTED_SBTC_HASH) ERR_INVALID_SBTC_CONTRACT)
    (ok true)
  )
)
```

**Implementation Points:**
- ✅ Verify before collateral deposits in `borrow-stx`
- ✅ Verify before collateral withdrawals in `repay`
- ✅ Add error constant: `ERR_INVALID_SBTC_CONTRACT (err u105)`

#### C. Bitflow DEX Contract Verification
```clarity
;; Verify Bitflow swap helper contract before swaps
(define-constant EXPECTED_BITFLOW_HASH (some 0x...))

(define-private (verify-bitflow-contract)
  (let ((bitflow-hash (contract-hash? 'SM1793C4R5PZ4NS4VQ4WMP7SKKYVH8JZEWSZ9HCCR.xyk-swap-helper-v-1-3)))
    (asserts! (is-eq bitflow-hash EXPECTED_BITFLOW_HASH) ERR_INVALID_DEX_CONTRACT)
    (ok true)
  )
)
```

**Implementation Points:**
- ✅ Verify before liquidation swaps in `liquidate` function
- ✅ Add error constant: `ERR_INVALID_DEX_CONTRACT (err u106)`

**Benefits:**
- Prevents interacting with malicious or upgraded contracts
- Ensures contract integrity before critical operations
- Enhanced security for protocol assets
- Trustless verification of external dependencies

**Files to Update:**
- `contracts/lending-pool.clar` - Add verification functions
- `contracts/mock-oracle.clar` - Optional: Add self-verification
- Add constants for expected contract hashes

---

### 3. `restrict-assets?` - Post-Condition Asset Protection

**Use Case:**
Protect contract assets when calling external contracts (traits, oracles, DEX).

**Where to Use:**

#### A. Oracle Price Calls
```clarity
(define-public (get-sbtc-stx-price)
  (restrict-assets?
    (contract-call? .mock-oracle get-price)
    tx-sender
    (list)  ;; No assets should move
  )
)
```

**Implementation Points:**
- ✅ Wrap oracle calls in `restrict-assets?`
- ✅ Ensure no assets are moved during price queries

#### B. External Contract Calls (Traits)
```clarity
(define-public (some-function)
  (let ((result (restrict-assets?
    (contract-call? external-contract some-function params)
    tx-sender
    (list { asset: 'STX, amount: u0 })  ;; No STX should move
  )))
    ;; Process result
  )
)
```

**Implementation Points:**
- ✅ Protect STX reserves when calling external contracts
- ✅ Protect sBTC collateral when calling DEX
- ✅ Add protection in `liquidate` function before DEX swaps

**Benefits:**
- Automatic rollback if external contract moves assets unexpectedly
- Protection against malicious or buggy external contracts
- Safer integration with third-party protocols
- Prevents asset drainage attacks

**Files to Update:**
- `contracts/lending-pool.clar` - Add `restrict-assets?` wrappers
- All functions that call external contracts

---

### 4. `to-ascii?` - Value to ASCII String Conversion

**Use Case:**
Generate readable error messages and logging.

**Where to Use:**
```clarity
;; Convert error codes to readable messages
(define-read-only (get-error-message (error-code uint))
  (ok (to-ascii? error-code))
)

;; Log principal addresses in events
(define-public (log-action (user principal))
  (let ((user-str (unwrap! (to-ascii? user) "")))
    ;; Use in events or logging
    (ok true)
  )
)
```

**Implementation Points:**
- ✅ Optional: Enhanced error messages
- ✅ Optional: Debug logging
- ✅ Future: Cross-chain message generation

**Benefits:**
- Human-readable error messages
- Better debugging capabilities
- Cross-chain integration support

**Files to Update:**
- Optional enhancement for better UX

---

### 5. `secp256r1-verify` - Passkey Integration

**Use Case:**
Hardware wallet and biometric authentication support.

**Where to Use:**
```clarity
;; Verify passkey signature for admin functions
(define-public (admin-action (signature (buff 65)) (message-hash (buff 32)))
  (let ((is-valid (secp256r1-verify message-hash signature admin-principal)))
    (asserts! is-valid ERR_INVALID_SIGNATURE)
    ;; Execute admin action
  )
)
```

**Implementation Points:**
- ✅ Future: Admin function authentication
- ✅ Future: Multi-sig support with passkeys
- ✅ Future: Enhanced security for critical operations

**Benefits:**
- Hardware wallet support
- Biometric transaction signing
- Enhanced security for admin functions
- Future-proof authentication

**Files to Update:**
- Future enhancement (not critical for MVP)

---

## Implementation Phases

### Phase 1: Core Upgrade (Priority: High)
**Status**: Ready to implement

1. ✅ Update `Clarinet.toml` to `clarity_version = 4`
2. ✅ Replace `get-latest-timestamp` with `stacks-block-time`
3. ✅ Update all time-based logic to use `stacks-block-time`
4. ✅ Test time-based calculations

**Estimated Impact**: High - Simplifies code, reduces gas costs

---

### Phase 2: Security Enhancements (Priority: High)
**Status**: Ready to implement

1. ✅ Add `contract-hash?` verification for oracle
2. ✅ Add `contract-hash?` verification for sBTC token
3. ✅ Add `contract-hash?` verification for Bitflow DEX
4. ✅ Add `restrict-assets?` protection for external calls
5. ✅ Test contract verification logic

**Estimated Impact**: High - Critical security improvements

---

### Phase 3: Optional Enhancements (Priority: Medium)
**Status**: Future consideration

1. ⏳ Add `to-ascii?` for better error messages
2. ⏳ Add `secp256r1-verify` for passkey support
3. ⏳ Enhanced logging and debugging

**Estimated Impact**: Medium - UX improvements

---

## Migration Checklist

### Configuration Updates
- [x] Update `Clarinet.toml` - Set `clarity_version = 4` for all contracts
- [ ] Verify Clarinet version supports Clarity 4
- [ ] Update deployment scripts if needed

### Code Updates
- [ ] Replace `get-latest-timestamp` with `stacks-block-time`
- [ ] Remove `get-latest-timestamp` helper function
- [ ] Add `contract-hash?` verification functions
- [ ] Add contract hash constants
- [ ] Add `restrict-assets?` wrappers for external calls
- [ ] Update error constants for new error codes

### Testing
- [ ] Test `stacks-block-time` functionality
- [ ] Test contract hash verification
- [ ] Test `restrict-assets?` protection
- [ ] Verify all existing tests still pass
- [ ] Add new tests for Clarity 4 features

### Documentation
- [x] Update README.md with Clarity 4 information
- [x] Create this implementation plan
- [ ] Update code comments
- [ ] Update deployment documentation

---

## Contract Hash Constants

These will need to be set during deployment after contracts are deployed:

```clarity
;; Contract hash constants (set after deployment)
(define-constant EXPECTED_ORACLE_HASH (some 0x0000000000000000000000000000000000000000000000000000000000000000))
(define-constant EXPECTED_SBTC_HASH (some 0x0000000000000000000000000000000000000000000000000000000000000000))
(define-constant EXPECTED_BITFLOW_HASH (some 0x0000000000000000000000000000000000000000000000000000000000000000))
```

**Note**: These hashes will be populated after contracts are deployed and verified.

---

## Error Constants to Add

```clarity
(define-constant ERR_INVALID_ORACLE (err u104))
(define-constant ERR_INVALID_SBTC_CONTRACT (err u105))
(define-constant ERR_INVALID_DEX_CONTRACT (err u106))
```

---

## Testing Strategy

1. **Unit Tests**: Test each Clarity 4 feature in isolation
2. **Integration Tests**: Test interactions with external contracts
3. **Security Tests**: Verify contract hash verification works
4. **Gas Tests**: Compare gas costs before/after upgrade
5. **Regression Tests**: Ensure existing functionality still works

---

## Rollback Plan

If issues arise:
1. Revert `Clarinet.toml` to `clarity_version = 3`
2. Restore `get-latest-timestamp` helper function
3. Remove Clarity 4-specific code
4. Re-run all tests

---

## Resources

- [Clarity 4 Announcement](https://docs.stacks.co/whats-new/clarity-4-is-now-live)
- [SIP-033 Specification](https://github.com/stacksgov/sips)
- [SIP-034 Specification](https://github.com/stacksgov/sips)
- [Clarity Language Reference](https://docs.stacks.co/docs/clarity)

---

## Next Steps

1. ✅ Review and approve this implementation plan
2. ⏳ Update `Clarinet.toml` to Clarity 4
3. ⏳ Implement Phase 1 (Core Upgrade)
4. ⏳ Test Phase 1 changes
5. ⏳ Implement Phase 2 (Security Enhancements)
6. ⏳ Test Phase 2 changes
7. ⏳ Deploy and verify contract hashes
8. ⏳ Update contract hash constants
9. ⏳ Final testing and deployment

---

**Last Updated**: December 2025  
**Status**: Ready for Implementation  
**Priority**: High

