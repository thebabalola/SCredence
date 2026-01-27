# Project Issues - SCredence (Service Verification Protocol)

This document outlines the roadmap and tasks for building the Bitcoin-anchored service verification protocol.

## Smart Contract Issues

### Issuer Management

#### Issue #1: Implement Issuer Registration
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Enable the contract owner to register and manage authorized issuers.

---

### Service Proofs

#### Issue #2: Implement Proof Issuance
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Allow authorized issuers to create immutable service verification records.

#### Issue #3: Implement Proof Verification
**Priority:** High  
**Status:** ✅ Completed  
**Description:** Public functions to verify the authenticity of a credential hash.

---

### Security & Controls

#### Issue #4: Proof Revocation Mechanism
**Priority:** High  
**Status:** ❌ Pending  
**Description:** Enable issuers to revoke proofs in case of errors or fraudulent information.
- **Tasks:**
  - [ ] Add `revoked-proofs` map.
  - [ ] Implement `revoke-service-proof` function.
  - [ ] Update verification logic to check for revocation status.

#### Issue #5: Proof Expiration & Renewal
**Priority:** Medium  
**Status:** ❌ Pending  
**Description:** Support time-limited credentials that can be renewed by issuers.

---

## Frontend Issues

### Wallet & Identity

#### Issue #6: Stacks Wallet Integration
**Priority:** High  
**Status:** ❌ Pending  
**Description:** Connect Leather/Xverse wallets to the dApp.

#### Issue #7: Issuer Dashboard
**Priority:** High  
**Status:** ❌ Pending  
**Description:** Interface for authorized organizations to issue and manage proofs.
